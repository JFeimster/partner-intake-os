export type StorageMode = "mock" | "notion" | "hubspot" | "dual_sandbox";

export type SyncStatus = "queued" | "skipped" | "synced" | "failed" | "needs_review";

export type SyncTarget = "mock" | "notion" | "hubspot" | "dual_sandbox";

export type RiskLevel = "low" | "medium" | "high";

export interface PartnerProfile {
  partner_id?: string;
  display_name?: string;
  company?: string;
  email?: string;
  phone?: string;
  partner_type?: string;
  partner_tier?: string;
  onboarding_path?: string;
  primary_audience?: string;
  secondary_audiences?: string[];
  risk_level?: RiskLevel | string;
  status?: string;
  source?: string;
  tags?: string[];
  recommended_resources?: string[];
  recommended_campaigns?: string[];
  next_action?: string;
  reviewer_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PartnerSyncEvent {
  event_id?: string;
  event_type: "partner_classified" | "partner_updated" | "partner_reviewed" | "partner_approved" | "partner_watchlisted";
  source: "api" | "tally" | "gpt_action" | "admin" | "test";
  dry_run?: boolean;
  partner: PartnerProfile;
  scorecard?: {
    overall_score?: number;
    tier_recommendation?: string;
    manual_review_required?: boolean;
    reasoning_summary?: string;
  };
  risk_flags?: string[];
  manual_review_required?: boolean;
  created_at?: string;
  metadata?: Record<string, unknown>;
}

export interface SyncResult {
  status: SyncStatus;
  target: SyncTarget;
  mode: StorageMode;
  dry_run: boolean;
  message: string;
  event_id?: string;
  partner_id?: string;
  external_id?: string;
  external_url?: string;
  needs_review?: boolean;
  error_code?: string;
  safe_log?: Record<string, unknown>;
  created_at: string;
}

export interface SyncConfig {
  mode: StorageMode;
  dryRun: boolean;
  notionApiKey?: string;
  notionDatabaseId?: string;
  hubspotAccessToken?: string;
  hubspotPartnerPipelineId?: string;
}

export function getStorageMode(value = process.env.PARTNER_INTAKE_STORAGE_MODE): StorageMode {
  const normalized = String(value || "mock").trim().toLowerCase();
  if (["mock", "notion", "hubspot", "dual_sandbox"].includes(normalized)) {
    return normalized as StorageMode;
  }
  return "mock";
}

export function getDryRun(value = process.env.PARTNER_INTAKE_DRY_RUN): boolean {
  // Default to dry-run unless explicitly disabled. The robot gets training wheels before the drag strip.
  return String(value || "true").toLowerCase() !== "false";
}

export function createSyncConfig(): SyncConfig {
  return {
    mode: getStorageMode(),
    dryRun: getDryRun(),
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_PARTNER_DATABASE_ID,
    hubspotAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
    hubspotPartnerPipelineId: process.env.HUBSPOT_PARTNER_PIPELINE_ID
  };
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function normalizePartnerId(partner: PartnerProfile): string {
  return String(partner.partner_id || "partner_pending_id").trim();
}

export function hasReviewRisk(event: PartnerSyncEvent): boolean {
  const riskLevel = String(event.partner.risk_level || "").toLowerCase();
  return Boolean(
    event.manual_review_required ||
      event.scorecard?.manual_review_required ||
      riskLevel === "high" ||
      (event.risk_flags && event.risk_flags.length > 0)
  );
}

export function scrubEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const [name, domain] = String(email).split("@");
  if (!name || !domain) return "[redacted-email]";
  return `${name.slice(0, 2)}***@${domain}`;
}

export function safePartnerSummary(partner: PartnerProfile): Record<string, unknown> {
  return {
    partner_id: normalizePartnerId(partner),
    company: partner.company || partner.display_name || "[not provided]",
    email: scrubEmail(partner.email),
    partner_type: partner.partner_type || "unknown",
    partner_tier: partner.partner_tier || "unassigned",
    onboarding_path: partner.onboarding_path || "manual_review",
    risk_level: partner.risk_level || "unknown",
    status: partner.status || "pending_review",
    source: partner.source || "unknown"
  };
}

export function buildSyncResult(input: Omit<SyncResult, "created_at">): SyncResult {
  return {
    ...input,
    created_at: nowIso()
  };
}
