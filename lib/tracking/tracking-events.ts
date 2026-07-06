import { isAllowedTrackingEvent, sanitizeTrackingMetadata, TrackingEventType } from "./validate-tracking-link";

export type TrackingEventInput = {
  tracking_id?: string;
  partner_id?: string;
  campaign_id?: string;
  event_type?: string;
  lead_id?: string;
  session_id?: string;
  metadata?: Record<string, unknown>;
};

export type TrackingEvent = {
  event_id: string;
  tracking_id: string;
  partner_id?: string;
  campaign_id?: string;
  event_type: TrackingEventType;
  lead_id?: string;
  session_id?: string;
  metadata: Record<string, unknown>;
  stored: boolean;
  storage: "stub";
  created_at: string;
};

function stableEventHash(input: unknown): string {
  const text = JSON.stringify(input ?? "");
  let hash = 5381;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 33) ^ text.charCodeAt(index);
  }

  return Math.abs(hash >>> 0).toString(36).slice(0, 10).padStart(6, "0");
}

export function createTrackingEvent(input: TrackingEventInput): TrackingEvent {
  const eventType = String(input.event_type || "");

  if (!isAllowedTrackingEvent(eventType)) {
    throw new Error("event_type must be one of: click, lead_started, lead_submitted, manual_review");
  }

  const trackingId = String(input.tracking_id || "").trim();

  if (!trackingId) {
    throw new Error("tracking_id is required");
  }

  const now = new Date().toISOString();

  return {
    event_id: `tevt_${stableEventHash({ input, now }).slice(0, 10)}`,
    tracking_id: trackingId,
    partner_id: input.partner_id ? String(input.partner_id).trim() : undefined,
    campaign_id: input.campaign_id ? String(input.campaign_id).trim() : undefined,
    event_type: eventType,
    lead_id: input.lead_id ? String(input.lead_id).trim() : undefined,
    session_id: input.session_id ? String(input.session_id).trim().slice(0, 80) : undefined,
    metadata: sanitizeTrackingMetadata(input.metadata),
    stored: false,
    storage: "stub",
    created_at: now
  };
}

export function demoTrackingRecord(input: {
  tracking_id: string;
  partner_id?: string;
  campaign_id?: string;
}) {
  const now = new Date().toISOString();

  return {
    tracking_id: input.tracking_id,
    partner_id: input.partner_id || "partner_demo",
    campaign_id: input.campaign_id || "camp_demo",
    generated_url: `${process.env.TRACKING_BASE_URL || "https://YOUR_VERCEL_DOMAIN.vercel.app"}/r/${input.tracking_id}`,
    destination_url: "https://distilledfunding.com/",
    status: "demo_record",
    events_summary: {
      clicks: 0,
      lead_started: 0,
      lead_submitted: 0,
      manual_review: 0
    },
    created_at: now,
    updated_at: now,
    note: "Stub record only. Wire this to a database or CRM before treating it as source of truth."
  };
}
