/**
 * Campaign kit generator
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export interface CampaignKitInput {
  partner_type?: string;
  tier?: string;
  risk_level?: string;
  onboarding_path?: string;
  primary_audience?: string;
  campaign_channel?: string;
}

export interface CampaignKit {
  campaign_id: string;
  title: string;
  audience: string;
  channel: string;
  cta: string;
  copy_angle: string;
  assets: string[];
  disclosure: string;
  manual_review_required: boolean;
}

const DISCLOSURE = "Funding options may vary. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.";

export function generateCampaignKit(input: CampaignKitInput): CampaignKit {
  const type = input.partner_type ?? "referral_partner";
  const channel = input.campaign_channel ?? "email";
  const audience = input.primary_audience ?? "small business owners";
  const highRisk = input.risk_level === "high" || input.risk_level === "blocked";

  if (highRisk) {
    return {
      campaign_id: "manual-review-required",
      title: "Manual Review Required Before Campaign Assignment",
      audience,
      channel,
      cta: "Request partner review",
      copy_angle: "Pause promotional activity until compliance review clears messaging.",
      assets: ["Compliance review checklist", "Safe language library"],
      disclosure: DISCLOSURE,
      manual_review_required: true
    };
  }

  const kits: Record<string, Partial<CampaignKit>> = {
    broker: { campaign_id: "broker-lead-submission-kit", title: "Broker Lead Submission Kit", cta: "Submit a client for review", copy_angle: "Organize business funding conversations into review-ready intake.", assets: ["Lead intake checklist", "Missing docs checklist", "CRM follow-up prompts"] },
    cpa_bookkeeper: { campaign_id: "cpa-client-readiness-kit", title: "Client Readiness Kit", cta: "Check funding readiness", copy_angle: "Help clients identify cash-flow readiness gaps early.", assets: ["Cash-flow gap checklist", "Client email blurb"] },
    affiliate: { campaign_id: "affiliate-compliant-promo-kit", title: "Compliant Promo Kit", cta: "Request funding options review", copy_angle: "Educational content for business owners exploring capital options.", assets: ["Social captions", "Newsletter blurb", "Tracking link guide"] },
    attorney: { campaign_id: "attorney-intro-referral-kit", title: "Intro/Referral Kit", cta: "Request partner access", copy_angle: "Clean referral handoff for business clients considering capital options.", assets: ["Intro email", "Referral notes checklist"] },
    veteran_connector: { campaign_id: "veteran-community-education-kit", title: "Community Education Kit", cta: "Apply to become a partner", copy_angle: "Practical funding readiness education for veteran-owned businesses.", assets: ["Workshop outline", "Community email"] },
    strategic_partner: { campaign_id: "strategic-co-marketing-kit", title: "Co-Marketing Kit", cta: "Request strategic partner review", copy_angle: "Co-marketed readiness workflow for aligned SMB audiences.", assets: ["Webinar outline", "Partner landing-page copy", "Workflow map"] }
  };

  const selected = kits[type] ?? { campaign_id: "standard-referral-kit", title: "Standard Referral Kit", cta: "Request partner access", copy_angle: "Education-first referral path.", assets: ["Referral script", "Readiness checklist"] };

  return {
    campaign_id: selected.campaign_id!,
    title: selected.title!,
    audience,
    channel,
    cta: selected.cta!,
    copy_angle: selected.copy_angle!,
    assets: selected.assets!,
    disclosure: DISCLOSURE,
    manual_review_required: input.tier === "tier_1_review"
  };
}
