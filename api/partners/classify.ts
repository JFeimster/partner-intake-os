import { createSuccess, readJson, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { classifyPartner, getIntakeFromPayload, validateIntake } from "../../lib/validation";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "bearer" }, async ({ requestId }) => {
    const payload = await readJson(req);
    const intake = getIntakeFromPayload(payload);

    validateIntake(intake, { allowLowInfo: true });

    const classification = classifyPartner(intake);

    sendJson(res, 200, createSuccess(requestId, {
      partner_profile: classification.partner_profile,
      scorecard: classification.scorecard,
      tier: classification.tier,
      onboarding_path: classification.onboarding_path,
      risk_flags: classification.risk_flags,
      manual_review_required: classification.manual_review_required,
      next_action: classification.next_action,
      storage: {
        mode: process.env.PARTNER_INTAKE_STORAGE_MODE || "mock",
        written: false,
        note: "Storage writes are stubbed in Phase 23. Wire Notion/HubSpot in the storage sync phase."
      }
    }));
  });
}
