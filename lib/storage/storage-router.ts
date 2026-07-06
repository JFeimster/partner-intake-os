import { syncPartnerToHubSpot } from "./hubspot";
import { syncPartnerToNotion } from "./notion";
import { createSyncLogEntry, safeConsoleInfo, summarizeSyncResults } from "./sync-log";
import type { PartnerSyncEvent, SyncConfig, SyncResult } from "./sync-types";
import { buildSyncResult, createSyncConfig, normalizePartnerId, safePartnerSummary } from "./sync-types";

function mockSync(event: PartnerSyncEvent, config: SyncConfig): SyncResult {
  return buildSyncResult({
    status: "queued",
    target: "mock",
    mode: config.mode,
    dry_run: true,
    event_id: event.event_id,
    partner_id: normalizePartnerId(event.partner),
    external_id: `mock_${Date.now().toString(36)}`,
    message: "Mock storage mode queued the sync event. No external system was called.",
    safe_log: safePartnerSummary(event.partner)
  });
}

export async function routePartnerSync(event: PartnerSyncEvent, overrideConfig?: Partial<SyncConfig>): Promise<SyncResult[]> {
  const config = {
    ...createSyncConfig(),
    ...overrideConfig
  };

  const normalizedEvent: PartnerSyncEvent = {
    ...event,
    event_id: event.event_id || `sync_evt_${Date.now().toString(36)}`,
    created_at: event.created_at || new Date().toISOString(),
    dry_run: event.dry_run ?? config.dryRun
  };

  let results: SyncResult[];

  switch (config.mode) {
    case "notion":
      results = [await syncPartnerToNotion(normalizedEvent, config)];
      break;
    case "hubspot":
      results = [await syncPartnerToHubSpot(normalizedEvent, config)];
      break;
    case "dual_sandbox":
      results = await Promise.all([
        syncPartnerToNotion(normalizedEvent, config),
        syncPartnerToHubSpot(normalizedEvent, config)
      ]);
      break;
    case "mock":
    default:
      results = [mockSync(normalizedEvent, config)];
      break;
  }

  const logs = results.map((result) => createSyncLogEntry(result, normalizedEvent));

  safeConsoleInfo("sync_summary", {
    event_id: normalizedEvent.event_id,
    mode: config.mode,
    summary: summarizeSyncResults(results),
    logs
  });

  return results;
}

export async function routePartnerSyncSingle(event: PartnerSyncEvent, overrideConfig?: Partial<SyncConfig>): Promise<SyncResult> {
  const results = await routePartnerSync(event, overrideConfig);
  if (results.length === 1) return results[0];

  const hasFailure = results.some((result) => result.status === "failed");
  const hasReview = results.some((result) => result.status === "needs_review");

  return buildSyncResult({
    status: hasFailure ? "failed" : hasReview ? "needs_review" : "queued",
    target: "dual_sandbox",
    mode: overrideConfig?.mode || createSyncConfig().mode,
    dry_run: results.every((result) => result.dry_run),
    event_id: event.event_id,
    partner_id: normalizePartnerId(event.partner),
    message: "Dual sandbox sync completed with aggregate status. Inspect per-target results for details.",
    safe_log: {
      partner: safePartnerSummary(event.partner),
      results: results.map((result) => ({ target: result.target, status: result.status, message: result.message }))
    }
  });
}
