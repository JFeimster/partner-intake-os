function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const { lead_id } = req.query ?? {};
  if (!lead_id) return res.status(400).json({ error: "missing_lead_id" });

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      lead_id,
      status: "received_for_review",
      note: "Placeholder response. Production implementation should load sanitized lead data from Postgres.",
    });
  }

  return res.status(405).json({ error: "method_not_allowed" });
}
