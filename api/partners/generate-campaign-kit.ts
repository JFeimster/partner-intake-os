import { makeApiError, requireBearerAuth } from "../../lib/auth";
import { parseBody } from "../../lib/normalizers/normalize-tally-submission";
import { recommendCampaign } from "../../lib/recommendations/campaign-router";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/partners/generate-campaign-kit.");
    return res.status(error.status).json(error.body);
  }

  const auth = requireBearerAuth(req);
  if (auth.ok === false) {
    return res.status(auth.status).json(auth.body);
  }

  try {
    const body = parseBody(req.body);
    const profile = body.profile || body;

    const campaign = recommendCampaign({
      partner_type: profile.partner_type || "referral_partner",
      audience: profile.primary_audience || profile.audience,
      onboarding_path: profile.onboarding_path,
      partner_tier: profile.partner_tier
    });

    return res.status(200).json({
      ok: true,
      campaign,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to generate campaign kit.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
