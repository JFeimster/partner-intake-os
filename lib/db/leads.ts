import { dbQuery } from "./client";
import { writeAuditLog, safeAuditMetadata } from "./audit-log";

export type LeadRow = {
  lead_id: string;
  partner_id: string | null;
  external_lead_ref: string | null;
  source: string;
  status: string;
  business_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  requested_product: string | null;
  funding_need_range: string | null;
  consent_confirmed: boolean;
  sensitive_data_flag: boolean;
  duplicate_of_lead_id: string | null;
  review_summary: string | null;
  routing: Record<string, unknown>;
  metadata: Record<string, unknown>;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateLeadInput = {
  partnerId?: string | null;
  externalLeadRef?: string;
  source?: string;
  status?: string;
  businessName?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  requestedProduct?: string;
  fundingNeedRange?: string;
  consentConfirmed?: boolean;
  sensitiveDataFlag?: boolean;
  duplicateOfLeadId?: string | null;
  reviewSummary?: string;
  routing?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  submittedAt?: string;
  requestId?: string;
  actorId?: string;
};

export async function createLead(input: CreateLeadInput): Promise<LeadRow> {
  const result = await dbQuery<LeadRow>(
    `
      INSERT INTO leads (
        partner_id,
        external_lead_ref,
        source,
        status,
        business_name,
        contact_name,
        contact_email,
        contact_phone,
        requested_product,
        funding_need_range,
        consent_confirmed,
        sensitive_data_flag,
        duplicate_of_lead_id,
        review_summary,
        routing,
        metadata,
        submitted_at
      )
      VALUES (
        $1::UUID, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13::UUID, $14,
        $15::JSONB, $16::JSONB, $17::TIMESTAMPTZ
      )
      RETURNING *
    `,
    [
      input.partnerId ?? null,
      input.externalLeadRef ?? null,
      input.source ?? "manual",
      input.status ?? "received_for_review",
      input.businessName ?? null,
      input.contactName ?? null,
      input.contactEmail ?? null,
      input.contactPhone ?? null,
      input.requestedProduct ?? null,
      input.fundingNeedRange ?? null,
      input.consentConfirmed ?? false,
      input.sensitiveDataFlag ?? false,
      input.duplicateOfLeadId ?? null,
      input.reviewSummary ?? "Lead received for review. Funding options may vary.",
      input.routing ?? {},
      input.metadata ?? {},
      input.submittedAt ?? null
    ]
  );

  const lead = result.rows[0];

  await writeAuditLog({
    entityType: "lead",
    entityId: lead.lead_id,
    action: "lead.received_for_review",
    actorType: input.actorId ? "admin" : "system",
    actorId: input.actorId ?? null,
    source: input.source ?? "manual",
    requestId: input.requestId ?? null,
    afterState: {
      status: lead.status,
      partner_id: lead.partner_id,
      consent_confirmed: lead.consent_confirmed,
      sensitive_data_flag: lead.sensitive_data_flag
    },
    metadata: safeAuditMetadata({
      external_lead_ref: input.externalLeadRef ?? null,
      requested_product: input.requestedProduct ?? null
    })
  });

  return lead;
}

export async function getLeadById(leadId: string): Promise<LeadRow | null> {
  const result = await dbQuery<LeadRow>(
    `SELECT * FROM leads WHERE lead_id = $1::UUID LIMIT 1`,
    [leadId]
  );

  return result.rows[0] ?? null;
}

export async function listLeadsByPartner(partnerId: string, limit = 50): Promise<LeadRow[]> {
  const result = await dbQuery<LeadRow>(
    `
      SELECT *
      FROM leads
      WHERE partner_id = $1::UUID
      ORDER BY created_at DESC
      LIMIT $2
    `,
    [partnerId, Math.min(Math.max(limit, 1), 200)]
  );

  return result.rows;
}
