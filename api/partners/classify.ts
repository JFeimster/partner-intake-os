import { makeApiError, requireBearerAuth } from "../../lib/auth";
import { normalizeManualIntake, parseBody } from "../../lib/normalizers/normalize-tally-submission";
import { scorePartnerIntake } from "../../lib/scoring/partner-score";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/partners/classify.");
    return res.status(error.status).json(error.body);
  }

  const auth = requireBearerAuth(req);
  if (auth.ok === false) {
    return res.status(auth.status).json(auth.body);
  }

  try {
    const body = parseBody(req.body);
    const intakeInput = body.intake || body.normalized_intake || body.partner_intake || body;
    const intake = normalizeManualIntake(intakeInput);
    const classification = scorePartnerIntake(intake);

    const displayName = [intake.first_name, intake.last_name].filter(Boolean).join(" ") || intake.company || "Unknown Partner";

    return res.status(200).json({
      ok: true,
      context: body.context || "manual_review",
      intake,
      profile_preview: {
        partner_id: body.partner_id || `ptr_${Date.now()}`,
        display_name: displayName,
        company: intake.company,
        email: intake.email,
        phone: intake.phone,
        website: intake.website,
        partner_type: classification.partner_type,
        partner_tier: classification.partner_tier,
        onboarding_path: classification.onboarding_path,
        primary_audience: intake.audience,
        risk_level: classification.risk_level,
        status: classification.scorecard.manual_review_required ? "needs_review" : "new",
        tags: [
          classification.partner_type,
          classification.partner_tier,
          classification.onboarding_path,
          `risk_${classification.risk_level}`
        ],
        next_action: classification.next_action,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      classification
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to classify partner intake.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
