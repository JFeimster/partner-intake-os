export type ResourceRecommendation = {
  recommendation_id: string;
  partner_type: string;
  audience?: string;
  onboarding_path?: string;
  recommended_resource: string;
  resource_type: string;
  resource_url?: string;
  reason: string;
  cta: string;
  priority: "low" | "medium" | "high" | "urgent";
  compliance_safe_positioning: string;
  internal_note?: string;
};

function baseResource(
  partnerType: string,
  audience: string | undefined,
  onboardingPath: string | undefined,
  index: number,
  recommendedResource: string,
  resourceType: string,
  reason: string,
  cta: string,
  priority: ResourceRecommendation["priority"] = "medium",
  internalNote?: string
): ResourceRecommendation {
  return {
    recommendation_id: `res_${partnerType}_${index}`,
    partner_type: partnerType,
    audience,
    onboarding_path: onboardingPath,
    recommended_resource: recommendedResource,
    resource_type: resourceType,
    reason,
    cta,
    priority,
    compliance_safe_positioning:
      "Position as educational funding readiness, partner enablement, and operational guidance. Do not promise approvals, funding amounts, credit outcomes, or lender certainty.",
    internal_note: internalNote
  };
}

export function recommendResources(input: {
  partner_type: string;
  audience?: string;
  onboarding_path?: string;
  risk_level?: string;
}): ResourceRecommendation[] {
  const { partner_type, audience, onboarding_path, risk_level } = input;
  const recommendations: ResourceRecommendation[] = [];

  if (risk_level === "critical") {
    return [
      baseResource(
        partner_type,
        audience,
        onboarding_path,
        1,
        "Compliance guardrails",
        "internal_review",
        "High-risk language or behavior was detected. Human review comes before resource access.",
        "Route to admin review",
        "urgent",
        "Do not activate partner until reviewed."
      )
    ];
  }

  if (partner_type === "funding_broker" || partner_type === "iso") {
    recommendations.push(
      baseResource(partner_type, audience, onboarding_path, 1, "Funding Product Matrix", "matrix", "Broker/ISO partners need product-fit clarity before routing deals.", "Review product fit", "high"),
      baseResource(partner_type, audience, onboarding_path, 2, "Broker Follow-Up Machine", "gpt_tool", "Follow-up speed and consistency are usually the money leak.", "Install follow-up workflow", "high"),
      baseResource(partner_type, audience, onboarding_path, 3, "Lead submission guidance", "operating_guide", "Standardizes intake quality before partner volume scales.", "Submit first clean lead", "medium")
    );
  } else if (
    partner_type === "cpa_bookkeeper" ||
    partner_type === "small_business_attorney" ||
    partner_type === "business_broker"
  ) {
    recommendations.push(
      baseResource(partner_type, audience, onboarding_path, 1, "Business funding readiness checklist", "checklist", "Professional referral partners need safe client-facing readiness language.", "Use readiness checklist", "high"),
      baseResource(partner_type, audience, onboarding_path, 2, "Referral partner scripts", "script_pack", "Gives them compliant language for warm introductions.", "Send warm intro script", "high"),
      baseResource(partner_type, audience, onboarding_path, 3, "Funding Product Matrix", "matrix", "Helps the partner understand where a referral may fit without making approval claims.", "Review funding options", "medium")
    );
  } else if (partner_type === "creator_affiliate") {
    recommendations.push(
      baseResource(partner_type, audience, onboarding_path, 1, "Campaign kits", "campaign_pack", "Creators need ready-to-publish angles and tracking discipline.", "Launch first campaign", "high"),
      baseResource(partner_type, audience, onboarding_path, 2, "Partner Command Center", "dashboard", "Gives the creator a central hub for resources, links, and next steps.", "Open partner dashboard", "medium"),
      baseResource(partner_type, audience, onboarding_path, 3, "Business funding readiness checklist", "lead_magnet", "A safer front-end offer than hard funding promises.", "Promote checklist", "medium")
    );
  } else if (partner_type === "strategic_partner" || partner_type === "fintech_vendor_partner") {
    recommendations.push(
      baseResource(partner_type, audience, onboarding_path, 1, "Partner Command Center", "dashboard", "Strategic partners need shared operating context and integration path visibility.", "Prepare partner review", "high"),
      baseResource(partner_type, audience, onboarding_path, 2, "Onboarding checklist", "checklist", "Keeps the relationship from becoming a handshake-powered fog machine.", "Create joint onboarding plan", "high"),
      baseResource(partner_type, audience, onboarding_path, 3, "Campaign kits", "campaign_pack", "Useful for co-marketing once risk and fit are reviewed.", "Draft co-marketing test", "medium")
    );
  } else {
    recommendations.push(
      baseResource(partner_type, audience, onboarding_path, 1, "Business funding readiness checklist", "checklist", "Low-context partners should start with education before activation.", "Send education-first resource", "medium"),
      baseResource(partner_type, audience, onboarding_path, 2, "Onboarding checklist", "checklist", "Collect missing data and confirm fit before any revenue workflow.", "Complete profile", "medium")
    );
  }

  return recommendations;
}
