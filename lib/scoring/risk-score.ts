/**
 * Explainable risk scoring
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export type RiskLevel = "low" | "medium" | "high" | "blocked";

export interface RiskScanResult {
  risk_level: RiskLevel;
  risk_score: number;
  flags: Array<{ id: string; severity: "low" | "medium" | "high" | "blocked"; phrase?: string; reason: string }>;
  manual_review_required: boolean;
}

const RISK_PATTERNS = [
  { id: "guarantee_language", severity: "high" as const, phrases: ["guaranteed approval", "everyone qualifies", "instant funding"], reason: "Potential approval or funding certainty language." },
  { id: "lead_seller", severity: "high" as const, phrases: ["aged leads", "bulk leads", "guaranteed exclusive leads"], reason: "Lead source quality and consent risk." },
  { id: "credit_repair", severity: "blocked" as const, phrases: ["credit repair", "delete tradelines", "remove collections"], reason: "Credit repair positioning is outside approved framing." }
];

export function scoreRisk(text: string): RiskScanResult {
  const lower = text.toLowerCase();
  const flags = RISK_PATTERNS.flatMap((pattern) =>
    pattern.phrases
      .filter((phrase) => lower.includes(phrase))
      .map((phrase) => ({ id: pattern.id, severity: pattern.severity, phrase, reason: pattern.reason }))
  );

  if (flags.some((flag) => flag.severity === "blocked")) {
    return { risk_level: "blocked", risk_score: 100, flags, manual_review_required: true };
  }
  if (flags.some((flag) => flag.severity === "high")) {
    return { risk_level: "high", risk_score: 80, flags, manual_review_required: true };
  }
  if (flags.length > 0) {
    return { risk_level: "medium", risk_score: 45, flags, manual_review_required: true };
  }
  return { risk_level: "low", risk_score: 10, flags, manual_review_required: false };
}
