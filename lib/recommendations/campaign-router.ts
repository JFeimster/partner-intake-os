export type CampaignRecommendation = {
  campaign_id: string;
  campaign_name: string;
  campaign_type:
    | "referral_script"
    | "email_campaign"
    | "social_campaign"
    | "webinar_or_workshop"
    | "lead_magnet"
    | "partner_page"
    | "outbound_sequence"
    | "content_collab"
    | "community_activation";
  partner_type: string;
  target_audience?: string;
  offer_angle: string;
  cta: string;
  suggested_channels: string[];
  first_post_idea: string;
  first_email_idea: string;
  first_script_idea: string;
  lead_magnet: string;
  tracking_notes: string;
  compliance_guardrails: string[];
  status: "draft" | "recommended" | "active" | "paused" | "retired";
};

export function recommendCampaign(input: {
  partner_type: string;
  audience?: string;
  onboarding_path?: string;
  partner_tier?: string;
}) : CampaignRecommendation {
  const audience = input.audience || "small business owners";
  const partnerType = input.partner_type;

  const guardrails = [
    "Do not guarantee approvals.",
    "Do not guarantee funding amounts.",
    "Do not present credit repair claims.",
    "Do not imply everyone qualifies.",
    "Use readiness, options, and next-step language."
  ];

  if (partnerType === "funding_broker" || partnerType === "iso") {
    return {
      campaign_id: `cmp_${partnerType}_follow_up_gap`,
      campaign_name: "Dead Lead Revival Funding Readiness Push",
      campaign_type: "email_campaign",
      partner_type: partnerType,
      target_audience: audience,
      offer_angle: "Re-engage old funding conversations by offering a readiness review and cleaner next step.",
      cta: "Check funding readiness",
      suggested_channels: ["email", "sms_draft", "crm_task"],
      first_post_idea: "Most funding leads do not die. They rot in bad follow-up. Offer a readiness review to restart the conversation.",
      first_email_idea: "Subject angle: Still looking at funding options? Invite the prospect to update their business snapshot.",
      first_script_idea: "Use a short call opener: 'I’m checking whether anything changed with revenue, deposits, or timing since we last talked.'",
      lead_magnet: "Business funding readiness checklist",
      tracking_notes: "Use partner_id, campaign_id, source, and UTM parameters when tracking links exist.",
      compliance_guardrails: guardrails,
      status: "recommended"
    };
  }

  if (
    partnerType === "cpa_bookkeeper" ||
    partnerType === "small_business_attorney" ||
    partnerType === "business_broker"
  ) {
    return {
      campaign_id: `cmp_${partnerType}_warm_intro`,
      campaign_name: "Warm Referral Readiness Intro",
      campaign_type: "referral_script",
      partner_type: partnerType,
      target_audience: audience,
      offer_angle: "Help clients understand funding readiness before cash crunches become five-alarm fires.",
      cta: "Request a readiness review",
      suggested_channels: ["direct_email", "client_call", "newsletter"],
      first_post_idea: "Client advisory angle: funding conversations go smoother when the business has clean records and realistic expectations.",
      first_email_idea: "Soft intro from trusted advisor to Moonshine Capital for an educational funding-readiness conversation.",
      first_script_idea: "Phrase the intro as: 'This is not a guarantee of funding. It is a practical review of options and readiness.'",
      lead_magnet: "Business funding readiness checklist",
      tracking_notes: "Track source partner, referral context, and whether the intro came from a client advisory conversation.",
      compliance_guardrails: guardrails,
      status: "recommended"
    };
  }

  if (partnerType === "creator_affiliate") {
    return {
      campaign_id: "cmp_creator_affiliate_readiness",
      campaign_name: "Business Funding Readiness Content Kit",
      campaign_type: "social_campaign",
      partner_type: partnerType,
      target_audience: audience,
      offer_angle: "Turn funding confusion into a checklist-driven education funnel.",
      cta: "Grab the readiness checklist",
      suggested_channels: ["youtube", "newsletter", "linkedin", "x_twitter", "short_form_video"],
      first_post_idea: "Most business owners ask for funding too late. Here is what to clean up before you need the money.",
      first_email_idea: "Newsletter angle: the seven messy things that make funding conversations harder than they need to be.",
      first_script_idea: "Video opener: 'Funding is not magic. It is paperwork, timing, revenue, and not lying to yourself.'",
      lead_magnet: "Business funding readiness checklist",
      tracking_notes: "Use unique affiliate link and campaign slug before publishing.",
      compliance_guardrails: guardrails,
      status: "recommended"
    };
  }

  return {
    campaign_id: `cmp_${partnerType}_education_first`,
    campaign_name: "Education-First Partner Nurture",
    campaign_type: "lead_magnet",
    partner_type: partnerType,
    target_audience: audience,
    offer_angle: "Start with practical education before asking for referrals.",
    cta: "Review the partner resource pack",
    suggested_channels: ["email", "partner_dashboard", "manual_follow_up"],
    first_post_idea: "Explain common funding readiness gaps without making funding promises.",
    first_email_idea: "Send a short resource pack and ask who in their network typically needs capital planning help.",
    first_script_idea: "Use a discovery script focused on audience, trust, referral context, and risk.",
    lead_magnet: "Onboarding checklist",
    tracking_notes: "Track as nurture until audience, fit, and referral behavior are confirmed.",
    compliance_guardrails: guardrails,
    status: "draft"
  };
}
