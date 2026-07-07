/**
 * Manual Notion sync retry endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { buildRetryJob } from "../../../lib/sync/retry-queue";

function requireAdmin(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const { sync_job_id, reason } = req.body ?? {};
  if (!sync_job_id) return res.status(400).json({ error: "missing_sync_job_id" });

  // Production wiring: load sync job from database, verify target_system === "notion", then enqueue retry.
  const queued = buildRetryJob(
    {
      sync_job_id,
      record_type: "partner",
      record_id: "pending_database_lookup",
      target_system: "notion",
      operation: "retry",
      status: "queued",
      attempt_count: 0,
      payload: { manual_retry_reason: reason ?? "manual retry requested" }
    },
    { message: "manual_retry_requested" }
  );

  return res.status(202).json({
    ok: true,
    message: "Notion sync retry queued for review-safe execution.",
    sync_job: queued
  });
}
