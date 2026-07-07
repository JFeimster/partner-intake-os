export const REVIEW_STATUSES = [
  "new",
  "needs_review",
  "needs_info",
  "approved_for_onboarding",
  "rejected",
  "paused",
  "archived",
] as const;

export type ReviewStatus = typeof REVIEW_STATUSES[number];

export const REVIEW_ACTIONS = [
  "create",
  "assign",
  "update_status",
  "request_info",
  "approve_for_onboarding",
  "reject",
  "pause",
  "archive",
  "escalate",
  "add_operator_note",
] as const;

export type ReviewAction = typeof REVIEW_ACTIONS[number];

export type ReviewEntityType =
  | "partner"
  | "lead"
  | "tracking_link"
  | "tracking_event"
  | "sync_job"
  | "campaign"
  | "resource";

export type ReviewRiskLevel = "low" | "medium" | "high" | "unknown";

export interface ReviewItem {
  review_item_id?: string;
  entity_type: ReviewEntityType;
  entity_id: string;
  status: ReviewStatus;
  assigned_to_user_id?: string | null;
  assigned_role?: "owner" | "admin" | "reviewer" | "read_only" | "integration_service" | null;
  risk_level?: ReviewRiskLevel;
  reason_codes?: string[];
  operator_note?: string | null;
  due_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ReviewDecisionInput {
  review_item_id: string;
  entity_type: ReviewEntityType;
  entity_id: string;
  action: ReviewAction;
  previous_status?: ReviewStatus;
  new_status?: ReviewStatus;
  reason_code?: string;
  operator_note?: string;
  created_by?: string;
  metadata?: Record<string, unknown>;
}

export interface ReviewDecisionLog extends ReviewDecisionInput {
  decision_id: string;
  created_at: string;
}
