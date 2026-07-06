import { createSuccess, readJson, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { buildOnboardingPlan, classifyPartner, getIntakeFromPayload } from "../../lib/validation";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "bearer" }, async ({ requestId }) => {
    const payload = await readJson(req);
    const intake = getIntakeFromPayload(payload);
    const classification = classifyPartner(intake);
    const plan = buildOnboardingPlan(classification);

    sendJson(res, 200, createSuccess(requestId, {
      onboarding_plan: plan,
      manual_review_required: classification.manual_review_required,
      risk_flags: classification.risk_flags,
      next_action: classification.next_action
    }));
  });
}
