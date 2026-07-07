export type TrackingEventType =
  | "link_created"
  | "click"
  | "lead_started"
  | "lead_submitted"
  | "manual_review"
  | "partner_resource_opened"
  | "campaign_kit_viewed";

export interface TrackingEvent {
  event_type: TrackingEventType;
  partner_id?: string;
  campaign_id?: string;
  tracking_link_id?: string;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
}

export const SAFE_TRACKING_EVENTS: TrackingEventType[] = [
  "link_created",
  "click",
  "lead_started",
  "lead_submitted",
  "manual_review",
  "partner_resource_opened",
  "campaign_kit_viewed",
];

export function assertSafeTrackingEvent(eventType: string): asserts eventType is TrackingEventType {
  if (!SAFE_TRACKING_EVENTS.includes(eventType as TrackingEventType)) {
    throw new Error(`Unsupported or unsafe tracking event: ${eventType}`);
  }
}

export function sanitizeTrackingMetadata(metadata: Record<string, unknown> = {}): Record<string, unknown> {
  const forbidden = ["ip", "ssn", "bank", "password", "tax_return", "commission", "payout", "fingerprint"];
  return Object.fromEntries(
    Object.entries(metadata)
      .filter(([key]) => !forbidden.some((term) => key.toLowerCase().includes(term)))
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 500) : value])
  );
}

export function groupEventsByType(events: TrackingEvent[]): Record<TrackingEventType, number> {
  return SAFE_TRACKING_EVENTS.reduce((acc, eventType) => {
    acc[eventType] = events.filter((event) => event.event_type === eventType).length;
    return acc;
  }, {} as Record<TrackingEventType, number>);
}
