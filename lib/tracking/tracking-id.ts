export function slugifyTrackingPart(value: unknown, fallback = "item"): string {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return raw || fallback;
}

export function stableHash(input: unknown, length = 10): string {
  const text = JSON.stringify(input ?? "");
  let hash = 2166136261;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return Math.abs(hash >>> 0).toString(36).slice(0, length).padStart(6, "0");
}

export function createTrackingId(input: {
  partner_id: string;
  campaign_id: string;
  destination_url: string;
  channel?: string;
}): string {
  const partner = slugifyTrackingPart(input.partner_id, "partner").slice(0, 28);
  const campaign = slugifyTrackingPart(input.campaign_id, "campaign").slice(0, 28);
  const channel = slugifyTrackingPart(input.channel || "default", "channel").slice(0, 18);
  const fingerprint = stableHash(
    {
      partner_id: input.partner_id,
      campaign_id: input.campaign_id,
      destination_url: input.destination_url,
      channel
    },
    8
  );

  return `trk_${partner}_${campaign}_${channel}_${fingerprint}`;
}

export function isValidTrackingId(value: unknown): boolean {
  return /^trk_[a-z0-9][a-z0-9_-]{8,120}$/.test(String(value ?? ""));
}
