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
    template: body.template ?? "internal_new_partner_needs_review",
    entity_type: body.entity_type ?? "review_item",
    entity_id: body.entity_id ?? body.review_item_id,
    recipient: body.recipient,
    partner_facing_enabled: false,
    data: body.data ?? body,
    channels: body.channels ?? ["email"],
  });

  return res.status(200).json(result);
}
