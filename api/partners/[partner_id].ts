import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPartnerById } from "../../lib/db/partners";
import { listLeadsByPartner } from "../../lib/db/leads";
import { listPartnerEvents } from "../../lib/db/events";

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.json(body);
}

function isSafePartnerRead(req: VercelRequest): boolean {
  const adminToken = process.env.PARTNER_INTAKE_ADMIN_TOKEN;
  const actionToken = process.env.PARTNER_INTAKE_ACTION_TOKEN;

  const header = req.headers.authorization || "";

  if (adminToken && header === `Bearer ${adminToken}`) return true;
  if (actionToken && header === `Bearer ${actionToken}`) return true;

  // Development convenience only. Do not rely on this in production.
  return process.env.PARTNER_INTAKE_ENV !== "production";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "method_not_allowed", message: "Use GET." });
  }

  if (!isSafePartnerRead(req)) {
    return sendJson(res, 401, {
      error: "unauthorized",
      message: "Partner profile access requires authorization."
    });
  }

  const partnerId = req.query.partner_id as string | undefined;
  if (!partnerId) {
    return sendJson(res, 400, {
      error: "missing_partner_id",
      message: "partner_id is required."
    });
  }

  try {
    const partner = await getPartnerById(partnerId);

    if (!partner) {
      return sendJson(res, 404, {
        error: "partner_not_found",
        message: "No partner record found for that ID."
      });
    }

    const [leads, events] = await Promise.all([
      listLeadsByPartner(partnerId, 25),
      listPartnerEvents(partnerId, 25)
    ]);

    return sendJson(res, 200, {
      ok: true,
      partner,
      related: {
        leads,
        events
      },
      language_guardrail:
        "Record is received for review. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed."
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "partner_read_failed",
      message: error instanceof Error ? error.message : "Unable to read partner profile."
    });
  }
}
