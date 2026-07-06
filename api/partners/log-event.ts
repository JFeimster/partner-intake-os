import { ApiError } from "../../lib/errors";
import { createSuccess, readJson, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../../lib/http";
import { asObject } from "../../lib/validation";

const ALLOWED_EVENTS = new Set([
  "intake_reviewed",
  "resource_recommended",
  "onboarding_plan_generated",
  "campaign_kit_generated",
  "partner_approved",
  "partner_watchlisted",
  "manual_review_required"
]);

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["POST"], auth: "bearer" }, async ({ requestId }) => {
    const payload = asObject(await readJson(req));
    const eventType = String(payload.event_type || "").trim();

    if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
      throw new ApiError(400, "VALIDATION_ERROR", "event_type is required and must be an allowed Partner Intake OS event.", {
        fields: ["event_type"]
      });
    }

    const event = {
      event_id: `evt_${Date.now().toString(36)}`,
      event_type: eventType,
      partner_id: String(payload.partner_id || "unassigned"),
      summary: String(payload.summary || "Partner Intake OS event logged.").slice(0, 500),
      created_at: new Date().toISOString(),
      created_by: String(payload.created_by || "partner-intake-api"),
      storage_written: false,
      storage_mode: process.env.PARTNER_INTAKE_STORAGE_MODE || "mock",
      note: "Phase 23 stub only. Wire Notion/HubSpot sync in the storage phase."
    };

    sendJson(res, 200, createSuccess(requestId, {
      logged: true,
      event
    }));
  });
}
