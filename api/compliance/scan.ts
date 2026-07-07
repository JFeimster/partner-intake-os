/**
 * Compliance scan endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { scanCompliance } from "../../lib/compliance/scan";
import { safeRewrite } from "../../lib/compliance/safe-rewrite";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  const text = String(req.body?.text ?? "");
  if (!text.trim()) return res.status(400).json({ error: "missing_text" });

  const scan = scanCompliance(text);
  const rewrite = safeRewrite(text);

  return res.status(200).json({
    ok: scan.ok_for_use,
    scan,
    rewrite,
    queue_recommended: scan.manual_review_required
  });
}
