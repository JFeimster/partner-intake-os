import type { PartnerIntake } from "../normalizers/normalize-tally-submission";
import { collectRiskFlags, determineRiskLevel, estimateComplianceRiskScore } from "./risk-score";
import {
  recommendOnboardingPath,
  recommendPartnerTier,
  recommendNextAction
} from "./partner-tier";

export type PartnerType =
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
  | "unqualified_not_fit";

export type Scorecard = {
  audience_access_score: number;
  funding_relevance_score: number;
  existing_trust_score: number;
  existing_deal_flow_score: number;
  activation_speed_score: number;
  compliance_risk_score: number;
  strategic_leverage_score: number;
  revenue_potential_score: number;
  technical_ability_score: number;
  relationship_quality_score: number;
  overall_score: number;
  tier_recommendation: string;
  risk_level: string;
  manual_review_required: boolean;
  reasoning_summary: string;
  risk_flags: string[];
  missing_info: string[];
};

function textOf(intake: PartnerIntake): string {
  return [
    intake.partner_type_claimed,
    intake.audience,
    intake.industry,
    intake.funding_experience,
    intake.current_tools?.join(" "),
    intake.traffic_or_network_size,
    intake.referral_volume_estimate,
    intake.desired_partner_role,
    intake.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function hasAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(5, Math.round(score)));
}

function scoreFromSignals(text: string, strongSignals: string[], mediumSignals: string[], defaultScore = 2): number {
  let score = defaultScore;
  if (hasAny(text, mediumSignals)) score += 1;
  if (hasAny(text, strongSignals)) score += 2;
  return clampScore(score);
}

function missingInfo(intake: PartnerIntake): string[] {
  const missing: string[] = [];

  if (!intake.email) missing.push("email");
  if (!intake.first_name && !intake.last_name) missing.push("contact_name");
  if (!intake.company) missing.push("company");
  if (!intake.audience) missing.push("audience");
  if (!intake.referral_volume_estimate) missing.push("referral_volume_estimate");
  if (!intake.desired_partner_role) missing.push("desired_partner_role");

  return missing;
}

export function inferPartnerType(intake: PartnerIntake): PartnerType {
  const claimed = intake.partner_type_claimed;
  const text = textOf(intake);

  const directTypes: PartnerType[] = [
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
    "strategic_partner"
  ];

  if (claimed && directTypes.includes(claimed as PartnerType)) {
    return claimed as PartnerType;
  }

  if (hasAny(text, ["funding broker", "loan broker", "mca", "iso"])) return "funding_broker";
  if (hasAny(text, ["cpa", "bookkeeper", "accounting", "tax clients"])) return "cpa_bookkeeper";
  if (hasAny(text, ["attorney", "law firm", "legal clients"])) return "small_business_attorney";
  if (hasAny(text, ["business broker", "buy side", "sell side", "acquisition"])) return "business_broker";
  if (hasAny(text, ["real estate investor", "fix and flip", "landlord"])) return "real_estate_investor_connector";
  if (hasAny(text, ["contractor", "trades", "roofing", "hvac", "construction"])) return "contractor_trades_connector";
  if (hasAny(text, ["franchise"])) return "franchise_consultant";
  if (hasAny(text, ["veteran", "military", "service member"])) return "veteran_community_connector";
  if (hasAny(text, ["creator", "newsletter", "youtube", "podcast", "affiliate"])) return "creator_affiliate";
  if (hasAny(text, ["fintech", "saas", "vendor", "platform", "api"])) return "fintech_vendor_partner";
  if (hasAny(text, ["strategic", "channel partner", "joint venture"])) return "strategic_partner";

  return "unqualified_not_fit";
}

