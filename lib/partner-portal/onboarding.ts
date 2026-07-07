export type PartnerOnboardingStatus =
  | "not_started"
  | "in_progress"
  | "needs_info"
  | "ready_for_review"
  | "approved_for_onboarding"
  | "active"
  | "paused"
  | "archived";

export interface OnboardingChecklistItem {
  id: string;
  label: string;
  status: "not_started" | "in_progress" | "complete" | "blocked";
  sensitive: false;
}

export function defaultOnboardingChecklist(): OnboardingChecklistItem[] {
  return [
    { id: "complete_profile", label: "Complete partner profile", status: "not_started", sensitive: false },
    { id: "confirm_audience", label: "Confirm primary audience", status: "not_started", sensitive: false },
    { id: "review_compliance_rules", label: "Review compliant promo rules", status: "not_started", sensitive: false },
    { id: "choose_campaign", label: "Choose first campaign", status: "not_started", sensitive: false },
    { id: "create_tracking_link", label: "Create first tracking link", status: "not_started", sensitive: false },
  ];
}

export function progressPercent(items: OnboardingChecklistItem[]): number {
  if (!items.length) return 0;
  return Math.round((items.filter((item) => item.status === "complete").length / items.length) * 100);
}
