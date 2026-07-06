import type { PartnerProfile, PartnerSyncEvent, SyncConfig, SyncResult } from "./sync-types";
import { buildSyncResult, hasReviewRisk, normalizePartnerId, safePartnerSummary } from "./sync-types";

function text(value: unknown): string {
  return String(value ?? "").trim();
}

export function mapPartnerToHubSpotProperties(partner: PartnerProfile, event: PartnerSyncEvent): Record<string, string> {
  const partnerId = normalizePartnerId(partner);
  const [firstname, ...lastParts] = text(partner.display_name).split(" ").filter(Boolean);

  return {
    email: text(partner.email),
    firstname: firstname || text(partner.company) || "Partner",
    lastname: lastParts.join(" ") || "Intake",
    company: text(partner.company),
    phone: text(partner.phone),
    partner_id: partnerId,
    partner_type: text(partner.partner_type || "needs_review"),
    partner_tier: text(partner.partner_tier || "unassigned"),
    onboarding_path: text(partner.onboarding_path || "manual_review"),
    primary_audience: text(partner.primary_audience),
    risk_level: text(partner.risk_level || "unknown"),
    partner_status: text(partner.status || "pending_review"),
    partner_source: text(partner.source || event.source || "api"),
    next_action: text(partner.next_action || "Review partner record"),
    manual_review_required: String(hasReviewRisk(event)),
    intake_event_type: event.event_type,
    intake_event_source: event.source
  };
}

function hasMinimumContactFields(partner: PartnerProfile): boolean {
  return Boolean(text(partner.email) || text(partner.company) || text(partner.display_name));
}

export async function syncPartnerToHubSpot(event: PartnerSyncEvent, config: SyncConfig): Promise<SyncResult> {
  const partnerId = normalizePartnerId(event.partner);
  const dryRun = event.dry_run ?? config.dryRun;
  const needsReview = hasReviewRisk(event);

  if (!hasMinimumContactFields(event.partner)) {
    return buildSyncResult({
      status: "needs_review",
      target: "hubspot",
      mode: config.mode,
      dry_run: dryRun,
      event_id: event.event_id,
      partner_id: partnerId,
      needs_review: true,
      message: "HubSpot sync needs manual review because contact/company identifiers are missing.",
      safe_log: safePartnerSummary(event.partner)
    });
  }

  if (needsReview) {
    return buildSyncResult({
      status: "needs_review",
      target: "hubspot",
      mode: config.mode,
      dry_run: dryRun,
      event_id: event.event_id,
      partner_id: partnerId,
      needs_review: true,
      message: "Partner record requires manual review before HubSpot CRM/task pipeline sync.",
      safe_log: safePartnerSummary(event.partner)
    });
  }

  if (!config.hubspotAccessToken) {
    return buildSyncResult({
      status: "skipped",
      target: "hubspot",
      mode: config.mode,
      dry_run: dryRun,
      event_id: event.event_id,
      partner_id: partnerId,
      message: "HubSpot sandbox sync skipped because HUBSPOT_ACCESS_TOKEN is missing.",
      safe_log: safePartnerSummary(event.partner)
    });
  }

  const properties = mapPartnerToHubSpotProperties(event.partner, event);

  if (dryRun) {
    return buildSyncResult({
      status: "queued",
      target: "hubspot",
      mode: config.mode,
      dry_run: true,
      event_id: event.event_id,
      partner_id: partnerId,
      message: "Dry-run HubSpot sandbox sync queued. No HubSpot contact was created.",
      safe_log: {
        ...safePartnerSummary(event.partner),
        hubspot_token_present: true,
        property_count: Object.keys(properties).length
      }
    });
  }

  try {
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.hubspotAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ properties })
    });

    const responseJson = (await response.json().catch(() => ({}))) as { id?: string; message?: string; category?: string };

    if (!response.ok) {
      return buildSyncResult({
        status: "failed",
        target: "hubspot",
        mode: config.mode,
        dry_run: false,
        event_id: event.event_id,
        partner_id: partnerId,
        error_code: responseJson.category || `hubspot_http_${response.status}`,
        message: "HubSpot sandbox sync failed. Check private app scopes, property names, and duplicate contact rules.",
        safe_log: safePartnerSummary(event.partner)
      });
    }

    return buildSyncResult({
      status: "synced",
      target: "hubspot",
      mode: config.mode,
      dry_run: false,
      event_id: event.event_id,
      partner_id: partnerId,
      external_id: responseJson.id,
      message: "Partner record synced to HubSpot sandbox contact layer.",
      safe_log: safePartnerSummary(event.partner)
    });
  } catch (error) {
    return buildSyncResult({
      status: "failed",
      target: "hubspot",
      mode: config.mode,
      dry_run: false,
      event_id: event.event_id,
      partner_id: partnerId,
      error_code: "hubspot_request_failed",
      message: error instanceof Error ? error.message : "Unknown HubSpot request failure.",
      safe_log: safePartnerSummary(event.partner)
    });
  }
}
