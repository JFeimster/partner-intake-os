import { createSuccess, readJson, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { asObject, inferAudience, inferPartnerType, recommendResources } from "../../lib/validation";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "bearer" }, async ({ requestId }) => {
    const payload = asObject(await readJson(req));
    const intake = (payload.intake && typeof payload.intake === "object") ? payload.intake as Record<string, unknown> : payload;

    const partnerType = String(payload.partner_type || inferPartnerType(intake));
    const audience = String(payload.audience || inferAudience(intake));
    const resources = recommendResources(partnerType, audience);

    sendJson(res, 200, createSuccess(requestId, {
      partner_type: partnerType,
      audience,
      recommended_resources: resources,
      next_action: "Attach the highest-priority resource to the partner onboarding record.",
      compliance_note: "Resources are educational and operational only. They must not imply funding approval, guaranteed terms, or guaranteed commissions."
    }));
  });
}
