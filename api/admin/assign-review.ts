import { assignReviewItem } from "../../lib/review/assignment";

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

  const body = req.body ?? {};
  if (!body.review_item_id) return send(res, 400, { error: "missing_review_item_id" });

  const assignment = assignReviewItem({
    risk_level: body.risk_level,
    partner_tier: body.partner_tier,
    reason_codes: body.reason_codes,
    entity_type: body.entity_type,
    preferred_reviewer_id: body.preferred_reviewer_id,
  });

  return send(res, 200, {
    ok: true,
    review_item_id: body.review_item_id,
    assignment,
    note: "Assignment calculated. Persist to admin_review_items in production implementation.",
  });
}
