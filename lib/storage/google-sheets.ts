import { getEnv, getStorageMode } from "../env";
import type {
  PartnerEventRecord,
  PartnerRecord,
  StorageConnector,
  StorageOperationResult
} from "./storage-router";

export type GoogleSheetsConfig = {
  service_account_email: string;
  private_key: string;
  sheet_id: string;
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

export function getGoogleSheetsConfig(): GoogleSheetsConfig {
  return {
    service_account_email: getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
    private_key: getEnv("GOOGLE_PRIVATE_KEY"),
    sheet_id: getEnv("GOOGLE_SHEET_ID"),
    live_writes_enabled: getEnv("PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES", "false") === "true"
  };
}

export function isGoogleSheetsConfigured(): boolean {
  const config = getGoogleSheetsConfig();
  return config.service_account_email.length > 0 && config.private_key.length > 0 && config.sheet_id.length > 0;
}

export function mapPartnerToSheetRow(record: PartnerRecord): string[] {
  return [
    record.partner_id,
    record.display_name,
    record.company || "",
    record.email,
    record.phone || "",
    record.website || "",
    record.partner_type,
    record.partner_tier,
    record.onboarding_path,
    record.primary_audience,
    (record.secondary_audiences || []).join("; "),
    record.risk_level,
    record.status,
    record.tags.join("; "),
    record.recommended_resources.join("; "),
    record.recommended_campaigns.join("; "),
    record.next_action,
    record.notes || "",
    record.created_at,
    record.updated_at
  ];
}

function notConfigured<T>(action: string): StorageOperationResult<T> {
  return result({
    ok: false,
    mode: getStorageMode(),
    provider: "google_sheets",
    action,
    error: "google_sheets_not_configured",
    warnings: ["Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SHEET_ID before using Google Sheets storage."],
    dry_run: true
  });
}

function dryRun<T>(action: string, data: T, recordId?: string): StorageOperationResult<T> {
  return result({
    ok: true,
    mode: getStorageMode(),
    provider: "google_sheets",
    action,
    record_id: recordId,
    data,
    warnings: [
      "Google Sheets credentials are present, but live external writes are disabled for this scaffold.",
      "Use a tested Google Sheets API helper or low-code automation step before production writes."
    ],
    dry_run: true
  });
}

export const googleSheetsStorageConnector: StorageConnector = {
  provider: "google_sheets",
  isConfigured: isGoogleSheetsConfigured,

  async createPartnerRecord(record) {
    if (!isGoogleSheetsConfigured()) return notConfigured("create_partner_record");

    return dryRun(
      "create_partner_record",
      {
        sheet_id: getGoogleSheetsConfig().sheet_id,
        range: "Partners!A:T",
        row: mapPartnerToSheetRow(record)
      } as unknown as PartnerRecord,
      record.partner_id
    );
  },

  async updatePartnerRecord(partnerId, updates) {
    if (!isGoogleSheetsConfigured()) return notConfigured("update_partner_record");

    return dryRun(
      "update_partner_record",
      {
        partner_id: partnerId,
        updates,
        lookup_required: "Find row by partner_id before updating selected columns."
      } as unknown as PartnerRecord,
      partnerId
    );
  },

  async logPartnerEvent(event) {
    if (!isGoogleSheetsConfigured()) return notConfigured("log_partner_event");

    const eventRow = [
      event.event_id || `evt_${Date.now()}`,
      event.partner_id,
      event.event_type,
      event.event_source || "api",
      event.summary,
      event.next_action || "",
      event.owner || "",
      event.status || "open",
      event.created_at || now(),
      event.created_by || "system",
      JSON.stringify(event.metadata || {})
    ];

    return dryRun(
      "log_partner_event",
      {
        sheet_id: getGoogleSheetsConfig().sheet_id,
        range: "Events!A:K",
        row: eventRow
      } as unknown as PartnerEventRecord,
      event.event_id || event.partner_id
    );
  },

  async healthCheck() {
    const config = getGoogleSheetsConfig();
    return result({
      ok: isGoogleSheetsConfigured(),
      mode: getStorageMode(),
      provider: "google_sheets",
      action: "health_check",
      data: {
        configured: isGoogleSheetsConfigured(),
        notes: [
          `GOOGLE_SERVICE_ACCOUNT_EMAIL: ${config.service_account_email ? "set" : "missing"}`,
          `GOOGLE_PRIVATE_KEY: ${config.private_key ? "set" : "missing"}`,
          `GOOGLE_SHEET_ID: ${config.sheet_id ? "set" : "missing"}`,
          `PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES: ${config.live_writes_enabled ? "true" : "false"}`,
          "Batch 06 Google Sheets connector is a safe scaffold. Add tested Sheets API writes or use n8n/Activepieces before production writes."
        ]
      },
      dry_run: true
    });
  }
};
