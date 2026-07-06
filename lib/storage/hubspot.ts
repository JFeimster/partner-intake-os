import { getEnv, getStorageMode } from "../env";
import type {
  PartnerEventRecord,
  PartnerRecord,
  StorageConnector,
  StorageOperationResult
} from "./storage-router";

export type HubSpotConfig = {
  access_token: string;
  partner_pipeline_id: string;
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

export function getHubSpotConfig(): HubSpotConfig {
  return {
    access_token: getEnv("HUBSPOT_ACCESS_TOKEN"),
    partner_pipeline_id: getEnv("HUBSPOT_PARTNER_PIPELINE_ID"),
    live_writes_enabled: getEnv("PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES", "false") === "true"
  };
}

export function isHubSpotConfigured(): boolean {
  return getHubSpotConfig().access_token.length > 0;
}

export function mapPartnerToHubSpotContactProperties(record: PartnerRecord): Record<string, string> {
  const [firstname, ...rest] = record.display_name.split(" ");
  return {
    email: record.email,
    firstname: firstname || record.display_name,
    lastname: rest.join(" "),
    phone: record.phone || "",
    website: record.website || "",
    company: record.company || "",
    partner_id: record.partner_id,
    partner_type: record.partner_type,
    partner_tier: record.partner_tier,
    onboarding_path: record.onboarding_path,
    primary_audience: record.primary_audience,
    risk_level: record.risk_level,
    partner_status: record.status,
    partner_tags: record.tags.join(";"),
    recommended_resources: record.recommended_resources.join(";"),
    recommended_campaigns: record.recommended_campaigns.join(";"),
    next_action: record.next_action,
    partner_notes: record.notes || "",
    partner_created_at: record.created_at,
    partner_updated_at: record.updated_at
  };
}

export function mapPartnerToHubSpotDealProperties(record: PartnerRecord): Record<string, string> {
  return {
    dealname: `${record.display_name} — Partner Intake`,
    pipeline: getHubSpotConfig().partner_pipeline_id,
    partner_id: record.partner_id,
    partner_type: record.partner_type,
    partner_tier: record.partner_tier,
    onboarding_path: record.onboarding_path,
    partner_status: record.status,
    risk_level: record.risk_level,
    next_action: record.next_action
  };
}

function notConfigured<T>(action: string): StorageOperationResult<T> {
  return result({
    ok: false,
    mode: getStorageMode(),
    provider: "hubspot",
    action,
    error: "hubspot_not_configured",
    warnings: ["Set HUBSPOT_ACCESS_TOKEN before using HubSpot storage. HUBSPOT_PARTNER_PIPELINE_ID is recommended for deal/task routing."],
    dry_run: true
  });
}

function dryRun<T>(action: string, data: T, recordId?: string): StorageOperationResult<T> {
  return result({
    ok: true,
    mode: getStorageMode(),
    provider: "hubspot",
    action,
    record_id: recordId,
    data,
    warnings: [
      "HubSpot credentials are present, but live external writes are disabled for this scaffold.",
      "Replace the dry-run body with tested HubSpot CRM API calls before production writes."
    ],
    dry_run: true
  });
}

export const hubspotStorageConnector: StorageConnector = {
  provider: "hubspot",
  isConfigured: isHubSpotConfigured,

  async createPartnerRecord(record) {
    if (!isHubSpotConfigured()) return notConfigured("create_partner_record");

    return dryRun(
      "create_partner_record",
      {
        contact: {
          properties: mapPartnerToHubSpotContactProperties(record)
        },
        deal: {
          properties: mapPartnerToHubSpotDealProperties(record)
        }
      } as unknown as PartnerRecord,
      record.partner_id
    );
  },

  async updatePartnerRecord(partnerId, updates) {
    if (!isHubSpotConfigured()) return notConfigured("update_partner_record");

    return dryRun(
      "update_partner_record",
      {
        partner_id: partnerId,
        updates,
        lookup_required: "Find HubSpot contact/deal by partner_id before patching properties."
      } as unknown as PartnerRecord,
      partnerId
    );
  },

  async logPartnerEvent(event) {
    if (!isHubSpotConfigured()) return notConfigured("log_partner_event");

    const eventPayload: PartnerEventRecord = {
      ...event,
      metadata: {
        ...(event.metadata || {}),
        hubspot_note: "For production, create a note, task, or timeline event associated with the contact/deal."
      }
    };

    return dryRun("log_partner_event", eventPayload, event.event_id || event.partner_id);
  },

  async healthCheck() {
    const config = getHubSpotConfig();
    return result({
      ok: isHubSpotConfigured(),
      mode: getStorageMode(),
      provider: "hubspot",
      action: "health_check",
      data: {
        configured: isHubSpotConfigured(),
        notes: [
          `HUBSPOT_ACCESS_TOKEN: ${config.access_token ? "set" : "missing"}`,
          `HUBSPOT_PARTNER_PIPELINE_ID: ${config.partner_pipeline_id ? "set" : "missing"}`,
          `PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES: ${config.live_writes_enabled ? "true" : "false"}`,
          "Batch 06 HubSpot connector is a safe scaffold. Add tested HubSpot CRM calls before production writes."
        ]
      },
      dry_run: true
    });
  }
};
