import { dbQuery } from "./client";

export type AuditEntityType =
  | "partner"
  | "lead"
  | "partner_event"
  | "tracking_link"
  | "tracking_event"
  | "admin_review_item"
  | "sync_job"
  | "system";

export type AuditActorType =
  | "system"
  | "admin"
  | "reviewer"
  | "partner"
  | "integration_service"
  | "gpt_action";

export type AuditLogInput = {
  entityType: AuditEntityType;
  entityId?: string | null;
  action: string;
  actorType?: AuditActorType;
  actorId?: string | null;
  source?: string;
  requestId?: string | null;
  payloadHash?: string | null;
  beforeState?: Record<string, unknown> | null;
  afterState?: Record<string, unknown> | null;
  metadata?: Record<string, unknown>;
};

export type AuditLogRow = {
  audit_id: string;
  entity_type: string;
  entity_id: string | null;
  action: string;
  actor_type: string;
  actor_id: string | null;
  source: string;
  request_id: string | null;
  payload_hash: string | null;
  before_state: Record<string, unknown> | null;
  after_state: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function writeAuditLog(input: AuditLogInput): Promise<string> {
  const result = await dbQuery<{ audit_id: string }>(
    `
      SELECT write_audit_log(
        $1::TEXT,
        $2::UUID,
        $3::TEXT,
        $4::TEXT,
        $5::TEXT,
        $6::TEXT,
        $7::TEXT,
        $8::TEXT,
        $9::JSONB,
        $10::JSONB,
        $11::JSONB
      ) AS audit_id
    `,
    [
      input.entityType,
      input.entityId ?? null,
      input.action,
      input.actorType ?? "system",
      input.actorId ?? null,
      input.source ?? "system",
      input.requestId ?? null,
      input.payloadHash ?? null,
      input.beforeState ?? null,
      input.afterState ?? null,
      input.metadata ?? {}
    ]
  );

  return result.rows[0].audit_id;
}

export async function readAuditLogs(options: {
  entityType?: AuditEntityType;
  entityId?: string;
  action?: string;
  requestId?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<AuditLogRow[]> {
  const limit = Math.min(Math.max(options.limit ?? 50, 1), 200);
  const offset = Math.max(options.offset ?? 0, 0);

  const where: string[] = [];
  const values: unknown[] = [];
  let index = 1;

  if (options.entityType) {
    where.push(`entity_type = $${index++}`);
    values.push(options.entityType);
  }

  if (options.entityId) {
    where.push(`entity_id = $${index++}::UUID`);
    values.push(options.entityId);
  }

  if (options.action) {
    where.push(`action = $${index++}`);
    values.push(options.action);
  }

  if (options.requestId) {
    where.push(`request_id = $${index++}`);
    values.push(options.requestId);
  }

  values.push(limit);
  const limitParam = `$${index++}`;

  values.push(offset);
  const offsetParam = `$${index++}`;

  const result = await dbQuery<AuditLogRow>(
    `
      SELECT *
      FROM audit_log
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC
      LIMIT ${limitParam}
      OFFSET ${offsetParam}
    `,
    values as any[]
  );

  return result.rows;
}

/**
 * Keep audit metadata safe by allowing only operational data.
 * This is not a compliance scanner; it is a defensive filter before writing.
 */
export function safeAuditMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const blockedKeys = [
    "ssn",
    "social_security_number",
    "bank_account",
    "routing_number",
    "credit_report",
    "tax_return",
    "statement",
    "api_key",
    "token",
    "secret",
    "password"
  ];

  return Object.fromEntries(
    Object.entries(metadata).filter(([key]) => {
      const normalized = key.toLowerCase();
      return !blockedKeys.some((blocked) => normalized.includes(blocked));
    })
  );
}
