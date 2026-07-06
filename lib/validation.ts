import { ApiError } from "./errors";

export type PartnerIntake = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  partner_type_claimed?: string;
  audience?: string;
  industry?: string;
  location?: string;
  funding_experience?: string;
  current_tools?: string;
  traffic_or_network_size?: string;
  referral_volume_estimate?: string | number;
  desired_partner_role?: string;
  notes?: string;
  source?: string;
  submitted_at?: string;
  [key: string]: unknown;
};

export type PartnerClassification = {
  partner_profile: Record<string, unknown>;
  scorecard: Record<string, unknown>;
  tier: "tier_1" | "tier_2" | "tier_3" | "tier_4" | "reject";
  onboarding_path: string;
  risk_flags: string[];
  manual_review_required: boolean;
  next_action: string;
};

const SAFE_COMPLIANCE_MESSAGE =
  "Operational review only. No approval, funding, rates, terms, timeline, lender review, commission, income, or business outcome is guaranteed.";

const HIGH_RISK_TERMS = [
  "guaranteed approval",
  "guaranteed funding",
  "everyone qualifies",
  "no-doc guaranteed",
  "credit repair",
  "bypass underwriting",
  "fake bank statements",
  "lead dump",
  "aged tradeline",
  "cpn",
  "synthetic identity"
];

const SENSITIVE_TERMS = [
  "ssn",
  "social security",
  "bank login",
  "password",
  "routing number",
  "account number",
  "tax id",
  "full ein",
  "driver license",
  "passport"
];

function text(value: unknown): string {
  return String(value ?? "").trim();
}

function joinedText(input: unknown): string {
  return JSON.stringify(input ?? {}).toLowerCase();
}

export function asObject(value: unknown, label = "payload"): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiError(400, "VALIDATION_ERROR", `${label} must be a JSON object.`, { fields: [label] });
  }

  return value as Record<string, unknown>;
}

export function getIntakeFromPayload(payload: unknown): PartnerIntake {
  const obj = asObject(payload);
  const intake = (obj.intake && typeof obj.intake === "object" && !Array.isArray(obj.intake))
    ? obj.intake
    : obj;

  return sanitizeIntake(intake as Record<string, unknown>);
}

export function sanitizeIntake(input: Record<string, unknown>): PartnerIntake {
  const output: PartnerIntake = {};

  for (const [key, value] of Object.entries(input)) {
    if (value == null) continue;
    if (typeof value === "string") output[key] = value.trim().slice(0, 1200);
    else output[key] = value;
  }

  return output;
}

export function validateIntake(intake: PartnerIntake, options: { allowLowInfo?: boolean } = {}): void {
  const fields: string[] = [];

  if (!options.allowLowInfo) {
    if (!text(intake.email)) fields.push("email");
    if (!text(intake.company) && !text(intake.first_name) && !text(intake.last_name)) {
      fields.push("company_or_name");
    }
  }

  if (intake.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text(intake.email))) {
    fields.push("email");
  }

  if (fields.length) {
    throw new ApiError(400, "VALIDATION_ERROR", "Partner intake is missing required fields or has invalid values.", { fields });
  }
}

export function detectRiskFlags(payload: unknown): string[] {
  const body = joinedText(payload);
  const flags: string[] = [];

  for (const term of HIGH_RISK_TERMS) {
    if (body.includes(term)) flags.push(`restricted_language:${term}`);
  }

  for (const term of SENSITIVE_TERMS) {
    if (body.includes(term)) flags.push(`sensitive_data:${term}`);
  }

  const volume = body.match(/(\d+)\s*(leads|submissions|apps|applications)/);
  if (volume && Number(volume[1]) > 250) {
    flags.push("unverified_high_volume_claim");
  }

  return [...new Set(flags)];
}

function hasAny(body: string, terms: string[]): boolean {
  return terms.some((term) => body.includes(term));
}

export function inferPartnerType(intake: PartnerIntake): string {
  const body = joinedText(intake);

  if (hasAny(body, ["cpa", "bookkeeper", "accountant", "tax advisor"])) return "cpa_bookkeeper";
  if (hasAny(body, ["attorney", "law firm", "lawyer", "legal"])) return "business_attorney";
  if (hasAny(body, ["business broker", "m&a", "acquisition"])) return "business_broker";
  if (hasAny(body, ["veteran", "military", "nonprofit", "community"])) return "veteran_community_connector";
  if (hasAny(body, ["creator", "influencer", "newsletter", "youtube", "podcast", "affiliate"])) return "creator_affiliate";
  if (hasAny(body, ["fintech", "saas", "platform", "vendor", "api"])) return "fintech_vendor_partner";
  if (hasAny(body, ["broker", "iso", "funding advisor", "loan broker", "lending broker"])) return "funding_broker";
  if (hasAny(body, ["referral", "consultant", "advisor", "connector", "center of influence", "coi"])) return "referral_partner";

  return text(intake.partner_type_claimed) || "unclassified_partner";
}

