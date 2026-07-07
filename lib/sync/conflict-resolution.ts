/**
 * Field-level sync conflict resolution
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export type LockLevel = "database_locked" | "crm_locked" | "ops_locked" | "open_sync" | "manual_only";
export type ConflictResolution =
  | "keep_database"
  | "accept_external"
  | "merge_non_sensitive"
  | "pause_sync"
  | "recreate_external_record"
  | "escalate_to_admin";

export interface FieldPolicy {
  field: string;
  lock_level: LockLevel;
  external_update_behavior: "allow" | "queue_conflict" | "ignore" | "manual_only";
  allowed_sources: string[];
  audit_required: boolean;
}

export interface SyncConflict {
  conflict_type: "locked_field_update" | "stale_external_record" | "missing_external_id" | "schema_mismatch" | "sensitive_data_violation";
  field?: string;
  internal_value?: unknown;
  external_value?: unknown;
  target_system: "hubspot" | "notion";
  recommended_resolution: ConflictResolution;
  reason: string;
}

export const DEFAULT_FIELD_POLICIES: FieldPolicy[] = [
  { field: "partner_id", lock_level: "database_locked", external_update_behavior: "ignore", allowed_sources: ["database"], audit_required: true },
  { field: "partner_tier", lock_level: "database_locked", external_update_behavior: "queue_conflict", allowed_sources: ["admin_review", "scoring_rules"], audit_required: true },
  { field: "risk_level", lock_level: "database_locked", external_update_behavior: "queue_conflict", allowed_sources: ["risk_rules", "admin_review"], audit_required: true },
  { field: "review_status", lock_level: "database_locked", external_update_behavior: "queue_conflict", allowed_sources: ["review_queue"], audit_required: true },
  { field: "crm_owner_id", lock_level: "crm_locked", external_update_behavior: "allow", allowed_sources: ["hubspot"], audit_required: true },
  { field: "company_name", lock_level: "open_sync", external_update_behavior: "allow", allowed_sources: ["database", "hubspot", "notion"], audit_required: false }
];

export function getFieldPolicy(field: string, policies = DEFAULT_FIELD_POLICIES): FieldPolicy {
  return policies.find((policy) => policy.field === field) ?? {
    field,
    lock_level: "manual_only",
    external_update_behavior: "manual_only",
    allowed_sources: ["admin_review"],
    audit_required: true
  };
}

export function detectFieldConflict(args: {
  field: string;
  internalValue: unknown;
  externalValue: unknown;
  externalSource: "hubspot" | "notion";
  internalUpdatedAt?: string;
  externalUpdatedAt?: string;
}): SyncConflict | null {
  const policy = getFieldPolicy(args.field);
  const valuesDiffer = JSON.stringify(args.internalValue ?? null) !== JSON.stringify(args.externalValue ?? null);
  if (!valuesDiffer) return null;

  if (policy.external_update_behavior === "queue_conflict" || policy.external_update_behavior === "manual_only") {
    return {
      conflict_type: "locked_field_update",
      field: args.field,
      internal_value: args.internalValue,
      external_value: args.externalValue,
      target_system: args.externalSource,
      recommended_resolution: "keep_database",
      reason: `${args.field} is ${policy.lock_level}; external update requires manual review.`
    };
  }

  if (args.internalUpdatedAt && args.externalUpdatedAt && new Date(args.externalUpdatedAt) < new Date(args.internalUpdatedAt)) {
    return {
      conflict_type: "stale_external_record",
      field: args.field,
      internal_value: args.internalValue,
      external_value: args.externalValue,
      target_system: args.externalSource,
      recommended_resolution: "keep_database",
      reason: "External update is older than database record."
    };
  }

  return null;
}
