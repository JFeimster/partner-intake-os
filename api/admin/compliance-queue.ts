/**
 * Admin compliance queue endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

function requireAdmin(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      data: [
        {
          queue_item_id: "cmp_demo_001",
          source_type: "campaign_kit",
          source_id: "demo_campaign",
          severity: "blocked",
          flagged_terms: ["guaranteed approval"],
          status: "needs_review",
          recommended_action: "Rewrite before public use."
        }
      ]
    });
  }

  if (req.method === "POST") {
    return res.status(202).json({
      ok: true,
      status: "received_for_review",
      message: "Compliance decision received. Production persistence should write to audit log."
    });
  }

  return res.status(405).json({ error: "method_not_allowed" });
}
