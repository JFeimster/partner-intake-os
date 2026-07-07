import crypto from "crypto";

export interface RateLimitPolicy {
  windowMs: number;
  limit: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retry_after_seconds: number;
  key_hash: string;
}

const memoryStore = new Map<string, { count: number; resetAt: number }>();

export const RATE_LIMIT_POLICIES: Record<string, RateLimitPolicy> = {
  "/api/tally/partner-intake-webhook": { windowMs: 60_000, limit: 120 },
  "/api/leads/submit": { windowMs: 60_000, limit: 20 },
  "/api/tracking/log-event": { windowMs: 60_000, limit: 120 },
  "/api/partners/classify": { windowMs: 60_000, limit: 30 },
  default: { windowMs: 60_000, limit: 60 },
};

export function hashLimitKey(value: string): string {
  const secret = process.env.RATE_LIMIT_SECRET ?? process.env.PARTNER_INTAKE_SESSION_SECRET ?? "dev-only";
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function getClientIp(req: any): string {
  const forwarded = req.headers?.["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) return forwarded.split(",")[0].trim();
  return req.headers?.["x-real-ip"] ?? req.socket?.remoteAddress ?? "unknown";
}

export function buildRateLimitKey(req: any, path?: string): string {
  const partnerId = req.headers?.["x-partner-id"];
  const auth = req.headers?.authorization;
  const form = req.headers?.["x-tally-form-id"];
  const ip = getClientIp(req);

  return String(partnerId || auth || form || ip || path || "anonymous");
}

export function checkRateLimit(key: string, policy: RateLimitPolicy): RateLimitResult {
  const key_hash = hashLimitKey(key);
  const now = Date.now();
  const current = memoryStore.get(key_hash);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key_hash, { count: 1, resetAt: now + policy.windowMs });
    return { allowed: true, limit: policy.limit, remaining: policy.limit - 1, retry_after_seconds: 0, key_hash };
  }

  current.count += 1;
  const remaining = Math.max(policy.limit - current.count, 0);

  return {
    allowed: current.count <= policy.limit,
    limit: policy.limit,
    remaining,
    retry_after_seconds: Math.ceil((current.resetAt - now) / 1000),
    key_hash,
  };
}

export function checkRequestRateLimit(req: any, path: string): RateLimitResult {
  const policy = RATE_LIMIT_POLICIES[path] ?? RATE_LIMIT_POLICIES.default;
  return checkRateLimit(buildRateLimitKey(req, path), policy);
}
