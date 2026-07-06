export type OnboardingTask = {
  task: string;
  owner: string;
  due: string;
  status: "not_started" | "in_progress" | "blocked" | "completed" | "skipped";
  notes?: string;
};

export type OnboardingPlan = {
  partner_id?: string;
  onboarding_path: string;
  first_24_hours: OnboardingTask[];
  first_7_days: OnboardingTask[];
  first_30_days: OnboardingTask[];
  required_assets: string[];
  recommended_training: string[];
  recommended_resources: string[];
  recommended_campaign: string;
  owner: string;
  next_action: string;
  what_not_to_automate_yet: string[];
  manual_review_required: boolean;
};

function task(task: string, owner: string, due: string, notes?: string): OnboardingTask {
  return {
    task,
    owner,
    due,
    status: "not_started",
    notes
  };
}

export function generateOnboardingPlan(input: {
  partner_id?: string;
  partner_type: string;
  partner_tier?: string;
  onboarding_path: string;
  risk_level?: string;
  manual_review_required?: boolean;
  next_action?: string;
}): OnboardingPlan {
  const manualReviewRequired =
    Boolean(input.manual_review_required) ||
    input.risk_level === "high" ||
    input.risk_level === "critical";

  if (input.onboarding_path === "reject_manual_risk_review" || input.risk_level === "critical") {
    return {
      partner_id: input.partner_id,
      onboarding_path: "reject_manual_risk_review",
      first_24_hours: [
        task("Lock partner activation until admin review is complete", "admin", "same_day", "Do not send campaign links or partner dashboard access."),
        task("Document risk flags and missing context", "admin", "same_day")
      ],
      first_7_days: [
        task("Decide reject, watchlist, or request clarification", "admin", "within_7_days")
      ],
      first_30_days: [
        task("Keep record inactive unless risk is cleared", "admin", "within_30_days")
      ],
      required_assets: ["Compliance guardrails", "Admin review notes"],
      recommended_training: ["Partner compliance basics"],
      recommended_resources: ["Compliance guardrails"],
      recommended_campaign: "none_until_reviewed",
      owner: "admin",
      next_action: "manual_risk_review",
      what_not_to_automate_yet: [
        "Do not auto-approve.",
        "Do not auto-send affiliate links.",
        "Do not trigger welcome sequence."
      ],
      manual_review_required: true
    };
  }

  const brokerLike = input.partner_type === "funding_broker" || input.partner_type === "iso";
  const professionalReferral =
    input.partner_type === "cpa_bookkeeper" ||
    input.partner_type === "small_business_attorney" ||
    input.partner_type === "business_broker";

  const requiredAssets = brokerLike
    ? ["Funding Product Matrix", "Lead submission guidance", "Broker Follow-Up Machine"]
    : professionalReferral
      ? ["Business funding readiness checklist", "Referral partner scripts", "Intro email template"]
      : ["Partner resource pack", "Onboarding checklist", "Campaign kit"];

  const campaign = brokerLike
    ? "Dead Lead Revival Funding Readiness Push"
    : professionalReferral
      ? "Warm Referral Readiness Intro"
      : "Education-First Partner Nurture";

  return {
    partner_id: input.partner_id,
    onboarding_path: input.onboarding_path,
    first_24_hours: [
      task("Confirm partner profile, audience, and desired role", "partner_ops", "same_day"),
      task("Assign partner tier and onboarding path", "partner_ops", "same_day"),
      task("Send first resource pack", "partner_ops", "same_day", "Keep copy educational and readiness-based.")
    ],
    first_7_days: [
      task("Collect missing business, audience, and referral context", "partner_ops", "within_7_days"),
      task("Review compliance guardrails with partner", "partner_ops", "within_7_days"),
      task("Select first campaign or referral motion", "partner_ops", "within_7_days")
    ],
    first_30_days: [
      task("Launch first campaign or referral intro test", "partner", "within_30_days"),
      task("Review first referrals, lead quality, and follow-up behavior", "partner_ops", "within_30_days"),
      task("Decide whether to activate, nurture, or escalate to strategic review", "admin", "within_30_days")
    ],
    required_assets: requiredAssets,
    recommended_training: [
      "Funding product overview",
      "Compliance-safe partner language",
      "Clean lead submission standards"
    ],
    recommended_resources: requiredAssets,
    recommended_campaign: campaign,
    owner: "partner_ops",
    next_action: input.next_action || "send_resource_pack_and_confirm_partner_context",
    what_not_to_automate_yet: [
      "Do not auto-approve high-risk partners.",
      "Do not send client-facing funding claims without review.",
      "Do not trigger commission or payout workflows."
    ],
    manual_review_required: manualReviewRequired
  };
}
