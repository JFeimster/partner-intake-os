import crypto from "crypto";

export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function safeCanonicalPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    partner_id: payload.partner_id,
    lead_email_hash: payload.lead_email_hash,
    email_hash: payload.email_hash,
    event_type: payload.event_type,
    tracking_link_id: payload.tracking_link_id,
    source: payload.source,
    submitted_at_day: typeof payload.submitted_at === "string" ? payload.submitted_at.slice(0, 10) : undefined,
  };
}

export function createPayloadHash(payload: Record<string, unknown>): string {
  return crypto.createHash("sha256").update(stableStringify(safeCanonicalPayload(payload))).digest("hex");
}

export function getIdempotencyKey(req: any, payload: Record<string, unknown>): string {
  return req.headers?.["idempotency-key"] || req.headers?.["x-idempotency-key"] || createPayloadHash(payload);
}
