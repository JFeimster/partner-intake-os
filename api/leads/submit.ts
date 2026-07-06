import { routeLead, queueLeadForReview } from "../../lib/leads/lead-router";
import { validateLeadPayload } from "../../lib/leads/validate-lead";


type ApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
  [key: string]: unknown;
};

type ApiResponse = {
  statusCode?: number;
  setHeader(name: string, value: string): void;
  end(body?: string): void;
};

function setNoStore(res: ApiResponse): void {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
}

function sendJson(res: ApiResponse, statusCode: number, payload: Record<string, unknown>): void {
  res.statusCode = statusCode;
  setNoStore(res);
  res.end(JSON.stringify(payload, null, 2));
}

async function readJson(req: ApiRequest): Promise<unknown> {
  if (req.body && typeof req.body === "object") return req.body;

  const chunks: Buffer[] = [];
  const stream = req as unknown as AsyncIterable<Buffer | string>;

  if (!stream || typeof stream[Symbol.asyncIterator] !== "function") {
    return {};
  }

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  if (!chunks.length) return {};

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

function getHeader(req: ApiRequest, name: string): string {
  const direct = req.headers[name] || req.headers[name.toLowerCase()];
  if (Array.isArray(direct)) return direct[0] || "";
  return direct || "";
}

function requireBearerAuth(req: ApiRequest): { ok: true } | { ok: false; code: string; message: string } {
  const expected = process.env.PARTNER_INTAKE_ACTION_TOKEN || process.env.PARTNER_LEAD_SUBMISSION_TOKEN;
  const authorization = getHeader(req, "authorization");
  const received = authorization.replace(/^Bearer\s+/i, "").trim();

  if (!expected) {
    return {
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message: "Lead submission auth is not configured."
    };
  }

  if (!received || received !== expected) {
    return {
      ok: false,
      code: "UNAUTHORIZED",
      message: "Valid Bearer token is required."
    };
  }

  return { ok: true };
}

function requestId(req: ApiRequest): string {
  return getHeader(req, "x-request-id") || `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  const rid = requestId(req);
  res.setHeader("X-Request-Id", rid);

  if (req.method !== "POST") {
    return sendJson(res, 405, {
      ok: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Use POST for lead submission."
      },
      request_id: rid
    });
  }

  const auth = requireBearerAuth(req);
  if (!auth.ok) {
    return sendJson(res, auth.code === "AUTH_NOT_CONFIGURED" ? 500 : 401, {
      ok: false,
      error: {
        code: auth.code,
        message: auth.message
      },
      request_id: rid
    });
  }

  let body: unknown;
  try {
    body = await readJson(req);
  } catch {
    return sendJson(res, 400, {
      ok: false,
      error: {
        code: "INVALID_JSON",
        message: "Request body must be valid JSON."
      },
      request_id: rid
    });
  }

  const validation = validateLeadPayload(body);
  if (!validation.ok || !validation.lead) {
    return sendJson(res, 400, {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Lead submission failed validation.",
        fields: validation.errors
      },
      compliance_message: "Only submit information you have permission to share. Do not submit sensitive borrower, banking, tax, credential, or private document data.",
      request_id: rid
    });
  }

  const routedLead = routeLead(validation.lead);
  const queue = await queueLeadForReview(routedLead);

  return sendJson(res, 202, {
    ok: true,
    message: routedLead.compliance_message,
    lead_id: routedLead.lead_id,
    status: routedLead.status,
    review_status: routedLead.review_status,
    manual_review_required: routedLead.manual_review_required,
    partner_attribution: {
      partner_id: routedLead.partner_id,
      tracking_id: routedLead.tracking_id,
      referral_source: routedLead.referral_source
    },
    risk: {
      risk_level: routedLead.risk_level,
      risk_flags: routedLead.risk_flags
    },
    next_action: routedLead.next_action,
    sync: queue,
    data: {
      created_at: routedLead.created_at,
      source: routedLead.source,
      event_count: routedLead.events.length
    },
    request_id: rid
  });
}
