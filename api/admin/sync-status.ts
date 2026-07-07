/**
 * Admin sync status endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { summarizeSyncJobs } from "../../lib/sync/sync-status";

function requireAdmin(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  // Replace with SELECT from sync_jobs once database adapter is wired.
  const demoJobs = [
    { target_system: "hubspot", status: "succeeded", updated_at: new Date().toISOString() },
    { target_system: "notion", status: "failed_retryable", updated_at: new Date().toISOString() },
    { target_system: "notion", status: "needs_review", updated_at: new Date().toISOString() }
  ];

  return res.status(200).json({
    ok: true,
    source_of_truth: "database",
    summaries: [
      summarizeSyncJobs(demoJobs, "all"),
      summarizeSyncJobs(demoJobs, "hubspot"),
      summarizeSyncJobs(demoJobs, "notion")
    ],
    note: "Demo status uses stub data until sync_jobs database reads are connected."
  });
}
