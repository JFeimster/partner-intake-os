import { createHmac, timingSafeEqual } from "crypto";
import { ApiError } from "../../lib/errors";
import { createSuccess, getHeader, readJson, readRawBody, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { classifyPartner, sanitizeIntake } from "../../lib/validation";

function normalizeTallyPayload(payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return {};
  }

  const obj = payload as Record<string, unknown>;
  const data = (obj.data && typeof obj.data === "object") ? obj.data as Record<string, unknown> : obj;
  const fields = Array.isArray(data.fields) ? data.fields as Record<string, unknown>[] : [];

  const normalized: Record<string, unknown> = {
    source: "tally",
    submitted_at: new Date().toISOString()
  };

  const map: Record<string, string> = {
    "First name": "first_name",
    "Last name": "last_name",
    "Email": "email",
    "Phone": "phone",
    "Company / brand": "company",
    "Website": "website",
    "Which best describes you?": "partner_type_claimed",
    "Who do you serve?": "audience",
    "What type of businesses do you usually work with?": "industry",
    "Estimated monthly referral volume": "referral_volume_estimate",
    "What tools do you use?": "current_tools",
    "Are you interested in affiliate, referral, broker, or strategic partnership?": "desired_partner_role",
    "Anything else we should know?": "notes"
  };

  for (const field of fields) {
    const label = String(field.label || field.title || field.key || "").trim();
    const value = field.value ?? field.answer ?? field.text ?? "";
    const key = map[label] || label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    if (key) normalized[key] = value;
  }

  if (Object.keys(normalized).length <= 2) {
    Object.assign(normalized, data);
  }

  return sanitizeIntake(normalized);
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) return false;
  return timingSafeEqual(aBuffer, bBuffer);
}

async function verifyTallySignature(req: ApiRequest, rawBody: string): Promise<void> {
  const secret = process.env.TALLY_SIGNING_SECRET;
  if (!secret) return;

  const received =
    getHeader(req, "tally-signature") ||
    getHeader(req, "x-tally-signature") ||
    getHeader(req, "x-signature");

  if (!received) {
    throw new ApiError(401, "SIGNATURE_MISSING", "Tally signature header is required when TALLY_SIGNING_SECRET is configured.");
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedOptions = [`sha256=${digest}`, digest];

  if (!expectedOptions.some((expected) => safeCompare(received, expected))) {
    throw new ApiError(403, "SIGNATURE_INVALID", "Tally webhook signature did not match.");
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "none" }, async ({ requestId }) => {
    const rawBody = await readRawBody(req);
    await verifyTallySignature(req, rawBody);

    let payload: unknown;
    try {
      payload = rawBody ? JSON.parse(rawBody) : await readJson(req);
    } catch {
      throw new ApiError(400, "INVALID_JSON", "Tally webhook body must be valid JSON.");
    }
    const intake = normalizeTallyPayload(payload);
    const classification = classifyPartner(intake);

    // Future handoff:
    // - queue lightweight write to Notion staging database
    // - create/update HubSpot contact/company/task in sandbox
    // - never log raw payload or sensitive PII

    sendJson(res, 202, createSuccess(requestId, {
      accepted: true,
      source: "tally",
      normalized: {
        partner_type_claimed: intake.partner_type_claimed,
        company: intake.company,
        audience: intake.audience,
        source: intake.source
      },
      classification: {
        partner_type: classification.partner_profile.partner_type,
        tier: classification.tier,
        onboarding_path: classification.onboarding_path,
        manual_review_required: classification.manual_review_required,
        risk_flags: classification.risk_flags,
        next_action: classification.next_action
      },
      storage: {
        mode: process.env.PARTNER_INTAKE_STORAGE_MODE || "mock",
        written: false,
        note: "Fast webhook response only. Real sync should run through queue/sandbox storage in later phase."
      }
    }));
  });
}
