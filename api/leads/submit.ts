import { assessDuplicateSignal } from "../../lib/leads/duplicate-detection";
import { verifyLeadConsent } from "../../lib/leads/consent";
import { detectSensitiveLeadData, routeLeadSubmission } from "../../lib/leads/routing";

function send(res: any, statusCode: number, body: unknown) {
  res.status(statusCode).json(body);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });

  const body = req.body ?? {};
  if (!body.partner_id) return send(res, 400, { error: "missing_partner_id" });

  const consent = verifyLeadConsent({
    consent_to_contact: body.consent_to_contact,
    consent_source: body.consent_source,
    consent_timestamp: body.consent_timestamp,
    submitted_by_partner_id: body.partner_id,
  });

  const duplicate = assessDuplicateSignal({
    partner_id: body.partner_id,
    external_lead_id: body.external_lead_id,
    email: body.email,
    phone: body.phone,
    business_name: body.business_name,
    source: body.source,
  }, body.existing_duplicate_keys ?? []);

  const sensitiveFlags = detectSensitiveLeadData(body);
  const routing = routeLeadSubmission({
    duplicate_result: duplicate.result,
    consent_valid: consent.valid,
    sensitive_data_flagged: sensitiveFlags.length > 0,
    partner_tier: body.partner_tier,
    lead_value_signal: body.lead_value_signal ?? "unknown",
  });

  return send(res, 202, {
    ok: true,
    status: routing.status,
    message: "Lead submission received for review. Funding options may vary. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.",
    review: {
      manual_review_required: routing.status === "manual_review_required",
      assigned_role: routing.assigned_role,
      reason_codes: [...routing.reason_codes, ...duplicate.reason_codes, ...sensitiveFlags],
    },
    duplicate: {
      result: duplicate.result,
      duplicate_key: duplicate.duplicate_key,
    },
    consent: {
      valid: consent.valid,
      missing_fields: consent.missing_fields,
    },
  });
}
