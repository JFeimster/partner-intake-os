declare const require: any;

import { getEnv, getStorageMode } from "../env";
import type {
  PartnerEventRecord,
  PartnerRecord,
  StorageConnector,
  StorageOperationResult
} from "./storage-router";

const fs = require("node:fs");
const path = require("node:path");

type JsonStoreFile = {
  partners: PartnerRecord[];
  events: PartnerEventRecord[];
  updated_at: string;
};

const memoryStore: JsonStoreFile = {
  partners: [],
  events: [],
  updated_at: new Date().toISOString()
};

function now(): string {
  return new Date().toISOString();
}

function makeResult<T>(input: Omit<StorageOperationResult<T>, "timestamp">): StorageOperationResult<T> {
  return {
    ...input,
    timestamp: now()
  };
}

function getStorePath(): string {
  return getEnv("PARTNER_INTAKE_JSON_STORE_PATH", "/tmp/partner-intake-os-store.json");
}

function fileStorageDisabled(): boolean {
  return getEnv("PARTNER_INTAKE_JSON_STORE_DISABLE_FILE", "false") === "true";
}

function readStore(): { store: JsonStoreFile; warnings: string[] } {
  if (fileStorageDisabled()) {
    return {
      store: memoryStore,
      warnings: ["JSON file storage is disabled; using in-memory JSON store."]
    };
  }

  const storePath = getStorePath();

  try {
    if (!fs.existsSync(storePath)) {
      return {
        store: memoryStore,
        warnings: [`No JSON store file exists yet at ${storePath}; starting with empty store.`]
      };
    }

    const parsed = JSON.parse(fs.readFileSync(storePath, "utf8"));
    return {
      store: {
        partners: Array.isArray(parsed.partners) ? parsed.partners : [],
        events: Array.isArray(parsed.events) ? parsed.events : [],
        updated_at: typeof parsed.updated_at === "string" ? parsed.updated_at : now()
      },
      warnings: []
    };
  } catch (error) {
    return {
      store: memoryStore,
      warnings: [
        `Unable to read JSON store; using in-memory fallback. Reason: ${error instanceof Error ? error.message : "unknown_error"}`
      ]
    };
  }
}

function writeStore(store: JsonStoreFile): string[] {
  if (fileStorageDisabled()) {
    memoryStore.partners = store.partners;
    memoryStore.events = store.events;
    memoryStore.updated_at = now();
    return ["JSON file storage is disabled; wrote to in-memory JSON store."];
  }

  const storePath = getStorePath();

  try {
    fs.mkdirSync(path.dirname(storePath), { recursive: true });
    fs.writeFileSync(storePath, JSON.stringify({ ...store, updated_at: now() }, null, 2));
    return [`Wrote JSON store to ${storePath}. On Vercel, /tmp is ephemeral and not durable storage.`];
  } catch (error) {
    memoryStore.partners = store.partners;
    memoryStore.events = store.events;
    memoryStore.updated_at = now();
    return [
      `Unable to write JSON store; wrote to in-memory fallback. Reason: ${error instanceof Error ? error.message : "unknown_error"}`
    ];
  }
}

export const jsonStorageConnector: StorageConnector = {
  provider: "json",
  isConfigured: () => true,

  async createPartnerRecord(record) {
    const { store, warnings } = readStore();
    const existingIndex = store.partners.findIndex((partner) => partner.partner_id === record.partner_id);
    const cleanRecord = {
      ...record,
      created_at: record.created_at || now(),
      updated_at: now()
    };

    if (existingIndex >= 0) {
      store.partners[existingIndex] = cleanRecord;
      warnings.push("Existing partner_id found; JSON store upserted the record.");
    } else {
      store.partners.push(cleanRecord);
    }

    const writeWarnings = writeStore(store);

    return makeResult({
      ok: true,
      mode: getStorageMode(),
      provider: "json",
      action: "create_partner_record",
      record_id: cleanRecord.partner_id,
      data: cleanRecord,
      warnings: [...warnings, ...writeWarnings],
      dry_run: false
    });
  },

  async updatePartnerRecord(partnerId, updates) {
    const { store, warnings } = readStore();
    const existingIndex = store.partners.findIndex((partner) => partner.partner_id === partnerId);

    if (existingIndex < 0) {
      return makeResult({
        ok: false,
        mode: getStorageMode(),
        provider: "json",
        action: "update_partner_record",
        record_id: partnerId,
        error: "partner_not_found",
        warnings
      });
    }

    const updated = {
      ...store.partners[existingIndex],
      ...updates,
      partner_id: partnerId,
      updated_at: now()
    } as PartnerRecord;

    store.partners[existingIndex] = updated;
    const writeWarnings = writeStore(store);

    return makeResult({
      ok: true,
      mode: getStorageMode(),
      provider: "json",
      action: "update_partner_record",
      record_id: partnerId,
      data: updated,
      warnings: [...warnings, ...writeWarnings],
      dry_run: false
    });
  },

  async logPartnerEvent(event) {
    const { store, warnings } = readStore();
    const eventRecord = {
      ...event,
      event_id: event.event_id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      created_at: event.created_at || now()
    };

    store.events.push(eventRecord);
    const writeWarnings = writeStore(store);

    return makeResult({
      ok: true,
      mode: getStorageMode(),
      provider: "json",
      action: "log_partner_event",
      record_id: eventRecord.event_id,
      data: eventRecord,
      warnings: [...warnings, ...writeWarnings],
      dry_run: false
    });
  },

  async healthCheck() {
    const { store, warnings } = readStore();
    return makeResult({
      ok: true,
      mode: getStorageMode(),
      provider: "json",
      action: "health_check",
      data: {
        configured: true,
        notes: [
          `JSON store path: ${getStorePath()}`,
          `Partners in store: ${store.partners.length}`,
          `Events in store: ${store.events.length}`,
          "Use JSON mode for local testing or temporary MVP traces. Do not use it as durable production CRM storage."
        ]
      },
      warnings,
      dry_run: false
    });
  }
};
