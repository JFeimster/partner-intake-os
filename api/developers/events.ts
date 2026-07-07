/**
 * Developer events list endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

function requireDeveloperKey(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_DEVELOPER_API_KEY && token === process.env.PARTNER_DEVELOPER_API_KEY);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireDeveloperKey(req)) return res.status(401).json({ error: "unauthorized" });

  return res.status(200).json({
    ok: true,
    events: [
      {
        event_id: "evt_demo_001",
        event_type: "partner.review_required",
        created_at: new Date().toISOString(),
        data: { partner_id: "ptr_demo_001", status: "needs_review" }
      }
    ],
    notice: "Payloads exclude sensitive borrower data, admin-only events, private notes, secrets, and commission data."
  });
}
