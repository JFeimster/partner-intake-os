import { makeApiError, requireBearerAuth } from "../../lib/auth";
import { parseBody } from "../../lib/normalizers/normalize-tally-submission";
import { recommendResources } from "../../lib/recommendations/resource-router";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/partners/recommend-resources.");
    return res.status(error.status).json(error.body);
  }

  const auth = requireBearerAuth(req);
  if (auth.ok === false) {
    return res.status(auth.status).json(auth.body);
  }

  try {
    const body = parseBody(req.body);
    const recommendations = recommendResources({
      partner_type: body.partner_type || body.profile?.partner_type || "referral_partner",
      audience: body.audience || body.profile?.primary_audience,
      onboarding_path: body.onboarding_path || body.profile?.onboarding_path,
      risk_level: body.risk_level || body.profile?.risk_level
    });

    return res.status(200).json({
      ok: true,
      recommendations,
      count: recommendations.length,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to recommend resources.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
