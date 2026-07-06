export type LeadRiskLevel = "low" | "medium" | "high";

export type LeadRiskResult = {
  risk_level: LeadRiskLevel;
  score: number;
  flags: string[];
  manual_review_required: boolean;
};

const GUARANTEE_TERMS = [
  "guaranteed approval",
  "guaranteed funding",
  "pre-approved",
  "preapproved",
  "everyone qualifies",
  "no one gets declined",
  "instant approval",
  "risk-free funding"
];

const SENSITIVE_TERMS = [
  "ssn",
  "social security",
  "bank login",
  "password",
  "routing number",
  "account number",
  "tax id",
  "drivers license",
  "driver's license",
  "private document"
];

const HIGH_RISK_INDUSTRIES = [
  "adult",
  "gambling",
  "marijuana",
  "cannabis",
  "crypto",
  "forex",
  "weapons",
  "firearms",
  "payday"
];

function includesAny(text: string, terms: string[]): string[] {
  const lower = text.toLowerCase();
  return terms.filter((term) => lower.includes(term));
}

export function assessLeadRisk(payload: Record<string, unknown>): LeadRiskResult {
  const serialized = JSON.stringify(payload || {}).toLowerCase();
  const flags: string[] = [];
  let score = 0;

  const guarantees = includesAny(serialized, GUARANTEE_TERMS);
  if (guarantees.length) {
    flags.push("restricted_or_guarantee_language_detected");
    score += 45;
  }

  const sensitive = includesAny(serialized, SENSITIVE_TERMS);
  if (sensitive.length) {
    flags.push("sensitive_data_detected");
    score += 55;
  }

  const industry = String(
    (payload.business && typeof payload.business === "object" && "industry" in payload.business
      ? (payload.business as Record<string, unknown>).industry
      : "") || ""
  ).toLowerCase();

  if (HIGH_RISK_INDUSTRIES.some((term) => industry.includes(term))) {
    flags.push("high_risk_or_restricted_industry_review");
    score += 30;
  }

  const funding = payload.funding && typeof payload.funding === "object"
    ? payload.funding as Record<string, unknown>
    : {};

  const requestedAmount = Number(funding.requested_amount_estimate || 0);
  if (requestedAmount >= 500000) {
    flags.push("large_requested_amount_review");
    score += 15;
  }

  const business = payload.business && typeof payload.business === "object"
    ? payload.business as Record<string, unknown>
    : {};
  const revenue = Number(business.monthly_revenue_estimate || 0);

  if (revenue > 0 && requestedAmount > 0 && requestedAmount > revenue * 12) {
    flags.push("requested_amount_exceeds_estimated_annual_revenue");
    score += 20;
  }

  if (score >= 60) {
    return {
      risk_level: "high",
      score,
      flags,
      manual_review_required: true
    };
  }

  if (score >= 25 || flags.length > 0) {
    return {
      risk_level: "medium",
      score,
      flags,
      manual_review_required: true
    };
  }

  return {
    risk_level: "low",
    score,
    flags,
    manual_review_required: true
  };
}
