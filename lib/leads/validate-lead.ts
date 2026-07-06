export type LeadValidationError = {
  field: string;
  message: string;
};

export type NormalizedLeadPayload = {
  partner_id: string;
  tracking_id?: string;
  referral_source?: string;
  source: string;
  external_id?: string;
  business: {
    name: string;
    industry?: string;
    monthly_revenue_estimate?: number;
    time_in_business?: string;
  };
  contact: {
    name: string;
    email?: string;
    phone?: string;
  };
  funding: {
    requested_amount_estimate?: number;
    use_of_funds?: string;
    timeline?: string;
  };
  consent_confirmed: boolean;
  consent: {
    confirmed: boolean;
    method?: string;
    captured_at?: string;
  };
  notes?: string;
};

const MAX_TEXT_LENGTH = 2000;

export function toText(value: unknown): string {
  return String(value ?? "").trim();
}

export function toNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function isValidEmail(value: unknown): boolean {
  const email = toText(value);
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function hasText(value: unknown): boolean {
  return toText(value).length > 0;
}

function truncate(value: unknown, max = MAX_TEXT_LENGTH): string {
  return toText(value).slice(0, max);
}

export function normalizeLeadPayload(payload: unknown): NormalizedLeadPayload | null {
  if (!isPlainObject(payload)) return null;

  const business = isPlainObject(payload.business) ? payload.business : {};
  const contact = isPlainObject(payload.contact) ? payload.contact : {};
  const funding = isPlainObject(payload.funding) ? payload.funding : {};
  const consent = isPlainObject(payload.consent) ? payload.consent : {};

  const consentConfirmed = payload.consent_confirmed === true || consent.confirmed === true;

  return {
    partner_id: truncate(payload.partner_id, 120),
    tracking_id: truncate(payload.tracking_id, 120) || undefined,
    referral_source: truncate(payload.referral_source, 160) || undefined,
    source: truncate(payload.source || "partner_api", 80),
    external_id: truncate(payload.external_id, 160) || undefined,
    business: {
      name: truncate(business.name, 180),
      industry: truncate(business.industry, 120) || undefined,
      monthly_revenue_estimate: toNumber(business.monthly_revenue_estimate),
      time_in_business: truncate(business.time_in_business, 80) || undefined
    },
    contact: {
      name: truncate(contact.name, 180),
      email: truncate(contact.email, 180) || undefined,
      phone: truncate(contact.phone, 80) || undefined
    },
    funding: {
      requested_amount_estimate: toNumber(funding.requested_amount_estimate),
      use_of_funds: truncate(funding.use_of_funds, 500) || undefined,
      timeline: truncate(funding.timeline, 80) || undefined
    },
    consent_confirmed: consentConfirmed,
    consent: {
      confirmed: consentConfirmed,
      method: truncate(consent.method || payload.consent_method, 120) || undefined,
      captured_at: truncate(consent.captured_at || payload.consent_captured_at, 80) || undefined
    },
    notes: truncate(payload.notes, 1000) || undefined
  };
}

export function validateLeadPayload(payload: unknown): {
  ok: boolean;
  errors: LeadValidationError[];
  lead?: NormalizedLeadPayload;
} {
  const lead = normalizeLeadPayload(payload);

  if (!lead) {
    return {
      ok: false,
      errors: [{ field: "body", message: "Request body must be a JSON object." }]
    };
  }

  const errors: LeadValidationError[] = [];

  if (!hasText(lead.partner_id)) {
    errors.push({ field: "partner_id", message: "Partner attribution is required." });
  }

  if (!hasText(lead.business.name)) {
    errors.push({ field: "business.name", message: "Business name is required." });
  }

  if (!hasText(lead.contact.name)) {
    errors.push({ field: "contact.name", message: "Authorized contact name is required." });
  }

  if (lead.contact.email && !isValidEmail(lead.contact.email)) {
    errors.push({ field: "contact.email", message: "Contact email must be valid when provided." });
  }

  if (lead.consent_confirmed !== true || lead.consent.confirmed !== true) {
    errors.push({ field: "consent_confirmed", message: "Consent confirmation must be true before lead routing." });
  }

  if (lead.funding.requested_amount_estimate !== undefined && lead.funding.requested_amount_estimate < 0) {
    errors.push({ field: "funding.requested_amount_estimate", message: "Requested amount estimate cannot be negative." });
  }

  if (lead.business.monthly_revenue_estimate !== undefined && lead.business.monthly_revenue_estimate < 0) {
    errors.push({ field: "business.monthly_revenue_estimate", message: "Monthly revenue estimate cannot be negative." });
  }

  return {
    ok: errors.length === 0,
    errors,
    lead
  };
}
