import { createLeadId } from "./lead-id";

export type LeadEventType =
  | "lead_created"
  | "lead_viewed"
  | "lead_event_logged"
  | "manual_review"
  | "status_change"
  | "duplicate_review"
  | "sync_queued"
  | "sync_skipped"
  | "sync_failed";

export type LeadEvent = {
  event_id: string;
  event_type: LeadEventType;
  lead_id?: string;
  partner_id?: string;
  tracking_id?: string;
  actor_type: "partner" | "admin" | "system" | "api";
  summary: string;
  metadata?: Record<string, unknown>;
  created_at: string;
};

const ALLOWED_EVENTS: LeadEventType[] = [
  "lead_created",
  "lead_viewed",
  "lead_event_logged",
  "manual_review",
  "status_change",
  "duplicate_review",
  "sync_queued",
  "sync_skipped",
  "sync_failed"
];

export function isLeadEventType(value: unknown): value is LeadEventType {
  return ALLOWED_EVENTS.includes(String(value) as LeadEventType);
}

export function createLeadEvent(input: {
  event_type: LeadEventType;
  lead_id?: string;
  partner_id?: string;
  tracking_id?: string;
  actor_type?: "partner" | "admin" | "system" | "api";
  summary: string;
  metadata?: Record<string, unknown>;
}): LeadEvent {
  return {
    event_id: createLeadId("event"),
    event_type: input.event_type,
    lead_id: input.lead_id,
    partner_id: input.partner_id,
    tracking_id: input.tracking_id,
    actor_type: input.actor_type || "system",
    summary: input.summary,
    metadata: sanitizeEventMetadata(input.metadata || {}),
    created_at: new Date().toISOString()
  };
}

export function sanitizeEventMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const blockedKeys = ["ssn", "social_security", "bank_login", "password", "account_number", "routing_number"];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata)) {
    const normalizedKey = key.toLowerCase();
    if (blockedKeys.some((blocked) => normalizedKey.includes(blocked))) {
      sanitized[key] = "[redacted]";
      continue;
    }

    if (typeof value === "string") {
      sanitized[key] = value.slice(0, 300);
      continue;
    }

    if (typeof value === "number" || typeof value === "boolean" || value === null) {
      sanitized[key] = value;
      continue;
    }

    sanitized[key] = "[object redacted]";
  }

  return sanitized;
}

export function validateLeadEventPayload(payload: unknown): {
  ok: boolean;
  errors: string[];
  event?: {
    event_type: LeadEventType;
    lead_id?: string;
    partner_id?: string;
    tracking_id?: string;
    summary: string;
    metadata?: Record<string, unknown>;
  };
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, errors: ["body"] };
  }

  const record = payload as Record<string, unknown>;
  const errors: string[] = [];

  if (!isLeadEventType(record.event_type)) {
    errors.push("event_type");
  }

  const summary = String(record.summary || "").trim();
  if (!summary) {
    errors.push("summary");
  }

  if (!record.lead_id && !record.partner_id) {
    errors.push("lead_id_or_partner_id");
  }

  return {
    ok: errors.length === 0,
    errors,
    event: errors.length
      ? undefined
      : {
          event_type: record.event_type as LeadEventType,
          lead_id: String(record.lead_id || "").trim() || undefined,
          partner_id: String(record.partner_id || "").trim() || undefined,
          tracking_id: String(record.tracking_id || "").trim() || undefined,
          summary,
          metadata: record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata)
            ? record.metadata as Record<string, unknown>
            : undefined
        }
  };
}
