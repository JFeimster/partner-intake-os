import { createLeadStatusHistoryEntry } from "../../../../lib/leads/status-history";

function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const { lead_id } = req.query ?? {};
  const body = req.body ?? {};

  const history = createLeadStatusHistoryEntry({
    lead_id,
    previous_status: body.previous_status,
    new_status: body.new_status ?? "manual_review_required",
    reason_code: body.reason_code,
    operator_note: body.operator_note,
    changed_by: body.changed_by ?? "admin",
  });

  return res.status(200).json({
    ok: true,
    message: "Lead decision recorded for review workflow. This does not imply lender review or funding approval.",
    history,
  });
}
