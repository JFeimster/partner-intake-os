/**
 * Safe event publisher
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import { signWebhookPayload } from "./webhook-signing";

export type SafeWebhookEventType =
  | "partner.created"
  | "partner.review_required"
  | "partner.onboarding_ready"
  | "lead.received"
  | "lead.needs_info"
  | "tracking.link_created"
  | "campaign.generated"
  | "resource.recommended";

export interface WebhookEvent {
  event_id: string;
  event_type: SafeWebhookEventType;
  created_at: string;
  data: Record<string, unknown>;
}

const SAFE_EVENT_TYPES: SafeWebhookEventType[] = [
  "partner.created",
  "partner.review_required",
  "partner.onboarding_ready",
  "lead.received",
  "lead.needs_info",
  "tracking.link_created",
  "campaign.generated",
  "resource.recommended"
];

export function isSafeEventType(type: string): type is SafeWebhookEventType {
  return SAFE_EVENT_TYPES.includes(type as SafeWebhookEventType);
}

export function sanitizeEventData(data: Record<string, unknown>): Record<string, unknown> {
  const blocked = ["ssn", "ein", "bank_account", "api_key", "token", "secret", "borrower_documents", "commission_data"];
  return Object.fromEntries(Object.entries(data).filter(([key]) => !blocked.some((term) => key.toLowerCase().includes(term))));
}

export function buildWebhookDelivery(event: WebhookEvent, secret: string) {
  if (!isSafeEventType(event.event_type)) {
    throw new Error("unsafe_event_type");
  }

  const safeEvent = { ...event, data: sanitizeEventData(event.data) };
  const rawBody = JSON.stringify(safeEvent);
  return {
    body: rawBody,
    headers: {
      "Content-Type": "application/json",
      "X-Partner-Intake-Signature": signWebhookPayload({ secret, rawBody })
    }
  };
}
