import { REVIEW_STATUSES, ReviewStatus } from "./review-types";

const TRANSITIONS: Record<ReviewStatus, ReviewStatus[]> = {
  new: ["needs_review", "archived"],
  needs_review: ["needs_info", "approved_for_onboarding", "rejected", "paused", "archived"],
  needs_info: ["needs_review", "paused", "archived"],
  approved_for_onboarding: ["paused", "archived"],
  rejected: ["archived", "needs_review"],
  paused: ["needs_review", "archived"],
  archived: ["needs_review"],
};

export function isReviewStatus(value: unknown): value is ReviewStatus {
  return typeof value === "string" && (REVIEW_STATUSES as readonly string[]).includes(value);
}

export function assertReviewStatus(value: unknown): ReviewStatus {
  if (!isReviewStatus(value)) {
    throw new Error(`Invalid review status: ${String(value)}`);
  }
  return value;
}

export function canTransitionReviewStatus(from: ReviewStatus, to: ReviewStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertStatusTransition(from: ReviewStatus, to: ReviewStatus): void {
  if (!canTransitionReviewStatus(from, to)) {
    throw new Error(`Invalid review transition from ${from} to ${to}`);
  }
}

export function inferManualReviewTriggers(input: Record<string, unknown>): string[] {
  const text = JSON.stringify(input).toLowerCase();
  const triggers: string[] = [];

  if (!input || Object.keys(input).length < 4) triggers.push("low_info_intake");
  if (text.includes("guaranteed approval") || text.includes("everyone qualifies")) {
    triggers.push("compliance_language_risk");
  }
  if (text.includes("instant funding") || text.includes("no documents needed")) {
    triggers.push("compliance_language_risk");
  }
  if (text.includes("bulk leads") || text.includes("aged leads")) {
    triggers.push("lead_seller_review");
  }
  if (text.includes("ssn") || text.includes("bank statement") || text.includes("tax return")) {
    triggers.push("sensitive_data_flagged");
  }

  return [...new Set(triggers)];
}

export function recommendedInitialStatus(input: Record<string, unknown>): ReviewStatus {
  const triggers = inferManualReviewTriggers(input);
  return triggers.length > 0 ? "needs_review" : "new";
}
