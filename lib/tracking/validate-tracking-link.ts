import { assertHttpUrl } from "./utm-builder";

export type TrackingLinkInput = {
  partner_id?: string;
  campaign_id?: string;
  campaign_name?: string;
  destination_url?: string;
  source?: string;
  medium?: string;
  content?: string;
  term?: string;
  audience?: string;
  offer?: string;
  channel?: string;
  metadata?: Record<string, unknown>;
};

export type TrackingValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

const SENSITIVE_KEYS = [
  "ssn",
  "social_security",
  "tax_id",
  "ein",
  "bank_account",
  "routing_number",
  "password",
  "borrower_dob",
  "date_of_birth"
];

const ALLOWED_EVENT_TYPES = ["click", "lead_started", "lead_submitted", "manual_review"] as const;

export type TrackingEventType = (typeof ALLOWED_EVENT_TYPES)[number];

export function isAllowedTrackingEvent(value: unknown): value is TrackingEventType {
  return ALLOWED_EVENT_TYPES.includes(String(value) as TrackingEventType);
}

export function validateTrackingLinkInput(payload: TrackingLinkInput): TrackingValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!payload || typeof payload !== "object") {
    return {
      ok: false,
      errors: ["payload must be a JSON object"],
      warnings
    };
  }

  if (!String(payload.partner_id || "").trim()) {
    errors.push("partner_id is required");
  }

  if (!String(payload.destination_url || "").trim()) {
    errors.push("destination_url is required");
  } else {
    try {
      assertHttpUrl(payload.destination_url);
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "destination_url is invalid");
    }
  }

  if (payload.metadata && typeof payload.metadata === "object") {
    const keys = Object.keys(payload.metadata).map((key) => key.toLowerCase());
    const sensitive = keys.filter((key) => SENSITIVE_KEYS.includes(key));

    if (sensitive.length) {
      errors.push(`metadata contains sensitive keys: ${sensitive.join(", ")}`);
    }
  }

  if (!payload.campaign_id && !payload.campaign_name && !payload.offer) {
    warnings.push("No campaign_id, campaign_name, or offer was provided; a generic campaign ID will be generated.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

export function sanitizeTrackingMetadata(metadata: unknown): Record<string, unknown> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(metadata as Record<string, unknown>)) {
    const normalizedKey = key.trim().toLowerCase();

    if (!normalizedKey || SENSITIVE_KEYS.includes(normalizedKey)) {
      continue;
    }

    if (typeof value === "string") {
      safe[normalizedKey] = value.slice(0, 240);
    } else if (typeof value === "number" || typeof value === "boolean") {
      safe[normalizedKey] = value;
    } else {
      safe[normalizedKey] = "[redacted_complex_value]";
    }
  }

  return safe;
}
