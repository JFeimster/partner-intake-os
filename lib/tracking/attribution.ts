import { TrackingEvent } from "./analytics";

export interface AttributionSummary {
  partner_id?: string;
  campaign_id?: string;
  tracking_link_id?: string;
  first_touch_at?: string | null;
  last_touch_at?: string | null;
  lead_submissions: number;
  clicks: number;
  conversion_rate: number;
}

export function summarizeAttribution(events: TrackingEvent[]): AttributionSummary {
  const sorted = [...events].sort((a, b) => String(a.occurred_at ?? "").localeCompare(String(b.occurred_at ?? "")));
  const clicks = events.filter((event) => event.event_type === "click").length;
  const lead_submissions = events.filter((event) => event.event_type === "lead_submitted").length;

  return {
    partner_id: sorted[0]?.partner_id,
    campaign_id: sorted[0]?.campaign_id,
    tracking_link_id: sorted[0]?.tracking_link_id,
    first_touch_at: sorted[0]?.occurred_at ?? null,
    last_touch_at: sorted[sorted.length - 1]?.occurred_at ?? null,
    clicks,
    lead_submissions,
    conversion_rate: clicks > 0 ? Number(((lead_submissions / clicks) * 100).toFixed(2)) : 0,
  };
}
