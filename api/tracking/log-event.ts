import { createTrackingEvent } from "../../lib/tracking/tracking-events";


type Req = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  [key: string]: unknown;
};

type Res = {
  status: (code: number) => Res;
  setHeader: (name: string, value: string) => void;
  json: (payload: unknown) => void;
};

function setNoStore(res: Res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function getHeader(req: Req, name: string): string {
  const value = req.headers[name.toLowerCase()] || req.headers[name];
  return Array.isArray(value) ? value[0] || "" : String(value || "");
}

function getBearerToken(req: Req): string {
  const authorization = getHeader(req, "authorization");
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function isAuthorized(req: Req): boolean {
  const expected = process.env.PARTNER_INTAKE_ACTION_TOKEN || process.env.PARTNER_TRACKING_API_TOKEN || "";
  const received = getBearerToken(req);
  return Boolean(expected && received && received === expected);
}

function send(res: Res, statusCode: number, payload: unknown) {
  setNoStore(res);
  return res.status(statusCode).json(payload);
}

function methodNotAllowed(res: Res, allowed: string[]) {
  res.setHeader("Allow", allowed.join(", "));
  return send(res, 405, {
    ok: false,
    error: {
      code: "METHOD_NOT_ALLOWED",
      message: `Use ${allowed.join(" or ")} for this endpoint.`
    }
  });
}

function unauthorized(res: Res) {
  return send(res, 401, {
    ok: false,
    error: {
      code: "UNAUTHORIZED",
      message: "Bearer token is required for Partner Intake OS tracking API routes."
    }
  });
}


export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  if (!isAuthorized(req)) {
    return unauthorized(res);
  }

  try {
    const event = createTrackingEvent((req.body || {}) as Record<string, unknown>);

    return send(res, 200, {
      ok: true,
      event,
      status: "logged_stub",
      storage: {
        saved: false,
        mode: process.env.PARTNER_INTAKE_STORAGE_MODE || "mock",
        note: "Event is accepted for API compatibility but not persisted in Phase 28."
      },
      privacy_note: "Do not submit sensitive personal, bank, tax, credential, underwriting, or lender-status data in tracking event metadata."
    });
  } catch (error) {
    return send(res, 400, {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: error instanceof Error ? error.message : "Tracking event failed validation."
      }
    });
  }
}
