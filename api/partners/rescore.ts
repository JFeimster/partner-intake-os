/**
 * Partner rescore endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { scorePartner } from "../../lib/scoring/score-partner";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const { partner, override } = req.body ?? {};
  if (!partner) return res.status(400).json({ error: "missing_partner" });

  const result = scorePartner(partner);

  return res.status(200).json({
    ok: true,
    partner_id: partner.partner_id ?? null,
    scoring_result: result,
    override_pattern: override ? {
      received_for_review: true,
      note: "Manual overrides should be written to tier history and audit log before persistence."
    } : null,
    guarantee_notice: "Scoring is for internal prioritization only. No partner performance, funding, approval, commission, or business outcome is guaranteed."
  });
}
