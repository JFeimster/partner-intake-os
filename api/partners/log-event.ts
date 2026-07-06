import { makeApiError, requireBearerAuth } from "../../lib/auth";
import { getStorageMode } from "../../lib/env";
import { parseBody } from "../../lib/normalizers/normalize-tally-submission";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "POST") {
    const error = makeApiError(req, 405, "bad_request", "Use POST /api/partners/log-event.");
    return res.status(error.status).json(error.body);
  }

  const auth = requireBearerAuth(req);
  if (auth.ok === false) {
    return res.status(auth.status).json(auth.body);
  }

  try {
    const body = parseBody(req.body);
    const now = new Date().toISOString();

    const event = {
      event_id: body.event_id || `evt_${Date.now()}`,
      partner_id: body.partner_id || body.event?.partner_id,
      event_type: body.event_type || body.event?.event_type || "note_added",
      event_source: body.event_source || body.event?.event_source || "api",
      summary: body.summary || body.event?.summary || "Partner event logged.",
      next_action: body.next_action || body.event?.next_action,
      owner: body.owner || body.event?.owner || "partner_ops",
      status: body.status || body.event?.status || "logged",
      created_at: body.created_at || now,
      created_by: body.created_by || "partner_intake_api",
      metadata: body.metadata || body.event?.metadata || {}
    };

    // Batch 06 will replace this mock response with storage-router calls for Notion,
    // HubSpot, Google Sheets, or JSON/local storage.
    return res.status(200).json({
      ok: true,
      logged: true,
      storage_mode: getStorageMode(),
      storage_status: "mock_logged_no_database_yet",
      event
    });
  } catch (error) {
    const apiError = makeApiError(req, 500, "internal_error", "Unable to log partner event.", {
      reason: error instanceof Error ? error.message : "unknown_error"
    });
    return res.status(apiError.status).json(apiError.body);
  }
}
