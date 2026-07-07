/**
 * Resource recommendation endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { recommendResources } from "../../lib/resources/recommend-resources";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const recommendations = recommendResources(req.body ?? {});
  return res.status(200).json({
    ok: true,
    recommendations,
    status: "received_for_review",
    note: "Recommendations are educational and operational. No funding, approval, commission, or business outcome is guaranteed."
  });
}
