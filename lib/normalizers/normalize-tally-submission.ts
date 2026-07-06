export type PartnerTypeClaimed =
  | "funding_broker"
  | "iso"
  | "referral_partner"
  | "cpa_bookkeeper"
  | "small_business_attorney"
  | "business_broker"
  | "real_estate_investor_connector"
  | "contractor_trades_connector"
  | "franchise_consultant"
  | "veteran_community_connector"
  | "creator_affiliate"
  | "fintech_vendor_partner"
  | "strategic_partner"
  | "unknown"
  | "other";

export type IntakeSource =
  | "tally"
  | "manual"
  | "gpt"
  | "hubspot"
  | "notion"
  | "google_sheets"
  | "import"
  | "other";

export type PartnerIntake = {
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  partner_type_claimed?: PartnerTypeClaimed;
  audience?: string;
  industry?: string;
  location?: string;
  funding_experience?: string;
  current_tools?: string[];
  traffic_or_network_size?: string;
  referral_volume_estimate?: string;
  desired_partner_role?: string;
  notes?: string;
  source: IntakeSource;
  submitted_at: string;
};

type RawTallyField = {
  key?: string;
  id?: string;
  label?: string;
  title?: string;
  type?: string;
  value?: unknown;
  answer?: unknown;
  options?: unknown;
};

const partnerTypeValues: PartnerTypeClaimed[] = [
  "funding_broker",
  "iso",
  "referral_partner",
  "cpa_bookkeeper",
  "small_business_attorney",
  "business_broker",
  "real_estate_investor_connector",
  "contractor_trades_connector",
  "franchise_consultant",
  "veteran_community_connector",
  "creator_affiliate",
  "fintech_vendor_partner",
  "strategic_partner",
  "unknown",
  "other"
];

const fieldAliases: Record<keyof Omit<PartnerIntake, "source" | "submitted_at">, string[]> = {
  first_name: ["first_name", "first name", "first"],
  last_name: ["last_name", "last name", "last"],
  email: ["email", "email address", "partner email"],
  phone: ["phone", "phone number", "mobile"],
  company: ["company", "company / brand", "business", "brand"],
  website: ["website", "site", "url"],
  partner_type_claimed: ["partner_type_claimed", "which best describes you?", "partner type", "type"],
  audience: ["audience", "who do you serve?", "clients", "network"],
  industry: ["industry", "vertical", "niche"],
  location: ["location", "market", "city", "state"],
  funding_experience: ["funding_experience", "funding experience", "do you currently refer business funding deals?"],
  current_tools: ["current_tools", "tools", "crm", "what tools do you use?"],
  traffic_or_network_size: ["traffic_or_network_size", "traffic", "network size", "audience size"],
  referral_volume_estimate: ["referral_volume_estimate", "estimated monthly referral volume", "referral volume"],
  desired_partner_role: ["desired_partner_role", "desired role", "affiliate, referral, broker, or strategic partnership"],
  notes: ["notes", "anything else we should know?", "comments"]
};

function asString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    if (typeof objectValue.label === "string") {
      return objectValue.label;
    }
    if (typeof objectValue.value === "string") {
      return objectValue.value;
    }
    return JSON.stringify(value);
  }

  return String(value).trim();
}

