export interface LeadRoutingInput {
  duplicate_result?: string;
  consent_valid?: boolean;
  sensitive_data_flagged?: boolean;
  partner_tier?: string;
  lead_value_signal?: "low" | "medium" | "high" | "unknown";
}

export interface LeadRoutingResult {
  status: "received_for_review" | "manual_review_required" | "needs_info" | "accepted_for_processing" | "paused";
  assigned_role: "reviewer" | "admin" | "owner";
  reason_codes: string[];
}

export function routeLeadSubmission(input: LeadRoutingInput): LeadRoutingResult {
  const reason_codes: string[] = [];

  if (input.sensitive_data_flagged) {
    return {
      status: "manual_review_required",
      assigned_role: "admin",
      reason_codes: ["sensitive_data_flagged"],
    };
  }

  if (!input.consent_valid) reason_codes.push("consent_missing");
  if (input.duplicate_result && input.duplicate_result !== "none") reason_codes.push("duplicate_review");

  if (reason_codes.length) {
    return {
      status: "manual_review_required",
      assigned_role: input.duplicate_result === "confirmed_duplicate" ? "admin" : "reviewer",
      reason_codes,
    };
  }

  if (input.partner_tier === "tier_1" || input.lead_value_signal === "high") {
    return {
      status: "received_for_review",
      assigned_role: "admin",
      reason_codes: ["high_value_review"],
    };
  }

  return {
    status: "received_for_review",
    assigned_role: "reviewer",
    reason_codes: ["standard_review"],
  };
}

export function detectSensitiveLeadData(payload: Record<string, unknown>): string[] {
  const text = JSON.stringify(payload).toLowerCase();
  const flags: string[] = [];
  if (text.includes("ssn") || text.match(/\b\d{3}-\d{2}-\d{4}\b/)) flags.push("ssn_like_value");
  if (text.includes("bank statement")) flags.push("bank_statement_reference");
  if (text.includes("password") || text.includes("login")) flags.push("credential_reference");
  if (text.includes("tax return")) flags.push("tax_document_reference");
  return flags;
}
