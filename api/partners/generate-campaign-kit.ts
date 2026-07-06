import { createSuccess, readJson, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { asObject, buildCampaignKit, inferAudience, inferPartnerType } from "../../lib/validation";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "bearer" }, async ({ requestId }) => {
    const payload = asObject(await readJson(req));
    const intake = (payload.intake && typeof payload.intake === "object") ? payload.intake as Record<string, unknown> : payload;

    const partnerType = String(payload.partner_type || inferPartnerType(intake));
    const audience = String(payload.audience || inferAudience(intake));
    const campaign = buildCampaignKit(partnerType, audience);

    sendJson(res, 200, createSuccess(requestId, {
      campaign_kit: campaign,
      next_action: "Create tracking link placeholder and review copy before partner use.",
      review_required: true
    }));
  });
}
