import { buildTrackingSummary, filterEventsByCampaign } from "../../lib/tracking/summary";

function requireAdmin(req: any): boolean {
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "");
  return Boolean(token && process.env.PARTNER_INTAKE_ADMIN_TOKEN && token === process.env.PARTNER_INTAKE_ADMIN_TOKEN);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "unauthorized" });

  const campaignId = req.query?.campaign_id;
  const events = [];
  const filtered = campaignId ? filterEventsByCampaign(events, String(campaignId)) : events;

  return res.status(200).json({
    ok: true,
    campaign_id: campaignId ?? null,
    summary: buildTrackingSummary(filtered),
  });
}
