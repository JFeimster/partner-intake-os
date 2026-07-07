import { notify } from "../../lib/notifications/notify";

function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const body = req.body ?? {};
  const result = await notify({
    template: body.template ?? "partner_submission_received_for_review",
    entity_type: body.entity_type ?? "partner",
    entity_id: body.entity_id ?? body.partner_id,
    recipient: body.recipient,
    partner_facing_enabled: body.partner_facing_enabled === true,
    data: body.data ?? body,
    channels: body.channels ?? ["email"],
  });

  return res.status(200).json(result);
}
