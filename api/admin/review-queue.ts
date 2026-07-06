type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): { json(payload: unknown): void } };
import {
  authenticateAdminRequest,
  noStoreHeaders,
  redactEmail,
  safeAdminError
} from "../../lib/admin-auth";

function sendJson(res: VercelResponse, statusCode: number, payload: unknown): void {
  Object.entries(noStoreHeaders()).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(statusCode).json(payload);
}

function sampleReviewQueue() {
  const now = new Date().toISOString();
  const records = [
    {
      partner_id: "ptr_demo_cpa_001",
      display_name: "Cole Advisory Group",
      contact_email_masked: redactEmail("dana.cole@example.com"),
      company: "Cole Advisory Group",
      partner_type: "cpa_bookkeeper",
      partner_tier: "tier_2",
      onboarding_path: "standard_affiliate_partner",
      status: "needs_review",
      risk_level: "low",
      score: 78,
      manual_review_required: true,
      risk_flags: ["needs_compliance_acknowledgment"],
      recommended_decision: "approve_after_manual_review",
      next_action: "Confirm audience fit, send referral partner resource pack, then schedule activation call.",
      reviewer_notes: "Sample record only. No real PII. Treat as review queue fixture.",
      created_at: now
    },
    {
      partner_id: "ptr_demo_broker_002",
      display_name: "Atlas Funding Desk",
      contact_email_masked: redactEmail("morgan.atlas@example.com"),
      company: "Atlas Funding Desk",
      partner_type: "funding_broker",
      partner_tier: "tier_1",
      onboarding_path: "fast_track_revenue_partner",
      status: "needs_review",
      risk_level: "medium",
      score: 86,
      manual_review_required: true,
      risk_flags: ["verify_volume_claims", "review_disclosure_process"],
      recommended_decision: "conditional_approval_review",
      next_action: "Verify referral quality, confirm permission-based lead process, then issue campaign kit.",
      reviewer_notes: "Sample record only. Do not treat as approved partner.",
      created_at: now
    },
    {
      partner_id: "ptr_demo_leadseller_003",
      display_name: "Velocity Lead Network",
      contact_email_masked: redactEmail("leads@example.com"),
      company: "Velocity Lead Network",
      partner_type: "lead_seller",
      partner_tier: "reject_or_watchlist",
      onboarding_path: "reject_manual_risk_review",
      status: "blocked_pending_review",
      risk_level: "high",
      score: 31,
      manual_review_required: true,
      risk_flags: ["lead_seller_language", "unclear_consent", "high_volume_claims", "compliance_risk"],
      recommended_decision: "do_not_activate_without_operator_review",
      next_action: "Request consent process details and reject if permission-based sourcing is not proven.",
      reviewer_notes: "Sample high-risk record. No real PII. Do not sync as active partner.",
      created_at: now
    }
  ];

  return records;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    const error = safeAdminError("METHOD_NOT_ALLOWED", "Use GET to read the protected admin review queue.", 405);
    return sendJson(res, error.statusCode, error.payload);
  }

  const auth = authenticateAdminRequest(req);
  if (!auth.ok) {
    const error = safeAdminError("UNAUTHORIZED_ADMIN", "Admin authentication is required for review queue access.", 401);
    return sendJson(res, error.statusCode, {
      ...error.payload,
      auth_reason: auth.reason || "unauthorized"
    });
  }

  const records = sampleReviewQueue();
  return sendJson(res, 200, {
    ok: true,
    mode: auth.mode,
    role: auth.role,
    data_classification: "sample_internal_review_data_only",
    warning: "This queue contains sample/demo records only. Do not expose real PII or production partner records through this MVP route.",
    total: records.length,
    records
  });
}
