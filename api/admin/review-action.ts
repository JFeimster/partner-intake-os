import { appendDecisionLog } from "../../lib/review/decision-log";
import { assertReviewStatus } from "../../lib/review/status-rules";

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
    if (!body.review_item_id || !body.entity_type || !body.entity_id || !body.action) {
      return send(res, 400, { error: "missing_required_fields" });
    }

    if (body.previous_status) assertReviewStatus(body.previous_status);
    if (body.new_status) assertReviewStatus(body.new_status);

    const decision = await appendDecisionLog({
      review_item_id: body.review_item_id,
      entity_type: body.entity_type,
      entity_id: body.entity_id,
      action: body.action,
      previous_status: body.previous_status,
      new_status: body.new_status,
      reason_code: body.reason_code,
      operator_note: body.operator_note,
      created_by: body.created_by ?? "admin",
      metadata: body.metadata ?? {},
    });

    return send(res, 200, {
      ok: true,
      message: "Review action received for review workflow logging.",
      decision,
    });
  } catch (error: any) {
    return send(res, 400, { error: "review_action_failed", message: error.message });
  }
}