export function inferAudience(intake: PartnerIntake): string {
  const body = joinedText(intake);

  if (hasAny(body, ["contractor", "trades", "roofing", "hvac", "construction"])) return "contractors_trades";
  if (hasAny(body, ["ecommerce", "shopify", "amazon seller", "etsy"])) return "ecommerce_sellers";
  if (hasAny(body, ["real estate", "investor", "fix and flip", "landlord"])) return "real_estate_investors";
  if (hasAny(body, ["veteran", "military"])) return "veterans";
  if (hasAny(body, ["restaurant", "retail", "main street", "local business"])) return "main_street_smb";
  if (hasAny(body, ["broker", "iso", "funding advisor"])) return "funding_brokers";

  return text(intake.audience) || "general_smb";
}

export function classifyPartner(intake: PartnerIntake): PartnerClassification {
  validateIntake(intake, { allowLowInfo: true });

  const partnerType = inferPartnerType(intake);
  const audience = inferAudience(intake);
  const riskFlags = detectRiskFlags(intake);
  const body = joinedText(intake);

  const scores = {
    urgency_score: hasAny(body, ["ready", "this week", "now", "urgent", "launch"]) ? 8 : 5,
    audience_fit_score: audience === "general_smb" ? 5 : 8,
    trust_score: hasAny(body, ["existing clients", "book of business", "community", "network", "portfolio"]) ? 8 : 5,
    revenue_potential_score: hasAny(body, ["monthly referrals", "deal flow", "pipeline", "clients"]) ? 8 : 5,
    activation_speed_score: hasAny(body, ["crm", "automation", "email list", "newsletter", "website"]) ? 8 : 5,
    compliance_risk_score: riskFlags.length ? 8 : 2,
    strategic_value_score: hasAny(body, ["platform", "api", "fintech", "association", "community", "franchise"]) ? 8 : 5
  };

  const positiveScore =
    scores.urgency_score +
    scores.audience_fit_score +
    scores.trust_score +
    scores.revenue_potential_score +
    scores.activation_speed_score +
    scores.strategic_value_score -
    scores.compliance_risk_score;

  const overallScore = Math.max(0, Math.min(100, Math.round((positiveScore / 45) * 100)));

  let tier: PartnerClassification["tier"] = "tier_3";
  let onboardingPath = "standard_affiliate_partner";
  let nextAction = "send_welcome_resources_and_request_missing_context";

  if (riskFlags.length >= 2 || hasAny(body, ["lead seller", "data broker", "aged lead", "scraped"])) {
    tier = "reject";
    onboardingPath = "reject_manual_risk_review";
    nextAction = "manual_review_before_any_partner_activation";
  } else if (overallScore >= 82) {
    tier = "tier_1";
    onboardingPath = "strategic_partner_review";
    nextAction = "schedule_operator_review_and_prepare_custom_campaign_plan";
  } else if (overallScore >= 68) {
    tier = "tier_2";
    onboardingPath = "fast_track_revenue_partner";
    nextAction = "send_welcome_pack_and_campaign_starter";
  } else if (overallScore < 45) {
    tier = "tier_4";
    onboardingPath = "nurture_watchlist";
    nextAction = "request_more_context_before_activation";
  }

  const displayName = [intake.first_name, intake.last_name].map(text).filter(Boolean).join(" ") || text(intake.company) || "Unknown Partner";

  return {
    partner_profile: {
      partner_id: `partner_${Date.now().toString(36)}`,
      display_name: displayName,
      company: text(intake.company),
      email: text(intake.email),
      partner_type: partnerType,
      partner_tier: tier,
      onboarding_path: onboardingPath,
      primary_audience: audience,
      risk_level: riskFlags.length ? "high" : overallScore >= 68 ? "low" : "medium",
      status: tier === "reject" ? "manual_risk_review" : "new_review",
      tags: [partnerType, tier, onboardingPath, audience],
      created_at: new Date().toISOString(),
      compliance_message: SAFE_COMPLIANCE_MESSAGE
    },
    scorecard: {
      ...scores,
      overall_score: overallScore,
      tier_recommendation: tier,
      reasoning_summary: "Rule-based MVP classification. Use human review before activation, CRM writes, or partner-facing decisions.",
      manual_review_required: riskFlags.length > 0 || tier === "tier_1" || tier === "reject"
    },
    tier,
    onboarding_path: onboardingPath,
    risk_flags: riskFlags,
    manual_review_required: riskFlags.length > 0 || tier === "tier_1" || tier === "reject",
    next_action: nextAction
  };
}

