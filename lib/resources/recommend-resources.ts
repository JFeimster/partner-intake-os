/**
 * Personalized resource recommender
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export interface ResourceInput {
  partner_type?: string;
  tier?: string;
  risk_level?: string;
  onboarding_path?: string;
  primary_audience?: string;
  campaign_channel?: string;
}

export interface RecommendedResource {
  resource_id: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  safe_notice: string;
}

const NOTICE = "Funding options may vary. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.";

export function recommendResources(input: ResourceInput): RecommendedResource[] {
  const type = input.partner_type ?? "referral_partner";
  const risk = input.risk_level ?? "medium";

  if (risk === "high" || risk === "blocked") {
    return [{
      resource_id: "compliance-review-pack",
      title: "Compliance Review Pack",
      reason: "Risk level requires manual review before promotional resources are assigned.",
      priority: "high",
      safe_notice: NOTICE
    }];
  }

  const map: Record<string, RecommendedResource[]> = {
    broker: [
      { resource_id: "lead-submission-kit", title: "Lead Submission Kit", reason: "Broker partners need structured intake and document expectations.", priority: "high", safe_notice: NOTICE },
      { resource_id: "funding-product-matrix", title: "Funding Product Matrix", reason: "Helps position options without promising outcomes.", priority: "medium", safe_notice: NOTICE }
    ],
    cpa_bookkeeper: [
      { resource_id: "client-readiness-kit", title: "Client Readiness Kit", reason: "CPA/bookkeeper partners can educate clients before referral.", priority: "high", safe_notice: NOTICE }
    ],
    affiliate: [
      { resource_id: "compliant-promo-kit", title: "Compliant Promo Kit", reason: "Affiliate partners need safe copy and tracking guidance.", priority: "high", safe_notice: NOTICE }
    ],
    attorney: [
      { resource_id: "intro-referral-kit", title: "Intro/Referral Kit", reason: "Attorney referrals should use clean handoff language.", priority: "high", safe_notice: NOTICE }
    ],
    veteran_connector: [
      { resource_id: "community-education-kit", title: "Community Education Kit", reason: "Veteran connectors benefit from workshop-style education assets.", priority: "high", safe_notice: NOTICE }
    ],
    strategic_partner: [
      { resource_id: "co-marketing-kit", title: "Co-Marketing Kit", reason: "Strategic partners need a scoped joint motion before public launch.", priority: "high", safe_notice: NOTICE }
    ]
  };

  return map[type] ?? [{
    resource_id: "standard-referral-pack",
    title: "Standard Referral Partner Pack",
    reason: "Default safe starter resource for partner education.",
    priority: "medium",
    safe_notice: NOTICE
  }];
}
