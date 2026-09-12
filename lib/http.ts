import { ApiError, normalizeUnknownError, toApiErrorPayload } from "./errors";
import { getRequestId } from "./request-id";
import { applyCors, handleOptions } from "./cors";

export type HeaderValue = string | string[] | undefined;

export type ApiRequest = {
  method?: string;
  headers?: Record<string, HeaderValue>;
  body?: unknown;
  query?: Record<string, string | string[]>;
  rawBody?: string | Buffer;
  [key: string]: unknown;
};

export type ApiResponse = {
  statusCode?: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

export type HandlerContext = {
  requestId: string;
};

export type HandlerOptions = {
  methods: string[];
  auth?: "bearer" | "none";
};

export type JsonPayload = Record<string, unknown> | unknown[] | null;

export function noStore(res: ApiResponse): void {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
}

export function sendJson(res: ApiResponse, statusCode: number, payload: JsonPayload): void {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  noStore(res);
  res.end(JSON.stringify(payload, null, 2));
}

export function methodGuard(req: ApiRequest, methods: string[]): void {
  const method = String(req.method || "GET").toUpperCase();
  if (!methods.includes(method)) {
    throw new ApiError(405, "METHOD_NOT_ALLOWED", `Use ${methods.join(" or ")} for this endpoint.`);
  }
}

export function getHeader(req: ApiRequest, name: string): string {
  const headers = req.headers || {};
  const needle = name.toLowerCase();

  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== needle) continue;
    if (Array.isArray(value)) return String(value[0] || "");
    return String(value || "");
  }

  return "";
}

export function requireBearerAuth(req: ApiRequest): void {
  const expectedToken = process.env.PARTNER_INTAKE_ACTION_TOKEN;

  if (!expectedToken) {
    throw new ApiError(
      500,
      "CONFIG_ERROR",
      "PARTNER_INTAKE_ACTION_TOKEN is not configured for GPT-facing endpoints."
    );
  }

  const authHeader = getHeader(req, "authorization");
  const [scheme, receivedToken] = authHeader.split(/\s+/);

  if (!authHeader || scheme?.toLowerCase() !== "bearer" || !receivedToken) {
    throw new ApiError(401, "MISSING_AUTH", "Authorization header must use Bearer token auth.");
  }

  if (receivedToken !== expectedToken) {
    throw new ApiError(403, "FORBIDDEN", "Bearer token is invalid for this Partner Intake OS endpoint.");
  }
}

export async function readJson(req: ApiRequest): Promise<unknown> {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.");
    }
  }

  const maybeStream = req as unknown as AsyncIterable<Buffer | string>;

  if (maybeStream && typeof maybeStream[Symbol.asyncIterator] === "function") {
    const chunks: Buffer[] = [];

    for await (const chunk of maybeStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }

    if (!chunks.length) return {};

    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new ApiError(400, "INVALID_JSON", "Request body must be valid JSON.");
    }
  }

  return {};
}

export async function readRawBody(req: ApiRequest): Promise<string> {
  if (typeof req.rawBody === "string") return req.rawBody;
  if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString("utf8");
  if (typeof req.body === "string") return req.body;

  // Do not reconstruct a raw body from a parsed object. HMAC signatures must be
  // verified against the original byte sequence, not JSON.stringify(req.body).
  // Returning an empty string makes signed webhook verification fail closed if
  // the platform/middleware parsed the body before this helper received it.
  if (req.body && typeof req.body === "object") return "";

  const maybeStream = req as unknown as AsyncIterable<Buffer | string>;

  if (maybeStream && typeof maybeStream[Symbol.asyncIterator] === "function") {
    const chunks: Buffer[] = [];
    for await (const chunk of maybeStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
    }
    return Buffer.concat(chunks).toString("utf8");
  }

  return "";
}

export function createSuccess<T extends Record<string, unknown>>(requestId: string, data: T): T & { ok: true; request_id: string } {
  return {
    ok: true,
    request_id: requestId,
    ...data
  };
}

export async function withApiHandler(
  req: ApiRequest,
  res: ApiResponse,
  options: HandlerOptions,
  handler: (context: HandlerContext) => Promise<void> | void
): Promise<void> {
  const requestId = getRequestId(req);

  try {
    applyCors(req, res);
    if (handleOptions(req, res)) return;

    methodGuard(req, options.methods);

    if (options.auth === "bearer") {
      requireBearerAuth(req);
    }

    await handler({ requestId });
  } catch (error) {
    const normalized = normalizeUnknownError(error);
    sendJson(res, normalized.statusCode, toApiErrorPayload(normalized, requestId));
  }
}