export function recommendResources(partnerType: string, audience: string): Record<string, unknown>[] {
  const base = [
    {
      title: "Partner Welcome Pack",
      resource_type: "onboarding",
      priority: "high",
      reason: "Baseline orientation and operating expectations for any new partner.",
      cta: "Review before first referral."
    },
    {
      title: "Funding Readiness Checklist",
      resource_type: "lead_magnet",
      priority: "high",
      reason: "Gives partners a safe way to educate business owners without making funding promises.",
      cta: "Use as a first conversation tool."
    }
  ];

  const typeSpecific: Record<string, Record<string, unknown>[]> = {
    funding_broker: [
      { title: "Broker Follow-Up Machine", resource_type: "workflow", priority: "high", reason: "Improves stalled deal follow-up and document collection.", cta: "Use for active pipeline cleanup." }
    ],
    cpa_bookkeeper: [
      { title: "Cash Flow Gap Client Script", resource_type: "script", priority: "high", reason: "Helps introduce funding readiness without giving lending advice.", cta: "Use during advisory conversations." }
    ],
    business_attorney: [
      { title: "Acquisition Funding Readiness Brief", resource_type: "brief", priority: "medium", reason: "Useful for clients exploring business purchases or working capital needs.", cta: "Share as education only." }
    ],
    creator_affiliate: [
      { title: "Affiliate Campaign Starter Kit", resource_type: "campaign", priority: "high", reason: "Turns audience trust into permission-based education and tracking.", cta: "Launch one compliant content angle first." }
    ],
    veteran_community_connector: [
      { title: "Veteran Founder Funding Readiness Guide", resource_type: "guide", priority: "high", reason: "Matches community education with readiness-first positioning.", cta: "Share with veteran entrepreneurs."
      }
    ]
  };

  return [...base, ...(typeSpecific[partnerType] || [])].map((item, index) => ({
    resource_id: `res_${partnerType || "general"}_${index + 1}`,
    recommended_for: [partnerType || "general_partner", audience || "general_smb"],
    ...item
  }));
}

export function buildOnboardingPlan(classification: PartnerClassification): Record<string, unknown> {
  return {
    partner_id: classification.partner_profile.partner_id,
    onboarding_path: classification.onboarding_path,
    first_24_hours: [
      "Confirm partner profile and contact details.",
      "Review compliance-safe referral language.",
      "Assign initial resource pack.",
      "Decide whether manual operator review is required."
    ],
    first_7_days: [
      "Complete partner orientation.",
      "Choose one campaign angle.",
      "Create or confirm tracking link placeholder.",
      "Log first outreach or referral event."
    ],
    first_30_days: [
      "Review activation quality and partner responsiveness.",
      "Audit referral language and lead quality.",
      "Promote, nurture, or keep on watchlist based on activity.",
      "Decide if Notion/HubSpot sync should move from sandbox to production workflow."
    ],
    required_assets: [
      "Partner Welcome Pack",
      "Compliance-safe referral language",
      "Funding Readiness Checklist",
      "Campaign starter template"
    ],
    owner: classification.manual_review_required ? "Jason/operator review" : "partner_ops",
    next_action: classification.next_action
  };
}

export function buildCampaignKit(partnerType: string, audience: string): Record<string, unknown> {
  const safeAudience = audience || "general_smb";

  return {
    campaign_name: `${safeAudience.replace(/_/g, " ")} Funding Readiness Sprint`,
    campaign_type: "education_first_referral_campaign",
    audience: safeAudience,
    offer: "Funding readiness review and next-step guidance.",
    cta: "Check funding readiness before submitting a request.",
    suggested_channels: ["email", "LinkedIn", "community post", "partner resource page"],
    copy_angle: partnerType === "creator_affiliate"
      ? "Help your audience understand funding readiness without hype or fake promises."
      : "Help business owners organize the facts lenders and funding partners usually need to review options.",
    tracking_notes: "Use UTM parameters and partner_id. Do not track sensitive personal or financial data in event metadata.",
    compliance_note: SAFE_COMPLIANCE_MESSAGE
  };
}
