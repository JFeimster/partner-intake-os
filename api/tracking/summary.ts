import { buildTrackingSummary } from "../../lib/tracking/summary";

function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const events = [];
  return res.status(200).json({
    ok: true,
    summary: buildTrackingSummary(events),
    note: "Wire this endpoint to Batch 31 tracking_events table in production.",
  });
}
