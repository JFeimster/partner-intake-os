import { slugifyTrackingPart, stableHash } from "./tracking-id";

export function createCampaignId(input: {
  partner_id: string;
  campaign_name?: string;
  audience?: string;
  offer?: string;
}): string {
  const name = slugifyTrackingPart(input.campaign_name || input.offer || "campaign", "campaign").slice(0, 42);
  const audience = slugifyTrackingPart(input.audience || "general", "general").slice(0, 28);
  const fingerprint = stableHash(
    {
      partner_id: input.partner_id,
      campaign_name: input.campaign_name || "",
      audience: input.audience || "",
      offer: input.offer || ""
    },
    6
  );

  return `camp_${name}_${audience}_${fingerprint}`;
}

export function isValidCampaignId(value: unknown): boolean {
  return /^camp_[a-z0-9][a-z0-9_-]{6,120}$/.test(String(value ?? ""));
}
