import { randomUUID } from "crypto";

export function createRequestId(prefix = "pio"): string {
  const randomPart = randomUUID().slice(0, 8);
  return `${prefix}_${Date.now().toString(36)}_${randomPart}`;
}

export function getRequestId(req: { headers?: Record<string, unknown> } = {}): string {
  const headerValue =
    req.headers?.["x-request-id"] ||
    req.headers?.["X-Request-Id"] ||
    req.headers?.["x-correlation-id"] ||
    req.headers?.["X-Correlation-Id"];

  if (Array.isArray(headerValue) && headerValue[0]) return String(headerValue[0]);
  if (typeof headerValue === "string" && headerValue.trim()) return headerValue.trim();

  return createRequestId();
}
