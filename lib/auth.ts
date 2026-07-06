declare const require: any;
declare const Buffer: any;

const crypto = require("node:crypto");

import { getActionToken, getTallySigningSecret } from "./env";

export type ApiRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: any;
};

export type ApiErrorBody = {
  error: string;
  message: string;
  code: string;
  details?: unknown;
  request_id: string;
  timestamp: string;
};

export type AuthResult =
  | { ok: true }
  | { ok: false; status: number; body: ApiErrorBody };

export function getHeader(req: ApiRequest, name: string): string {
  const headers = req.headers || {};
  const exact = headers[name];
  const lower = headers[name.toLowerCase()];
  const value = exact ?? lower;

  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return typeof value === "string" ? value : "";
}

export function getRequestId(req: ApiRequest): string {
  const existing =
    getHeader(req, "x-request-id") ||
    getHeader(req, "x-correlation-id") ||
    getHeader(req, "cf-ray");

  if (existing) {
    return existing;
  }

  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function makeApiError(
  req: ApiRequest,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): { status: number; body: ApiErrorBody } {
  return {
    status: statusCode,
    body: {
      error: code,
      message,
      code,
      details,
      request_id: getRequestId(req),
      timestamp: new Date().toISOString()
    }
  };
}

export function requireBearerAuth(req: ApiRequest): AuthResult {
  const configuredToken = getActionToken();

  if (!configuredToken) {
    const error = makeApiError(
      req,
      500,
      "internal_error",
      "PARTNER_INTAKE_ACTION_TOKEN is not configured."
    );
    return { ok: false, status: error.status, body: error.body };
  }

  const authHeader = getHeader(req, "authorization");
  const prefix = "Bearer ";

  if (!authHeader || !authHeader.startsWith(prefix)) {
    const error = makeApiError(
      req,
      401,
      "unauthorized",
      "Missing Bearer token."
    );
    return { ok: false, status: error.status, body: error.body };
  }

  const suppliedToken = authHeader.slice(prefix.length).trim();

  if (suppliedToken !== configuredToken) {
    const error = makeApiError(
      req,
      403,
      "forbidden",
      "Invalid Bearer token."
    );
    return { ok: false, status: error.status, body: error.body };
  }

  return { ok: true };
}

function safeCompare(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function verifyTallySignature(req: ApiRequest, rawBody: string): AuthResult {
  const secret = getTallySigningSecret();

  if (!secret) {
    return { ok: true };
  }

  const suppliedSignature =
    getHeader(req, "tally-signature") ||
    getHeader(req, "x-tally-signature") ||
    getHeader(req, "x-signature");

  if (!suppliedSignature) {
    const error = makeApiError(
      req,
      401,
      "unauthorized",
      "Missing Tally webhook signature."
    );
    return { ok: false, status: error.status, body: error.body };
  }

  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const expectedWithPrefix = `sha256=${digest}`;
  const valid =
    safeCompare(suppliedSignature, digest) ||
    safeCompare(suppliedSignature, expectedWithPrefix);

  if (!valid) {
    const error = makeApiError(
      req,
      403,
      "forbidden",
      "Invalid Tally webhook signature."
    );
    return { ok: false, status: error.status, body: error.body };
  }

  return { ok: true };
}
