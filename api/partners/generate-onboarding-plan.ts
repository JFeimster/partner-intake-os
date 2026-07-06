import { makeApiError, requireBearerAuth } from "../../lib/auth";
import { parseBody } from "../../lib/normalizers/normalize-tally-submission";
import { generateOnboardingPlan } from "../../lib/recommendations/onboarding-router";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/partners/generate-onboarding-plan.");
    return res.status(error.status).json(error.body);
  }

  const auth = requireBearerAuth(req);
  if (auth.ok === false) {
    return res.status(auth.status).json(auth.body);
  }

  try {
    const body = parseBody(req.body);
    const profile = body.profile || body;

    const onboarding_plan = generateOnboardingPlan({
      partner_id: profile.partner_id,
      partner_type: profile.partner_type || "referral_partner",
      partner_tier: profile.partner_tier,
      onboarding_path: profile.onboarding_path || "education_first_partner",
      risk_level: profile.risk_level,
      manual_review_required: profile.manual_review_required,
      next_action: profile.next_action
    });

    return res.status(200).json({
      ok: true,
      onboarding_plan,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to generate onboarding plan.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