function asStringArray(value: unknown): string[] {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean);
  }

  const asText = asString(value);
  if (!asText) {
    return [];
  }

  return asText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getPayloadFields(payload: any): RawTallyField[] {
  const candidates = [
    payload?.fields,
    payload?.data?.fields,
    payload?.response?.fields,
    payload?.event?.fields
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
}

function buildFieldIndex(fields: RawTallyField[]): Record<string, unknown> {
  const index: Record<string, unknown> = {};

  for (const field of fields) {
    const rawKey = field.key || field.id || field.label || field.title || "";
    const rawLabel = field.label || field.title || field.key || field.id || "";
    const value = field.value ?? field.answer ?? "";

    if (rawKey) {
      index[normalizeKey(rawKey)] = value;
    }

    if (rawLabel) {
      index[normalizeKey(rawLabel)] = value;
    }
  }

  return index;
}

function findValue(index: Record<string, unknown>, aliases: string[]): unknown {
  for (const alias of aliases) {
    const direct = index[normalizeKey(alias)];
    if (direct !== undefined) {
      return direct;
    }
  }

  return undefined;
}

function normalizePartnerType(value: unknown): PartnerTypeClaimed {
  const raw = asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (partnerTypeValues.includes(raw as PartnerTypeClaimed)) {
    return raw as PartnerTypeClaimed;
  }

  if (raw.includes("bookkeeper") || raw.includes("cpa")) return "cpa_bookkeeper";
  if (raw.includes("attorney") || raw.includes("law")) return "small_business_attorney";
  if (raw.includes("business_broker")) return "business_broker";
  if (raw.includes("broker")) return "funding_broker";
  if (raw.includes("iso")) return "iso";
  if (raw.includes("creator") || raw.includes("affiliate")) return "creator_affiliate";
  if (raw.includes("strategic")) return "strategic_partner";
  if (raw.includes("vendor") || raw.includes("fintech")) return "fintech_vendor_partner";
  if (raw.includes("veteran")) return "veteran_community_connector";

  return value ? "other" : "unknown";
}

export function normalizeManualIntake(input: any): PartnerIntake {
  const now = new Date().toISOString();

  return {
    first_name: asString(input?.first_name) || undefined,
    last_name: asString(input?.last_name) || undefined,
    email: asString(input?.email),
    phone: asString(input?.phone) || undefined,
    company: asString(input?.company) || undefined,
    website: asString(input?.website) || undefined,
    partner_type_claimed: normalizePartnerType(input?.partner_type_claimed),
    audience: asString(input?.audience) || undefined,
    industry: asString(input?.industry) || undefined,
    location: asString(input?.location) || undefined,
    funding_experience: asString(input?.funding_experience) || undefined,
    current_tools: Array.isArray(input?.current_tools)
      ? asStringArray(input.current_tools)
      : asStringArray(input?.current_tools),
    traffic_or_network_size: asString(input?.traffic_or_network_size) || undefined,
    referral_volume_estimate: asString(input?.referral_volume_estimate) || undefined,
    desired_partner_role: asString(input?.desired_partner_role) || undefined,
    notes: asString(input?.notes) || undefined,
    source: input?.source || "manual",
    submitted_at: input?.submitted_at || now
  };
}

export function normalizeTallySubmission(payload: any): PartnerIntake {
  const fields = getPayloadFields(payload);
  const index = buildFieldIndex(fields);

  const submittedAt =
    payload?.submitted_at ||
    payload?.data?.submittedAt ||
    payload?.data?.createdAt ||
    payload?.created_at ||
    new Date().toISOString();

  const intake = {
    first_name: asString(findValue(index, fieldAliases.first_name)) || undefined,
    last_name: asString(findValue(index, fieldAliases.last_name)) || undefined,
    email: asString(findValue(index, fieldAliases.email)),
    phone: asString(findValue(index, fieldAliases.phone)) || undefined,
    company: asString(findValue(index, fieldAliases.company)) || undefined,
    website: asString(findValue(index, fieldAliases.website)) || undefined,
    partner_type_claimed: normalizePartnerType(findValue(index, fieldAliases.partner_type_claimed)),
    audience: asString(findValue(index, fieldAliases.audience)) || undefined,
    industry: asString(findValue(index, fieldAliases.industry)) || undefined,
    location: asString(findValue(index, fieldAliases.location)) || undefined,
    funding_experience: asString(findValue(index, fieldAliases.funding_experience)) || undefined,
    current_tools: asStringArray(findValue(index, fieldAliases.current_tools)),
    traffic_or_network_size: asString(findValue(index, fieldAliases.traffic_or_network_size)) || undefined,
    referral_volume_estimate: asString(findValue(index, fieldAliases.referral_volume_estimate)) || undefined,
    desired_partner_role: asString(findValue(index, fieldAliases.desired_partner_role)) || undefined,
    notes: asString(findValue(index, fieldAliases.notes)) || undefined,
    source: "tally" as const,
    submitted_at: submittedAt
  };

  return normalizeManualIntake(intake);
}

export function parseBody(body: any): any {
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body || {};
}
