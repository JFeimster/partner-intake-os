import type { PartnerProfile, PartnerSyncEvent, SyncConfig, SyncResult } from "./sync-types";
import { buildSyncResult, hasReviewRisk, normalizePartnerId, safePartnerSummary } from "./sync-types";

const NOTION_VERSION = "2022-06-28";

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function titleProperty(value: string) {
  return {
    title: [
      {
        text: { content: value || "Unnamed Partner" }
      }
    ]
  };
}

function richTextProperty(value: unknown) {
  const content = text(value).slice(0, 1900);
  return {
    rich_text: content ? [{ text: { content } }] : []
  };
}

function selectProperty(value: unknown) {
  const name = text(value);
  return name ? { select: { name } } : { select: null };
}

function multiSelectProperty(values?: string[]) {
  return {
    multi_select: (values || []).filter(Boolean).slice(0, 20).map((name) => ({ name: String(name).slice(0, 100) }))
  };
}

function emailProperty(value: unknown) {
  const email = text(value);
  return { email: email || null };
}

function phoneProperty(value: unknown) {
  const phone = text(value);
  return { phone_number: phone || null };
}

function checkboxProperty(value: boolean) {
  return { checkbox: Boolean(value) };
}

function dateProperty(value?: string) {
  return value ? { date: { start: value } } : { date: null };
}

export function mapPartnerToNotionProperties(partner: PartnerProfile, event: PartnerSyncEvent): Record<string, unknown> {
  const partnerId = normalizePartnerId(partner);
  const displayName = partner.company || partner.display_name || partner.email || partnerId;

  return {
    Partner: titleProperty(displayName),
    "Partner ID": richTextProperty(partnerId),
    Status: selectProperty(partner.status || "Pending Review"),
    "Partner Type": selectProperty(partner.partner_type || "Needs Review"),
    "Partner Tier": selectProperty(partner.partner_tier || "Unassigned"),
    "Onboarding Path": selectProperty(partner.onboarding_path || "manual_review"),
    "Contact Name": richTextProperty(partner.display_name || ""),
    Email: emailProperty(partner.email),
    Phone: phoneProperty(partner.phone),
    Company: richTextProperty(partner.company || ""),
    "Primary Audience": richTextProperty(partner.primary_audience || ""),
    "Risk Level": selectProperty(partner.risk_level || "unknown"),
    Source: selectProperty(partner.source || event.source || "api"),
    Tags: multiSelectProperty(partner.tags),
    "Manual Review": checkboxProperty(hasReviewRisk(event)),
    "Next Action": richTextProperty(partner.next_action || "Review partner record"),
    "Review Notes": richTextProperty(partner.reviewer_notes || event.scorecard?.reasoning_summary || ""),
    "Created At": dateProperty(partner.created_at || event.created_at || new Date().toISOString()),
    "Updated At": dateProperty(partner.updated_at || new Date().toISOString())
  };
}

export async function syncPartnerToNotion(event: PartnerSyncEvent, config: SyncConfig): Promise<SyncResult> {
  const partnerId = normalizePartnerId(event.partner);
  const dryRun = event.dry_run ?? config.dryRun;
  const needsReview = hasReviewRisk(event);

  if (needsReview) {
    return buildSyncResult({
      status: "needs_review",
      target: "notion",
      mode: config.mode,
      dry_run: dryRun,
      event_id: event.event_id,
      partner_id: partnerId,
      needs_review: true,
      message: "Partner record requires manual review before sandbox sync.",
      safe_log: safePartnerSummary(event.partner)
    });
  }

  if (!config.notionApiKey || !config.notionDatabaseId) {
    return buildSyncResult({
      status: "skipped",
      target: "notion",
      mode: config.mode,
      dry_run: dryRun,
      event_id: event.event_id,
      partner_id: partnerId,
      message: "Notion sandbox sync skipped because NOTION_API_KEY or NOTION_PARTNER_DATABASE_ID is missing.",
      safe_log: safePartnerSummary(event.partner)
    });
  }

  const properties = mapPartnerToNotionProperties(event.partner, event);

  if (dryRun) {
    return buildSyncResult({
      status: "queued",
      target: "notion",
      mode: config.mode,
      dry_run: true,
      event_id: event.event_id,
      partner_id: partnerId,
      message: "Dry-run Notion sandbox sync queued. No Notion page was created.",
      safe_log: {
        ...safePartnerSummary(event.partner),
        notion_database_id_present: true,
        property_count: Object.keys(properties).length
      }
    });
  }

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.notionApiKey}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION
      },
      body: JSON.stringify({
        parent: { database_id: config.notionDatabaseId },
        properties
      })
    });

    const responseJson = (await response.json().catch(() => ({}))) as { id?: string; url?: string; code?: string; message?: string };

    if (!response.ok) {
      return buildSyncResult({
        status: "failed",
        target: "notion",
        mode: config.mode,
        dry_run: false,
        event_id: event.event_id,
        partner_id: partnerId,
        error_code: responseJson.code || `notion_http_${response.status}`,
        message: "Notion sandbox sync failed. Check database permissions, property names, and env vars.",
        safe_log: safePartnerSummary(event.partner)
      });
    }

    return buildSyncResult({
      status: "synced",
      target: "notion",
      mode: config.mode,
      dry_run: false,
      event_id: event.event_id,
      partner_id: partnerId,
      external_id: responseJson.id,
      external_url: responseJson.url,
      message: "Partner record synced to Notion sandbox review database.",
      safe_log: safePartnerSummary(event.partner)
    });
  } catch (error) {
    return buildSyncResult({
      status: "failed",
      target: "notion",
      mode: config.mode,
      dry_run: false,
      event_id: event.event_id,
      partner_id: partnerId,
      error_code: "notion_request_failed",
      message: error instanceof Error ? error.message : "Unknown Notion request failure.",
      safe_log: safePartnerSummary(event.partner)
    });
  }
}
