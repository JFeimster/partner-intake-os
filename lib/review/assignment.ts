export type AssignableRole = "owner" | "admin" | "reviewer" | "read_only" | "integration_service";

export interface AssignmentInput {
  risk_level?: "low" | "medium" | "high" | "unknown";
  partner_tier?: string | null;
  reason_codes?: string[];
  entity_type?: string;
  preferred_reviewer_id?: string | null;
}

export interface AssignmentResult {
  assigned_role: AssignableRole;
  assigned_to_user_id: string | null;
  escalation_level: "L1" | "L2" | "L3" | "L4";
  reason: string;
}

export function assignReviewItem(input: AssignmentInput): AssignmentResult {
  const reasons = input.reason_codes ?? [];

  if (reasons.includes("security_abuse") || reasons.includes("webhook_fraud")) {
    return {
      assigned_role: "integration_service",
      assigned_to_user_id: null,
      escalation_level: "L4",
      reason: "Security or abuse signal requires technical review.",
    };
  }

  if (input.risk_level === "high" || reasons.includes("compliance_language_risk") || reasons.includes("sensitive_data_flagged")) {
    return {
      assigned_role: "admin",
      assigned_to_user_id: null,
      escalation_level: "L3",
      reason: "High-risk or compliance-sensitive review.",
    };
  }

  if (input.partner_tier === "tier_1" || input.entity_type === "strategic_partner") {
    return {
      assigned_role: "owner",
      assigned_to_user_id: null,
      escalation_level: "L3",
      reason: "Potential strategic or Tier 1 partner review.",
    };
  }

  if (reasons.includes("duplicate_detected") || reasons.includes("low_info_intake")) {
    return {
      assigned_role: "reviewer",
      assigned_to_user_id: input.preferred_reviewer_id ?? null,
      escalation_level: "L2",
      reason: "Routine duplicate or missing-information review.",
    };
  }

  return {
    assigned_role: "reviewer",
    assigned_to_user_id: input.preferred_reviewer_id ?? null,
    escalation_level: "L1",
    reason: "Standard review queue assignment.",
  };
}

export function shouldEscalate(createdAtIso: string, status: string, now = new Date()): boolean {
  const created = new Date(createdAtIso).getTime();
  if (!created) return false;
  const ageHours = (now.getTime() - created) / 36e5;
  if (status === "new" && ageHours >= 24) return true;
  if (status === "needs_review" && ageHours >= 48) return true;
  return false;
}
