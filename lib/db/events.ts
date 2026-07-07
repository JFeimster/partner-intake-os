import { dbQuery } from "./client";
import { writeAuditLog, safeAuditMetadata } from "./audit-log";

export type PartnerEventRow = {
  event_id: string;
  partner_id: string | null;
  lead_id: string | null;
  event_type: string;
  event_source: string;
  summary: string;
  actor_type: string;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export async function createPartnerEvent(input: {
  partnerId?: string | null;
  leadId?: string | null;
  eventType: string;
  eventSource?: string;
  summary: string;
  actorType?: string;
  actorId?: string | null;
  metadata?: Record<string, unknown>;
  requestId?: string | null;
}): Promise<PartnerEventRow> {
  const result = await dbQuery<PartnerEventRow>(
    `
      INSERT INTO partner_events (
        partner_id,
        lead_id,
        event_type,
        event_source,
        summary,
        actor_type,
        actor_id,
        metadata
      )
      VALUES ($1::UUID, $2::UUID, $3, $4, $5, $6, $7, $8::JSONB)
      RETURNING *
    `,
    [
      input.partnerId ?? null,
      input.leadId ?? null,
      input.eventType,
      input.eventSource ?? "system",
      input.summary,
      input.actorType ?? "system",
      input.actorId ?? null,
      input.metadata ?? {}
    ]
  );

  const event = result.rows[0];

  await writeAuditLog({
    entityType: "partner_event",
    entityId: event.event_id,
    action: "partner_event.created",
    actorType: (input.actorType as any) ?? "system",
    actorId: input.actorId ?? null,
    source: input.eventSource ?? "system",
    requestId: input.requestId ?? null,
    afterState: {
      partner_id: event.partner_id,
      lead_id: event.lead_id,
      event_type: event.event_type
    },
    metadata: safeAuditMetadata({ summary: input.summary })
  });

  return event;
}

export async function listPartnerEvents(partnerId: string, limit = 50): Promise<PartnerEventRow[]> {
  const result = await dbQuery<PartnerEventRow>(
    `
      SELECT *
      FROM partner_events
      WHERE partner_id = $1::UUID
      ORDER BY created_at DESC
      LIMIT $2
    `,
    [partnerId, Math.min(Math.max(limit, 1), 200)]
  );

  return result.rows;
}
