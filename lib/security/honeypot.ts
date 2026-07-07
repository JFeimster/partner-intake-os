export const HONEYPOT_FIELDS = [
  "website_url",
  "company_website_extra",
  "fax_number",
  "middle_name_confirm",
  "confirm_email_hidden",
];

export interface HoneypotResult {
  passed: boolean;
  filled_fields: string[];
}

export function checkHoneypot(payload: Record<string, unknown>): HoneypotResult {
  const filled_fields = HONEYPOT_FIELDS.filter((field) => {
    const value = payload[field];
    return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
  });

  return {
    passed: filled_fields.length === 0,
    filled_fields,
  };
}
