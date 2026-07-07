/**
 * Admin scoring rules endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { DEFAULT_TIER_RULES } from "../../lib/scoring/tier-rules";

function requireAdmin(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      source: "static_rules",
      tier_rules: DEFAULT_TIER_RULES,
      note: "Move these rules to database-backed versioning before production operators edit them."
    });
  }

  if (req.method === "POST") {
    return res.status(202).json({
      ok: true,
      message: "Scoring-rule update received for review. Production persistence should require audit logging.",
      status: "received_for_review"
    });
  }

  return res.status(405).json({ error: "method_not_allowed" });
}
