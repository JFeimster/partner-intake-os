import { getStorageMode, type StorageMode } from "../env";
import { jsonStorageConnector } from "./json-store";
import { notionStorageConnector } from "./notion";
import { hubspotStorageConnector } from "./hubspot";
import { googleSheetsStorageConnector } from "./google-sheets";

export type PartnerRecord = {
  partner_id: string;
  display_name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  website?: string | null;
  partner_type: string;
  partner_tier: string;
  onboarding_path: string;
  primary_audience: string;
  secondary_audiences?: string[];
  risk_level: string;
  status: string;
  tags: string[];
  recommended_resources: string[];
  recommended_campaigns: string[];
  next_action: string;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
};

export type PartnerEventRecord = {
  event_id?: string;
  partner_id: string;
  event_type: string;
  event_source?: string;
  summary: string;
  next_action?: string;
  owner?: string;
  status?: string;
  created_at?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
};

export type StorageProvider = "mock" | "json" | "notion" | "hubspot" | "google_sheets";

export type StorageOperationResult<T = unknown> = {
  ok: boolean;
  mode: StorageMode;
  provider: StorageProvider;
  action: string;
  record_id?: string;
  external_id?: string;
  data?: T;
  error?: string;
  warnings?: string[];
  dry_run?: boolean;
  timestamp: string;
};

export type StorageConnector = {
  provider: StorageProvider;
  isConfigured: () => boolean;
  createPartnerRecord: (record: PartnerRecord) => Promise<StorageOperationResult<PartnerRecord>>;
  updatePartnerRecord: (partnerId: string, updates: Partial<PartnerRecord>) => Promise<StorageOperationResult<PartnerRecord>>;
  logPartnerEvent: (event: PartnerEventRecord) => Promise<StorageOperationResult<PartnerEventRecord>>;
  healthCheck: () => Promise<StorageOperationResult<{ configured: boolean; notes: string[] }>>;
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

const mockPartners = new Map<string, PartnerRecord>();
const mockEvents: PartnerEventRecord[] = [];

export const mockStorageConnector: StorageConnector = {
  provider: "mock",
  isConfigured: () => true,

  async createPartnerRecord(record) {
    const cleanRecord = {
      ...record,
      updated_at: record.updated_at || now(),
      created_at: record.created_at || now()
    };
    mockPartners.set(cleanRecord.partner_id, cleanRecord);

    return result({
      ok: true,
      mode: "mock",
      provider: "mock",
      action: "create_partner_record",
      record_id: cleanRecord.partner_id,
      data: cleanRecord,
      warnings: ["Mock storage is in-memory only. It resets when the serverless runtime resets."],
      dry_run: false
    });
  },

  async updatePartnerRecord(partnerId, updates) {
    const existing = mockPartners.get(partnerId);
    const updated = {
      ...(existing || { partner_id: partnerId }),
      ...updates,
      updated_at: now()
    } as PartnerRecord;

    mockPartners.set(partnerId, updated);

    return result({
      ok: true,
      mode: "mock",
      provider: "mock",
      action: "update_partner_record",
      record_id: partnerId,
      data: updated,
      warnings: existing ? [] : ["Partner did not exist in memory; mock storage created a partial record."],
      dry_run: false
    });
  },

  async logPartnerEvent(event) {
    const eventRecord = {
      ...event,
      event_id: event.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      created_at: event.created_at || now()
    };
    mockEvents.push(eventRecord);

    return result({
      ok: true,
      mode: "mock",
      provider: "mock",
      action: "log_partner_event",
      record_id: eventRecord.event_id,
      data: eventRecord,
      warnings: ["Mock event log is in-memory only."],
      dry_run: false
    });
  },

  async healthCheck() {
    return result({
      ok: true,
      mode: "mock",
      provider: "mock",
      action: "health_check",
      data: {
        configured: true,
        notes: [
          "Mock storage is always available.",
          "Use this for local testing and GPT Action dry runs, not for live partner records."
        ]
      },
      dry_run: false
    });
  }
};

export function getStorageConnector(mode: StorageMode = getStorageMode()): StorageConnector {
  switch (mode) {
    case "json":
      return jsonStorageConnector;
    case "notion":
      return notionStorageConnector;
    case "hubspot":
      return hubspotStorageConnector;
    case "google_sheets":
      return googleSheetsStorageConnector;
    case "mock":
    default:
      return mockStorageConnector;
  }
}

export async function createPartnerRecord(record: PartnerRecord, mode: StorageMode = getStorageMode()) {
  return getStorageConnector(mode).createPartnerRecord(record);
}

export async function updatePartnerRecord(
  partnerId: string,
  updates: Partial<PartnerRecord>,
  mode: StorageMode = getStorageMode()
) {
  return getStorageConnector(mode).updatePartnerRecord(partnerId, updates);
}

export async function logPartnerEvent(event: PartnerEventRecord, mode: StorageMode = getStorageMode()) {
  return getStorageConnector(mode).logPartnerEvent(event);
}

export async function storageHealthCheck(mode: StorageMode = getStorageMode()) {
  return getStorageConnector(mode).healthCheck();
}
