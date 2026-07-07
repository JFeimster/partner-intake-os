export interface LeadConsentInput {
  consent_to_contact?: boolean;
  consent_source?: string;
  consent_timestamp?: string;
  submitted_by_partner_id?: string;
}

export interface LeadConsentResult {
  valid: boolean;
  missing_fields: string[];
  manual_review_required: boolean;
}

export function verifyLeadConsent(input: LeadConsentInput): LeadConsentResult {
  const missing_fields: string[] = [];

  if (input.consent_to_contact !== true) missing_fields.push("consent_to_contact");
  if (!input.consent_source) missing_fields.push("consent_source");
  if (!input.consent_timestamp) missing_fields.push("consent_timestamp");
  if (!input.submitted_by_partner_id) missing_fields.push("submitted_by_partner_id");

  return {
    valid: missing_fields.length === 0,
    missing_fields,
    manual_review_required: missing_fields.length > 0,
  };
}
