export type UtmInput = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

export type BuiltTrackingUrl = {
  destination_url: string;
  generated_url: string;
  utm: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content?: string;
    utm_term?: string;
  };
};

export function safeUtmValue(value: unknown, fallback = ""): string {
  const text = String(value ?? fallback)
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9._~-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return text || fallback;
}

export function assertHttpUrl(value: unknown, fieldName = "destination_url"): URL {
  const raw = String(value ?? "").trim();

  if (!raw) {
    throw new Error(`${fieldName} is required.`);
  }

  let parsed: URL;

  try {
    parsed = new URL(raw);
  } catch (_error) {
    throw new Error(`${fieldName} must be a valid absolute URL.`);
  }

  if (!["https:", "http:"].includes(parsed.protocol)) {
    throw new Error(`${fieldName} must use http or https.`);
  }

  if (["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname)) {
    throw new Error(`${fieldName} cannot point to localhost or private demo hosts.`);
  }

  return parsed;
}

export function buildUtmUrl(destinationUrl: string, input: UtmInput): BuiltTrackingUrl {
  const parsed = assertHttpUrl(destinationUrl);
  const utm = {
    utm_source: safeUtmValue(input.source || "partner", "partner"),
    utm_medium: safeUtmValue(input.medium || "referral", "referral"),
    utm_campaign: safeUtmValue(input.campaign || "partner-campaign", "partner-campaign"),
    utm_content: input.content ? safeUtmValue(input.content) : undefined,
    utm_term: input.term ? safeUtmValue(input.term) : undefined
  };

  parsed.searchParams.set("utm_source", utm.utm_source);
  parsed.searchParams.set("utm_medium", utm.utm_medium);
  parsed.searchParams.set("utm_campaign", utm.utm_campaign);

  if (utm.utm_content) {
    parsed.searchParams.set("utm_content", utm.utm_content);
  }

  if (utm.utm_term) {
    parsed.searchParams.set("utm_term", utm.utm_term);
  }

  return {
    destination_url: destinationUrl,
    generated_url: parsed.toString(),
    utm
  };
}
