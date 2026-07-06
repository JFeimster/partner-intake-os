import { createCampaignId } from "../../lib/tracking/campaign-id";
import { createTrackingId } from "../../lib/tracking/tracking-id";
import { buildUtmUrl, safeUtmValue } from "../../lib/tracking/utm-builder";
import { sanitizeTrackingMetadata, TrackingLinkInput, validateTrackingLinkInput } from "../../lib/tracking/validate-tracking-link";


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

  const payload = (req.body || {}) as TrackingLinkInput;
  const validation = validateTrackingLinkInput(payload);

  if (!validation.ok) {
    return send(res, 400, {
      ok: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Tracking link payload failed validation.",
        fields: validation.errors
      },
      warnings: validation.warnings
    });
  }

  const partnerId = String(payload.partner_id || "").trim();
  const campaignId = payload.campaign_id
    ? String(payload.campaign_id).trim()
    : createCampaignId({
        partner_id: partnerId,
        campaign_name: payload.campaign_name,
        audience: payload.audience,
        offer: payload.offer
      });

  const channel = safeUtmValue(payload.channel || payload.medium || "referral", "referral");
  const trackingId = createTrackingId({
    partner_id: partnerId,
    campaign_id: campaignId,
    destination_url: String(payload.destination_url),
    channel
  });

  const utm = buildUtmUrl(String(payload.destination_url), {
    source: payload.source || partnerId,
    medium: payload.medium || channel,
    campaign: campaignId,
    content: payload.content,
    term: payload.term
  });

  const trackingBaseUrl = (process.env.TRACKING_BASE_URL || process.env.PARTNER_BASE_URL || "https://YOUR_VERCEL_DOMAIN.vercel.app").replace(/\/+$/, "");
  const generatedUrl = `${trackingBaseUrl}/r/${encodeURIComponent(trackingId)}?to=${encodeURIComponent(utm.generated_url)}`;

  return send(res, 200, {
    ok: true,
    tracking_id: trackingId,
    partner_id: partnerId,
    campaign_id: campaignId,
    generated_url: generatedUrl,
    destination_url: utm.destination_url,
    destination_url_with_utm: utm.generated_url,
    utm: utm.utm,
    status: "created_stub",
    storage: {
      saved: false,
      mode: process.env.PARTNER_INTAKE_STORAGE_MODE || "mock",
      note: "Tracking link is deterministic demo output. Wire storage before using this as production attribution."
    },
    warnings: validation.warnings,
    metadata: sanitizeTrackingMetadata(payload.metadata),
    compliance_note: "Tracking links are for attribution and campaign routing only. Do not encode sensitive personal, banking, tax, or underwriting data in links or metadata."
  });
}
