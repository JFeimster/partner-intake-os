import type { PartnerSyncEvent, SyncResult } from "./sync-types";
import { nowIso, safePartnerSummary } from "./sync-types";

export interface SyncLogEntry {
  log_id: string;
  event_id?: string;
  target: string;
  status: string;
  partner_id?: string;
  message: string;
  safe_summary: Record<string, unknown>;
  created_at: string;
}

export function createSyncLogEntry(result: SyncResult, event?: PartnerSyncEvent): SyncLogEntry {
  return {
    log_id: `sync_log_${Date.now().toString(36)}`,
    event_id: result.event_id || event?.event_id,
    target: result.target,
    status: result.status,
    partner_id: result.partner_id || event?.partner.partner_id,
    message: result.message,
    safe_summary: event ? safePartnerSummary(event.partner) : result.safe_log || {},
    created_at: nowIso()
  };
}

export function redactSyncEvent(event: PartnerSyncEvent): Record<string, unknown> {
  return {
    event_id: event.event_id,
    event_type: event.event_type,
    source: event.source,
    dry_run: event.dry_run,
    partner: safePartnerSummary(event.partner),
    scorecard: event.scorecard
      ? {
          overall_score: event.scorecard.overall_score,
          tier_recommendation: event.scorecard.tier_recommendation,
          manual_review_required: event.scorecard.manual_review_required
        }
      : undefined,
    risk_flags: event.risk_flags || [],
    manual_review_required: event.manual_review_required,
    created_at: event.created_at
  };
}

export function summarizeSyncResults(results: SyncResult[]): Record<string, unknown> {
  return {
    total: results.length,
    synced: results.filter((item) => item.status === "synced").length,
    queued: results.filter((item) => item.status === "queued").length,
    skipped: results.filter((item) => item.status === "skipped").length,
    failed: results.filter((item) => item.status === "failed").length,
    needs_review: results.filter((item) => item.status === "needs_review").length,
    targets: results.map((item) => item.target),
    created_at: nowIso()
  };
}

export function safeConsoleInfo(label: string, payload: Record<string, unknown>): void {
  // Keep logs operational. Never dump raw intake payloads, phone numbers, notes, documents, or webhook bodies.
  console.info(`[partner-intake-sync] ${label}`, JSON.stringify(payload));
}