export function scorePartnerIntake(intake: PartnerIntake) {
  const text = textOf(intake);
  const partnerType = inferPartnerType(intake);
  const riskFlags = collectRiskFlags(intake);
  const complianceRiskScore = estimateComplianceRiskScore(intake);
  const missing = missingInfo(intake);

  const audienceAccessScore = scoreFromSignals(
    text,
    ["10,000", "large audience", "active community", "client base", "portfolio", "network"],
    ["newsletter", "youtube", "clients", "members", "referrals", "community"]
  );

  const fundingRelevanceScore = scoreFromSignals(
    text,
    ["business funding", "working capital", "mca", "line of credit", "equipment financing"],
    ["cash flow", "contractors", "real estate", "ecommerce", "franchise", "acquisition"]
  );

  const existingTrustScore = scoreFromSignals(
    text,
    ["trusted advisor", "existing clients", "long-term clients", "portfolio companies"],
    ["clients", "members", "community", "network"],
    partnerType === "unqualified_not_fit" ? 1 : 2
  );

  const existingDealFlowScore = scoreFromSignals(
    text,
    ["10 per month", "weekly referrals", "monthly referral volume", "deal flow"],
    ["referrals", "funding deals", "applications", "introductions"]
  );

  const activationSpeedScore = scoreFromSignals(
    text,
    ["crm", "hubspot", "gohighlevel", "zapier", "n8n", "activepieces", "email list"],
    ["website", "newsletter", "social", "forms", "calendar"]
  );

  const strategicLeverageScore = scoreFromSignals(
    text,
    ["strategic partner", "platform", "api", "marketplace", "channel partner"],
    ["community", "network", "podcast", "newsletter", "vendor"]
  );

  const revenuePotentialScore = scoreFromSignals(
    text,
    ["high volume", "monthly referrals", "portfolio", "existing deal flow"],
    ["referral", "clients", "audience", "contractors", "business owners"]
  );

  const technicalAbilityScore = scoreFromSignals(
    text,
    ["api", "automation", "hubspot", "notion", "crm", "n8n", "activepieces"],
    ["website", "form", "email", "spreadsheet"]
  );

  const relationshipQualityScore = scoreFromSignals(
    text,
    ["warm intro", "trusted advisor", "existing relationship", "clients trust us"],
    ["referral", "community", "members", "clients"]
  );

  const positiveScore =
    audienceAccessScore +
    fundingRelevanceScore +
    existingTrustScore +
    existingDealFlowScore +
    activationSpeedScore +
    strategicLeverageScore +
    revenuePotentialScore +
    technicalAbilityScore +
    relationshipQualityScore;

  const maxPositive = 45;
  const riskPenalty = complianceRiskScore * 6;
  const missingPenalty = Math.min(12, missing.length * 2);
  const overallScore = Math.max(0, Math.min(100, Math.round((positiveScore / maxPositive) * 100 - riskPenalty - missingPenalty + 8)));

  const manualReviewRequired =
    complianceRiskScore >= 4 ||
    riskFlags.length > 0 ||
    missing.includes("email") ||
    partnerType === "unqualified_not_fit";

  const riskLevel = determineRiskLevel(complianceRiskScore, riskFlags);
  const tier = recommendPartnerTier(overallScore, complianceRiskScore, manualReviewRequired);
  const onboardingPath = recommendOnboardingPath(partnerType, tier, riskLevel);
  const nextAction = recommendNextAction(tier, onboardingPath, manualReviewRequired);

  const scorecard: Scorecard = {
    audience_access_score: audienceAccessScore,
    funding_relevance_score: fundingRelevanceScore,
    existing_trust_score: existingTrustScore,
    existing_deal_flow_score: existingDealFlowScore,
    activation_speed_score: activationSpeedScore,
    compliance_risk_score: complianceRiskScore,
    strategic_leverage_score: strategicLeverageScore,
    revenue_potential_score: revenuePotentialScore,
    technical_ability_score: technicalAbilityScore,
    relationship_quality_score: relationshipQualityScore,
    overall_score: overallScore,
    tier_recommendation: tier,
    risk_level: riskLevel,
    manual_review_required: manualReviewRequired,
    reasoning_summary: `Classified as ${partnerType} with ${overallScore}/100 overall score. Compliance risk is ${complianceRiskScore}/5, where higher means more risk.`,
    risk_flags: riskFlags,
    missing_info: missing
  };

  return {
    partner_type: partnerType,
    partner_tier: tier,
    onboarding_path: onboardingPath,
    risk_level: riskLevel,
    scorecard,
    next_action: nextAction
  };
}
