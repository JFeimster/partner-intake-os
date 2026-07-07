/**
 * Explainable partner scoring
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import { scoreRisk } from "./risk-score";
import { getTierForScore } from "./tier-rules";

export interface PartnerScoringInput {
  partner_type?: string;
  primary_audience?: string;
  referral_volume_estimate?: string | number;
  funding_experience?: string;
  existing_trust?: string;
  tools?: string[];
  strategic_notes?: string;
  notes?: string;
}

export interface PartnerScoreResult {
  overall_score: number;
  recommended_tier: string;
  risk_level: string;
  manual_review_required: boolean;
  breakdown: Record<string, number>;
  why_this_score: string;
  risk_flags: unknown[];
}

function clampScore(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function textIncludes(input: PartnerScoringInput, terms: string[]): boolean {
  const text = JSON.stringify(input).toLowerCase();
  return terms.some((term) => text.includes(term));
}

export function scorePartner(input: PartnerScoringInput): PartnerScoreResult {
  const risk = scoreRisk(JSON.stringify(input));

  const audience_fit = textIncludes(input, ["smb", "business owner", "contractor", "ecommerce", "real estate", "veteran", "franchise"]) ? 85 : 45;
  const trust_leverage = textIncludes(input, ["cpa", "bookkeeper", "attorney", "advisor", "community", "newsletter"]) ? 80 : 50;
  const deal_flow_signal = typeof input.referral_volume_estimate === "number"
    ? Math.min(100, input.referral_volume_estimate * 12)
    : textIncludes(input, ["weekly", "monthly", "pipeline", "clients"]) ? 75 : 45;
  const activation_speed = textIncludes(input, ["crm", "email list", "automation", "hubspot", "gohighlevel"]) ? 80 : 55;
  const strategic_value = textIncludes(input, ["co-marketing", "api", "platform", "vendor", "embedded"]) ? 90 : 50;
  const operational_readiness = Array.isArray(input.tools) && input.tools.length > 0 ? 75 : 45;
  const compliance_posture = risk.risk_level === "low" ? 90 : risk.risk_level === "medium" ? 55 : 15;

  const breakdown = {
    audience_fit,
    trust_leverage,
    deal_flow_signal,
    activation_speed,
    strategic_value,
    operational_readiness,
    compliance_posture
  };

  const weighted =
    audience_fit * 0.2 +
    trust_leverage * 0.15 +
    deal_flow_signal * 0.2 +
    activation_speed * 0.1 +
    strategic_value * 0.15 +
    operational_readiness * 0.1 +
    compliance_posture * 0.1;

  const overall_score = risk.risk_level === "blocked" ? 0 : clampScore(weighted);
  const recommended_tier = risk.risk_level === "high" || risk.risk_level === "blocked"
    ? "reject_or_risk_review"
    : getTierForScore(overall_score);

  const why_this_score = [
    `Audience fit scored ${audience_fit}/100.`,
    `Deal-flow signal scored ${deal_flow_signal}/100.`,
    `Compliance posture scored ${compliance_posture}/100.`,
    risk.manual_review_required ? "Manual review required due to risk flags." : "No major restricted-language flags found."
  ].join(" ");

  return {
    overall_score,
    recommended_tier,
    risk_level: risk.risk_level,
    manual_review_required: risk.manual_review_required || recommended_tier === "tier_1_review",
    breakdown,
    why_this_score,
    risk_flags: risk.flags
  };
}
