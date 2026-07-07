/**
 * Admin-visible sync status summaries
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export interface SyncStatusSummary {
  target_system: "hubspot" | "notion" | "all";
  queued: number;
  running: number;
  succeeded_24h: number;
  failed_retryable: number;
  failed_terminal: number;
  needs_review: number;
  paused: number;
  last_success_at?: string | null;
  last_failure_at?: string | null;
  health: "healthy" | "degraded" | "attention_required";
}

export function summarizeSyncJobs(jobs: Array<{ target_system: string; status: string; updated_at?: string }>, target: "hubspot" | "notion" | "all" = "all"): SyncStatusSummary {
  const scoped = target === "all" ? jobs : jobs.filter((job) => job.target_system === target);
  const count = (status: string) => scoped.filter((job) => job.status === status).length;
  const succeeded = scoped.filter((job) => job.status === "succeeded").sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));
  const failed = scoped.filter((job) => job.status.startsWith("failed") || job.status === "needs_review").sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at)));

  const failed_retryable = count("failed_retryable");
  const failed_terminal = count("failed_terminal");
  const needs_review = count("needs_review");

  const health: SyncStatusSummary["health"] =
    failed_terminal > 0 || needs_review > 0 ? "attention_required" :
    failed_retryable > 0 ? "degraded" :
    "healthy";

  return {
    target_system: target,
    queued: count("queued"),
    running: count("running"),
    succeeded_24h: count("succeeded"),
    failed_retryable,
    failed_terminal,
    needs_review,
    paused: count("paused"),
    last_success_at: succeeded[0]?.updated_at ?? null,
    last_failure_at: failed[0]?.updated_at ?? null,
    health
  };
}
