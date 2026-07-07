import { assertReviewStatus, assertStatusTransition } from "../../lib/review/status-rules";
import { appendDecisionLog } from "../../lib/review/decision-log";

function send(res: any, statusCode: number, body: unknown) {
  res.status(statusCode).json(body);
}

function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  if (!requireAdmin(req)) return send(res, 401, { error: "unauthorized" });

  try {
    const body = req.body ?? {};
    const previous = assertReviewStatus(body.previous_status);
    const next = assertReviewStatus(body.new_status);
    assertStatusTransition(previous, next);

    const decision = await appendDecisionLog({
      review_item_id: body.review_item_id,
      entity_type: body.entity_type ?? "partner",
      entity_id: body.entity_id,
      action: "update_status",
      previous_status: previous,
      new_status: next,
      reason_code: body.reason_code,
      operator_note: body.operator_note,
      created_by: body.created_by ?? "admin",
    });

    return send(res, 200, {
      ok: true,
      status: next,
      decision,
      message: next === "approved_for_onboarding"
        ? "Record cleared for onboarding workflow. This is not funding or lender approval."
        : "Review status updated.",
    });
  } catch (error: any) {
    return send(res, 400, { error: "status_update_failed", message: error.message });
  }
}
