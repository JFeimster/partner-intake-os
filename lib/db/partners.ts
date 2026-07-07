import { dbQuery } from "./client";
import { writeAuditLog, safeAuditMetadata } from "./audit-log";

export type PartnerRow = {
  partner_id: string;
  external_partner_ref: string | null;
  display_name: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  website: string | null;
  partner_type: string;
  partner_tier: string;
  onboarding_path: string;
  primary_audience: string | null;
  secondary_audiences: string[];
  risk_level: string;
  status: string;
  source: string;
  tags: string[];
  scorecard: Record<string, unknown>;
  recommended_resources: unknown[];
  recommended_campaigns: unknown[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreatePartnerInput = {
  externalPartnerRef?: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  partnerType?: string;
  partnerTier?: string;
  onboardingPath?: string;
  primaryAudience?: string;
  secondaryAudiences?: string[];
  riskLevel?: string;
  status?: string;
  source?: string;
  tags?: string[];
  scorecard?: Record<string, unknown>;
  recommendedResources?: unknown[];
  recommendedCampaigns?: unknown[];
  metadata?: Record<string, unknown>;
  requestId?: string;
  actorId?: string;
};

export async function createPartner(input: CreatePartnerInput): Promise<PartnerRow> {
  const result = await dbQuery<PartnerRow>(
    `
      INSERT INTO partners (
        external_partner_ref,
        display_name,
        first_name,
        last_name,
        email,
        phone,
        company,
        website,
        partner_type,
        partner_tier,
        onboarding_path,
        primary_audience,
        secondary_audiences,
        risk_level,
        status,
        source,
        tags,
        scorecard,
        recommended_resources,
        recommended_campaigns,
        metadata
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17,
        $18::JSONB, $19::JSONB, $20::JSONB, $21::JSONB
      )
      RETURNING *
    `,
    [
      input.externalPartnerRef ?? null,
      input.displayName,
      input.firstName ?? null,
      input.lastName ?? null,
      input.email ?? null,
      input.phone ?? null,
      input.company ?? null,
      input.website ?? null,
      input.partnerType ?? "unclassified",
      input.partnerTier ?? "unassigned",
      input.onboardingPath ?? "manual_review",
      input.primaryAudience ?? null,
      input.secondaryAudiences ?? [],
      input.riskLevel ?? "unknown",
      input.status ?? "new",
      input.source ?? "manual",
      input.tags ?? [],
      input.scorecard ?? {},
      input.recommendedResources ?? [],
      input.recommendedCampaigns ?? [],
      input.metadata ?? {}
    ]
  );

  const partner = result.rows[0];

  await writeAuditLog({
    entityType: "partner",
    entityId: partner.partner_id,
    action: "partner.created",
    actorType: input.actorId ? "admin" : "system",
    actorId: input.actorId ?? null,
    source: input.source ?? "manual",
    requestId: input.requestId ?? null,
    afterState: {
      status: partner.status,
      partner_type: partner.partner_type,
      partner_tier: partner.partner_tier,
      onboarding_path: partner.onboarding_path,
      risk_level: partner.risk_level
    },
    metadata: safeAuditMetadata({
      external_partner_ref: input.externalPartnerRef ?? null,
      source: input.source ?? "manual"
    })
  });

  return partner;
}

export async function getPartnerById(partnerId: string): Promise<PartnerRow | null> {
  const result = await dbQuery<PartnerRow>(
    `SELECT * FROM partners WHERE partner_id = $1::UUID LIMIT 1`,
    [partnerId]
  );

  return result.rows[0] ?? null;
}

export async function updatePartnerStatus(input: {
  partnerId: string;
  status: string;
  reason?: string;
  actorId?: string;
  requestId?: string;
}): Promise<PartnerRow> {
  const before = await getPartnerById(input.partnerId);
  if (!before) throw new Error("Partner not found.");

  const result = await dbQuery<PartnerRow>(
    `
      UPDATE partners
      SET status = $2
      WHERE partner_id = $1::UUID
      RETURNING *
    `,
    [input.partnerId, input.status]
  );

  const after = result.rows[0];

  await writeAuditLog({
    entityType: "partner",
    entityId: input.partnerId,
    action: "partner.status_updated",
    actorType: input.actorId ? "admin" : "system",
    actorId: input.actorId ?? null,
    source: "api",
    requestId: input.requestId ?? null,
    beforeState: { status: before.status },
    afterState: { status: after.status },
    metadata: safeAuditMetadata({ reason: input.reason ?? null })
  });

  return after;
}
