import { createLeadId, createExternalReference } from "./lead-id";
import { createLeadEvent } from "./lead-events";
import { assessLeadRisk } from "./lead-risk";
import type { NormalizedLeadPayload } from "./validate-lead";

export type RoutedLead = {
  lead_id: string;
  partner_id: string;
  tracking_id?: string;
  referral_source?: string;
  source: string;
  external_reference: string;
  status: "manual_review";
  review_status: "needs_review";
  risk_level: "low" | "medium" | "high";
  risk_flags: string[];
  manual_review_required: true;
  next_action: string;
  compliance_message: string;
  business: NormalizedLeadPayload["business"];
  contact: {
    name: string;
    email?: string;
    phone?: string;
  };
  funding: NormalizedLeadPayload["funding"];
  created_at: string;
  events: ReturnType<typeof createLeadEvent>[];
};

export const LEAD_COMPLIANCE_MESSAGE =
  "Lead received for manual review. Submission does not guarantee approval, funding, rates, terms, timelines, lender review, or commissions.";

export function routeLead(lead: NormalizedLeadPayload): RoutedLead {
  const now = new Date().toISOString();
  const risk = assessLeadRisk(lead as unknown as Record<string, unknown>);
  const leadId = createLeadId();
  const externalReference = createExternalReference(lead.source, lead.external_id);

  const routedLead: RoutedLead = {
    lead_id: leadId,
    partner_id: lead.partner_id,
    tracking_id: lead.tracking_id,
    referral_source: lead.referral_source,
    source: lead.source,
    external_reference: externalReference,
    status: "manual_review",
    review_status: "needs_review",
    risk_level: risk.risk_level,
    risk_flags: risk.flags,
    manual_review_required: true,
    next_action: risk.risk_level === "high"
      ? "Operator review required before any routing or CRM sync."
      : "Review partner attribution, consent, and funding context before routing.",
    compliance_message: LEAD_COMPLIANCE_MESSAGE,
    business: lead.business,
    contact: {
      name: lead.contact.name,
      email: lead.contact.email,
      phone: lead.contact.phone
    },
    funding: lead.funding,
    created_at: now,
    events: [
      createLeadEvent({
        event_type: "lead_created",
        lead_id: leadId,
        partner_id: lead.partner_id,
        tracking_id: lead.tracking_id,
        actor_type: "api",
        summary: "Lead submission received and placed into manual review.",
        metadata: {
          source: lead.source,
          referral_source: lead.referral_source,
          risk_level: risk.risk_level,
          manual_review_required: true
        }
      })
    ]
  };

  return routedLead;
}

export async function queueLeadForReview(routedLead: RoutedLead): Promise<{
  stored: boolean;
  storage_mode: string;
  sync_status: "queued" | "skipped" | "needs_review";
  notes: string[];
}> {
  const storageMode = process.env.PARTNER_INTAKE_STORAGE_MODE || "mock";
  const dryRun = process.env.PARTNER_INTAKE_DRY_RUN !== "false";

  const notes = [
    "Lead is queued for manual review by default.",
    "Duplicate handling should compare external_reference, partner_id, contact email, and business name before future CRM writes.",
    "Future Notion/HubSpot sync should run only after consent and attribution checks pass."
  ];

  if (dryRun || storageMode === "mock") {
    return {
      stored: false,
      storage_mode: storageMode,
      sync_status: "skipped",
      notes: [...notes, "Dry-run/mock mode: no external storage write was attempted."]
    };
  }

  // Future handoff point:
  // - Notion staging/review record creation.
  // - HubSpot contact/company/deal/task creation.
  // - Idempotent duplicate check before write.
  // - Immutable event write after successful sync.
  // Keep raw PII out of logs and only sync fields required for review.

  return {
    stored: false,
    storage_mode: storageMode,
    sync_status: "queued",
    notes: [...notes, "Storage mode requested, but live connector write is intentionally deferred to the sandbox sync layer."]
  };
}

export function buildLeadLookupStub(leadId: string): RoutedLead {
  return {
    lead_id: leadId,
    partner_id: "partner_demo_review",
    tracking_id: "trk_demo_partner_campaign",
    referral_source: "partner_dashboard",
    source: "api",
    external_reference: `demo:${leadId}`,
    status: "manual_review",
    review_status: "needs_review",
    risk_level: "low",
    risk_flags: [],
    manual_review_required: true,
    next_action: "Review source, partner attribution, and consent before routing.",
    compliance_message: LEAD_COMPLIANCE_MESSAGE,
    business: {
      name: "Demo Business LLC",
      industry: "Contracting",
      monthly_revenue_estimate: 85000,
      time_in_business: "3 years"
    },
    contact: {
      name: "Demo Contact",
      email: "demo-contact@example.com",
      phone: "555-0100"
    },
    funding: {
      requested_amount_estimate: 75000,
      use_of_funds: "Equipment and working capital",
      timeline: "30 days"
    },
    created_at: new Date().toISOString(),
    events: [
      createLeadEvent({
        event_type: "lead_viewed",
        lead_id: leadId,
        partner_id: "partner_demo_review",
        actor_type: "api",
        summary: "Demo lead lookup generated for endpoint validation."
      })
    ]
  };
}
