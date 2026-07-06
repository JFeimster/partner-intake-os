export type PartnerTier = "tier_1" | "tier_2" | "tier_3" | "tier_4" | "reject_risk";

export type OnboardingPath =
  | "fast_track_revenue_partner"
  | "standard_affiliate_partner"
  | "referral_only_partner"
  | "education_first_partner"
  | "strategic_partner_review"
  | "nurture_watchlist"
  | "reject_manual_risk_review";

export function recommendPartnerTier(
  overallScore: number,
  complianceRiskScore: number,
  manualReviewRequired: boolean
): PartnerTier {
  if (complianceRiskScore >= 5) {
    return "reject_risk";
  }

  if (manualReviewRequired && complianceRiskScore >= 4) {
    return "reject_risk";
  }

  if (overallScore >= 82 && complianceRiskScore <= 2) {
    return "tier_1";
  }

  if (overallScore >= 65 && complianceRiskScore <= 3) {
    return "tier_2";
  }

  if (overallScore >= 45) {
    return "tier_3";
  }

  return "tier_4";
}

export function recommendOnboardingPath(
  partnerType: string,
  tier: PartnerTier,
  riskLevel: string
): OnboardingPath {
  if (tier === "reject_risk" || riskLevel === "critical") {
    return "reject_manual_risk_review";
  }

  if (tier === "tier_1" || partnerType === "strategic_partner" || partnerType === "fintech_vendor_partner") {
    return tier === "tier_1" ? "fast_track_revenue_partner" : "strategic_partner_review";
  }

  if (partnerType === "funding_broker" || partnerType === "iso") {
    return tier === "tier_2" ? "fast_track_revenue_partner" : "standard_affiliate_partner";
  }

  if (
    partnerType === "cpa_bookkeeper" ||
    partnerType === "small_business_attorney" ||
    partnerType === "business_broker" ||
    partnerType.includes("connector")
  ) {
    return tier === "tier_4" ? "education_first_partner" : "referral_only_partner";
  }

  if (partnerType === "creator_affiliate") {
    return "standard_affiliate_partner";
  }

  return tier === "tier_4" ? "nurture_watchlist" : "education_first_partner";
}

export function recommendNextAction(
  tier: PartnerTier,
  onboardingPath: OnboardingPath,
  manualReviewRequired: boolean
): string {
  if (tier === "reject_risk" || onboardingPath === "reject_manual_risk_review") {
    return "route_to_manual_risk_review_before_any_partner_activation";
  }

  if (manualReviewRequired) {
    return "request_missing_info_and_review_before_approval";
  }

  if (tier === "tier_1") {
    return "schedule_partner_strategy_call_and_prepare_fast_track_resource_pack";
  }

  if (tier === "tier_2") {
    return "send_welcome_packet_resource_pack_and_first_campaign_kit";
  }

  if (tier === "tier_3") {
    return "send_standard_onboarding_checklist_and_request_first_referral_context";
  }

  return "add_to_nurture_watchlist_and_send_education_first_resources";
}
