import crypto from "crypto";

export type DuplicateResultType = "none" | "possible_duplicate" | "likely_duplicate" | "confirmed_duplicate";

export interface LeadDuplicateInput {
  partner_id?: string;
  lead_id?: string;
  external_lead_id?: string;
  email?: string;
  phone?: string;
  business_name?: string;
  source?: string;
}

export interface LeadDuplicateResult {
  result: DuplicateResultType;
  duplicate_key: string;
  reason_codes: string[];
  manual_review_required: boolean;
}

function normalize(value?: string): string {
  return String(value ?? "").trim().toLowerCase();
}

export function hashValue(value?: string): string | null {
  const normalized = normalize(value);
  if (!normalized) return null;
  return crypto.createHash("sha256").update(normalized).digest("hex");
}

export function createLeadDuplicateKey(input: LeadDuplicateInput): string {
  const parts = [
    normalize(input.partner_id),
    hashValue(input.email),
    hashValue(input.phone),
    normalize(input.business_name).replace(/[^a-z0-9]/g, ""),
    normalize(input.external_lead_id),
  ].filter(Boolean);

  return crypto.createHash("sha256").update(parts.join(":")).digest("hex");
}

export function assessDuplicateSignal(input: LeadDuplicateInput, existingKeys: string[] = []): LeadDuplicateResult {
  const duplicate_key = createLeadDuplicateKey(input);
  const reason_codes: string[] = [];
  let result: DuplicateResultType = "none";

  if (existingKeys.includes(duplicate_key)) {
    result = "confirmed_duplicate";
    reason_codes.push("duplicate_key_match");
  } else if (input.email && input.phone) {
    result = "possible_duplicate";
    reason_codes.push("email_phone_present_check_existing");
  } else if (input.business_name && (input.email || input.phone)) {
    result = "possible_duplicate";
    reason_codes.push("business_contact_similarity_check");
  }

  return {
    result,
    duplicate_key,
    reason_codes,
    manual_review_required: result === "likely_duplicate" || result === "confirmed_duplicate",
  };
}
