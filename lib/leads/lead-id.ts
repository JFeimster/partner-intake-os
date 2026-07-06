const LEAD_ID_PREFIX = "lead";

function safeRandomSegment(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi && typeof cryptoApi.randomUUID === "function") {
    return cryptoApi.randomUUID().replace(/-/g, "").slice(0, 18);
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12)}`;
}

export function createLeadId(prefix = LEAD_ID_PREFIX): string {
  return `${prefix}_${safeRandomSegment()}`.toLowerCase();
}

export function normalizeLeadId(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
}

export function isLeadId(value: unknown): boolean {
  const normalized = normalizeLeadId(value);
  return /^lead_[a-z0-9_-]{8,40}$/.test(normalized);
}

export function createExternalReference(source: string, externalId?: string): string {
  const cleanSource = String(source || "api").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");
  const cleanExternalId = String(externalId || "").trim().toLowerCase().replace(/[^a-z0-9_-]/g, "_");

  if (cleanExternalId) {
    return `${cleanSource}:${cleanExternalId}`;
  }

  return `${cleanSource}:${Date.now().toString(36)}`;
}
