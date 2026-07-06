import { makeApiError, verifyTallySignature } from "../../lib/auth";
import { getStorageMode } from "../../lib/env";
import { normalizeTallySubmission, parseBody } from "../../lib/normalizers/normalize-tally-submission";
import { scorePartnerIntake } from "../../lib/scoring/partner-score";
import { recommendResources } from "../../lib/recommendations/resource-router";
import { recommendCampaign } from "../../lib/recommendations/campaign-router";
import { generateOnboardingPlan } from "../../lib/recommendations/onboarding-router";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/tally/partner-intake-webhook.");
    return res.status(error.status).json(error.body);
  }

  const rawBody =
    typeof req.body === "string"
      ? req.body
      : JSON.stringify(req.body || {});

  const signature = verifyTallySignature(req, rawBody);
  if (signature.ok === false) {
    return res.status(signature.status).json(signature.body);
  }

  try {
    const payload = parseBody(req.body);
    const normalized_intake = normalizeTallySubmission(payload);
    const classification = scorePartnerIntake(normalized_intake);

    const resources = recommendResources({
      partner_type: classification.partner_type,
      audience: normalized_intake.audience,
      onboarding_path: classification.onboarding_path,
      risk_level: classification.risk_level
    });

    const campaign = recommendCampaign({
      partner_type: classification.partner_type,
      audience: normalized_intake.audience,
      onboarding_path: classification.onboarding_path,
      partner_tier: classification.partner_tier
    });

    const onboarding_plan = generateOnboardingPlan({
      partner_type: classification.partner_type,
      partner_tier: classification.partner_tier,
      onboarding_path: classification.onboarding_path,
      risk_level: classification.risk_level,
      manual_review_required: classification.scorecard.manual_review_required,
      next_action: classification.next_action
    });

    // Batch 06 will call storage-router here to persist to Notion, HubSpot,
    // Google Sheets, or JSON storage. For this scaffold, return a fast 2XX
    // with the normalized/classified payload for testing.
    return res.status(202).json({
      ok: true,
      received: true,
      source: "tally",
      storage_mode: getStorageMode(),
      storage_status: "not_persisted_until_batch_06_storage_connectors",
      normalized_intake,
      classification,
      recommendations: {
        resources,
        campaign,
        onboarding_plan
      },
      warning: "Do not expose this Tally webhook endpoint through GPT Actions.",
      processed_at: new Date().toISOString()
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to process Tally partner intake webhook.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
