/**
 * Production sync retry queue helpers
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export type SyncTarget = "notion" | "hubspot";
export type SyncJobStatus =
  | "queued"
  | "running"
  | "succeeded"
  | "failed_retryable"
  | "failed_terminal"
  | "needs_review"
  | "paused";

export interface SyncJob {
  sync_job_id?: string;
  record_type: "partner" | "lead" | "tracking_link" | "campaign" | "resource";
  record_id: string;
  target_system: SyncTarget;
  operation: "create" | "update" | "upsert" | "delete" | "retry";
  status: SyncJobStatus;
  attempt_count: number;
  last_error?: string | null;
  next_retry_at?: string | null;
  payload?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

const RETRY_DELAYS_MS = [
  5 * 60 * 1000,
  15 * 60 * 1000,
  60 * 60 * 1000,
  4 * 60 * 60 * 1000,
  24 * 60 * 60 * 1000
];

export function isRetryableStatusCode(statusCode: number): boolean {
  return statusCode === 429 || statusCode === 408 || statusCode >= 500;
}

export function classifySyncError(input: { statusCode?: number; code?: string; message?: string }): SyncJobStatus {
  const message = `${input.code ?? ""} ${input.message ?? ""}`.toLowerCase();

  if (message.includes("sensitive") || message.includes("locked field") || message.includes("schema mismatch")) {
    return "needs_review";
  }

  if (input.statusCode && isRetryableStatusCode(input.statusCode)) {
    return "failed_retryable";
  }

  if (input.statusCode === 401 || input.statusCode === 403 || input.statusCode === 404) {
    return "failed_terminal";
  }

  return "failed_retryable";
}

export function getNextRetryAt(attemptCount: number, now = new Date()): string | null {
  if (attemptCount >= RETRY_DELAYS_MS.length) return null;
  return new Date(now.getTime() + RETRY_DELAYS_MS[attemptCount]).toISOString();
}

export function buildRetryJob(job: SyncJob, error: { statusCode?: number; code?: string; message?: string }): SyncJob {
  const attempt_count = job.attempt_count + 1;
  const status = classifySyncError(error);
  return {
    ...job,
    status,
    attempt_count,
    last_error: error.message ?? error.code ?? `HTTP ${error.statusCode ?? "unknown"}`,
    next_retry_at: status === "failed_retryable" ? getNextRetryAt(attempt_count) : null,
    updated_at: new Date().toISOString()
  };
}

export function shouldRunRetry(job: SyncJob, now = new Date()): boolean {
  if (job.status !== "failed_retryable" && job.status !== "queued") return false;
  if (!job.next_retry_at) return job.status === "queued";
  return new Date(job.next_retry_at).getTime() <= now.getTime();
}
