import { groupEventsByType, TrackingEvent } from "./analytics";
import { summarizeAttribution } from "./attribution";

export interface TrackingSummary {
  totals: ReturnType<typeof groupEventsByType>;
  attribution: ReturnType<typeof summarizeAttribution>;
  generated_at: string;
  disclaimer: string;
}

export function buildTrackingSummary(events: TrackingEvent[]): TrackingSummary {
  return {
    totals: groupEventsByType(events),
    attribution: summarizeAttribution(events),
    generated_at: new Date().toISOString(),
    disclaimer: "Tracking summaries are for operational attribution only. They do not calculate payouts, commissions, approvals, or guaranteed outcomes.",
  };
}

export function filterEventsByPartner(events: TrackingEvent[], partnerId: string): TrackingEvent[] {
  return events.filter((event) => event.partner_id === partnerId);
}

export function filterEventsByCampaign(events: TrackingEvent[], campaignId: string): TrackingEvent[] {
  return events.filter((event) => event.campaign_id === campaignId);
}
