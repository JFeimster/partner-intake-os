import { createHmac, timingSafeEqual, randomBytes } from "crypto";

type HeaderMap = Record<string, string | string[] | undefined>;

export type AdminRole = "owner" | "reviewer" | "read_only" | "integration_service_account";

export interface AdminSessionPayload {
  session_id: string;
  role: AdminRole;
  issued_at: string;
  expires_at: string;
}

export interface AdminAuthResult {
  ok: boolean;
  mode: "cookie" | "bearer" | "demo" | "none";
  role?: AdminRole;
  reason?: string;
  session?: AdminSessionPayload;
}

const SESSION_COOKIE = "partner_admin_session";
const DEFAULT_SESSION_SECONDS = 60 * 60 * 8;

function env(name: string): string {
  return String(process.env[name] || "").trim();
}

function isProduction(): boolean {
  return env("VERCEL_ENV") === "production" || env("PARTNER_INTAKE_ENV") === "production";
}

export function adminAuthConfigured(): boolean {
  return Boolean(env("PARTNER_ADMIN_TOKEN"));
}

export function demoModeEnabled(): boolean {
  return env("PARTNER_ADMIN_DEMO_MODE").toLowerCase() === "true";
}

function base64Url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(input: string): Buffer {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(normalized + padding, "base64");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyAdminToken(receivedToken: string | undefined): boolean {
  const expected = env("PARTNER_ADMIN_TOKEN");
  if (!expected || !receivedToken) return false;
  return safeEqual(receivedToken, expected);
}

function sessionSecret(): string {
  return env("PARTNER_ADMIN_SESSION_SECRET") || env("PARTNER_ADMIN_TOKEN");
}

export function createAdminSession(role: AdminRole = "owner", ttlSeconds = DEFAULT_SESSION_SECONDS): string {
  const now = new Date();
  const expires = new Date(now.getTime() + ttlSeconds * 1000);
  const payload: AdminSessionPayload = {
    session_id: `adm_${randomBytes(12).toString("hex")}`,
    role,
    issued_at: now.toISOString(),
    expires_at: expires.toISOString()
  };

  const encodedPayload = base64Url(JSON.stringify(payload));
  const signature = base64Url(createHmac("sha256", sessionSecret()).update(encodedPayload).digest());
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSession(sessionToken: string | undefined): AdminAuthResult {
  if (!sessionToken) return { ok: false, mode: "none", reason: "missing_session" };
  if (!sessionSecret()) return { ok: false, mode: "none", reason: "admin_auth_not_configured" };

  const [encodedPayload, receivedSignature] = sessionToken.split(".");
  if (!encodedPayload || !receivedSignature) {
    return { ok: false, mode: "cookie", reason: "malformed_session" };
  }

  const expectedSignature = base64Url(createHmac("sha256", sessionSecret()).update(encodedPayload).digest());
  if (!safeEqual(receivedSignature, expectedSignature)) {
    return { ok: false, mode: "cookie", reason: "bad_signature" };
  }

  let session: AdminSessionPayload;
  try {
    session = JSON.parse(fromBase64Url(encodedPayload).toString("utf8"));
  } catch {
    return { ok: false, mode: "cookie", reason: "bad_payload" };
  }

  if (!session.expires_at || new Date(session.expires_at).getTime() <= Date.now()) {
    return { ok: false, mode: "cookie", reason: "expired_session" };
  }

  return { ok: true, mode: "cookie", role: session.role, session };
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((part) => {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName) return;
    cookies[rawName] = decodeURIComponent(rawValue.join("="));
  });

  return cookies;
}

export function getBearerToken(headers: HeaderMap): string | undefined {
  const raw = headers.authorization || headers.Authorization;
  const header = Array.isArray(raw) ? raw[0] : raw;
  if (!header) return undefined;
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : undefined;
}

export function getSessionCookie(headers: HeaderMap): string | undefined {
  const raw = headers.cookie || headers.Cookie;
  const cookieHeader = Array.isArray(raw) ? raw[0] : raw;
  return parseCookies(cookieHeader)[SESSION_COOKIE];
}

export function authenticateAdminRequest(req: { headers: HeaderMap }): AdminAuthResult {
  const bearer = getBearerToken(req.headers);
  if (bearer && verifyAdminToken(bearer)) {
    return { ok: true, mode: "bearer", role: "owner" };
  }

  const session = verifyAdminSession(getSessionCookie(req.headers));
  if (session.ok) return session;

  if (demoModeEnabled()) {
    return { ok: true, mode: "demo", role: "read_only", reason: "demo_mode_enabled" };
  }

  return session;
}

export function buildSessionCookie(sessionToken: string): string {
  const secure = isProduction() ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${DEFAULT_SESSION_SECONDS}${secure}`;
}

export function buildClearSessionCookie(): string {
  const secure = isProduction() ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function noStoreHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "Surrogate-Control": "no-store"
  };
}

export function safeAdminError(code: string, message: string, statusCode = 400) {
  return {
    statusCode,
    payload: {
      ok: false,
      error: {
        code,
        message
      }
    }
  };
}

export function redactEmail(email: string | undefined): string {
  if (!email || !email.includes("@")) return "not_provided";
  const [name, domain] = email.split("@");
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
}

export const ADMIN_COOKIE_NAME = SESSION_COOKIE;
