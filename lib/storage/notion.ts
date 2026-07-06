import { getEnv, getStorageMode } from "../env";
import type {
  PartnerEventRecord,
  PartnerRecord,
  StorageConnector,
  StorageOperationResult
} from "./storage-router";

export type NotionConfig = {
  api_key: string;
  partner_database_id: string;
  live_writes_enabled: boolean;
};

function now(): string {
  return new Date().toISOString();
}

function result<T>(input: Omit<StorageOperationResult<T>, "timestamp">): StorageOperationResult<T> {
  return {
    ...input,
    timestamp: now()
  };
}

export function getNotionConfig(): NotionConfig {
  return {
    api_key: getEnv("NOTION_API_KEY"),
    partner_database_id: getEnv("NOTION_PARTNER_DATABASE_ID"),
    live_writes_enabled: getEnv("PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES", "false") === "true"
  };
}

export function isNotionConfigured(): boolean {
  const config = getNotionConfig();
  return config.api_key.length > 0 && config.partner_database_id.length > 0;
}

export function mapPartnerToNotionProperties(record: PartnerRecord) {
  return {
    Name: { title: [{ text: { content: record.display_name } }] },
    "Partner ID": { rich_text: [{ text: { content: record.partner_id } }] },
    Company: { rich_text: [{ text: { content: record.company || "" } }] },
    Email: { email: record.email },
    Phone: { phone_number: record.phone || null },
    Website: { url: record.website || null },
    "Partner Type": { select: { name: record.partner_type } },
    "Partner Tier": { select: { name: record.partner_tier } },
    "Onboarding Path": { select: { name: record.onboarding_path } },
    "Risk Level": { select: { name: record.risk_level } },
    Status: { select: { name: record.status } },
    "Primary Audience": { rich_text: [{ text: { content: record.primary_audience } }] },
    Tags: { multi_select: record.tags.map((tag) => ({ name: tag })) },
    "Recommended Resources": { rich_text: [{ text: { content: record.recommended_resources.join(", ") } }] },
    "Recommended Campaigns": { rich_text: [{ text: { content: record.recommended_campaigns.join(", ") } }] },
    "Next Action": { rich_text: [{ text: { content: record.next_action } }] },
    Notes: { rich_text: [{ text: { content: record.notes || "" } }] },
    "Created At": { date: { start: record.created_at } },
    "Updated At": { date: { start: record.updated_at } }
  };
}

function notConfigured<T>(action: string): StorageOperationResult<T> {
  return result({
    ok: false,
    mode: getStorageMode(),
    provider: "notion",
    action,
    error: "notion_not_configured",
    warnings: ["Set NOTION_API_KEY and NOTION_PARTNER_DATABASE_ID before using Notion storage."],
    dry_run: true
  });
}

function dryRun<T>(action: string, data: T, recordId?: string): StorageOperationResult<T> {
  return result({
    ok: true,
    mode: getStorageMode(),
    provider: "notion",
    action,
    record_id: recordId,
    data,
    warnings: [
      "Notion credentials are present, but live external writes are disabled for this scaffold.",
      "Set PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES=true only after you replace this stub with tested Notion API calls."
    ],
    dry_run: true
  });
}

export const notionStorageConnector: StorageConnector = {
  provider: "notion",
  isConfigured: isNotionConfigured,

  async createPartnerRecord(record) {
    if (!isNotionConfigured()) return notConfigured("create_partner_record");

    return dryRun(
      "create_partner_record",
      {
        database_id: getNotionConfig().partner_database_id,
        properties: mapPartnerToNotionProperties(record)
      } as unknown as PartnerRecord,
      record.partner_id
    );
  },

  async updatePartnerRecord(partnerId, updates) {
    if (!isNotionConfigured()) return notConfigured("update_partner_record");

    return dryRun(
      "update_partner_record",
      {
        partner_id: partnerId,
        updates,
        lookup_required: "Find Notion page by Partner ID before patching page properties."
      } as unknown as PartnerRecord,
      partnerId
    );
  },

  async logPartnerEvent(event) {
    if (!isNotionConfigured()) return notConfigured("log_partner_event");

    return dryRun(
      "log_partner_event",
      {
        ...event,
        notion_note: "For production, write events to a related Notion activity database or append to Partner Activity rollup."
      },
      event.event_id || event.partner_id
    );
  },

  async healthCheck() {
    const config = getNotionConfig();
    return result({
      ok: isNotionConfigured(),
      mode: getStorageMode(),
      provider: "notion",
      action: "health_check",
      data: {
        configured: isNotionConfigured(),
        notes: [
          `NOTION_API_KEY: ${config.api_key ? "set" : "missing"}`,
          `NOTION_PARTNER_DATABASE_ID: ${config.partner_database_id ? "set" : "missing"}`,
          `PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES: ${config.live_writes_enabled ? "true" : "false"}`,
          "Batch 06 Notion connector is a safe scaffold. Add tested Notion API calls before production writes."
        ]
      },
      dry_run: true
    });
  }
};
