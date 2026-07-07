export type NotificationTemplateName =
  | "internal_new_partner_needs_review"
  | "internal_high_risk_partner_flagged"
  | "internal_lead_submitted"
  | "internal_duplicate_detected"
  | "internal_sync_failure"
  | "internal_admin_decision_needed"
  | "partner_submission_received_for_review";

export interface NotificationTemplate {
  subject: string;
  body: string;
  partner_facing: boolean;
}

export const TEMPLATES: Record<NotificationTemplateName, NotificationTemplate> = {
  internal_new_partner_needs_review: {
    subject: "New partner needs review",
    body: "A new partner intake is ready for review. Partner ID: {{partner_id}}. Review item: {{review_item_id}}.",
    partner_facing: false,
  },
  internal_high_risk_partner_flagged: {
    subject: "High-risk partner flagged",
    body: "A partner intake triggered high-risk review rules. Reason codes: {{reason_codes}}.",
    partner_facing: false,
  },
  internal_lead_submitted: {
    subject: "Lead submitted for review",
    body: "A partner-submitted lead was received for review. Lead ID: {{lead_id}}. Partner ID: {{partner_id}}.",
    partner_facing: false,
  },
  internal_duplicate_detected: {
    subject: "Duplicate detected",
    body: "A possible duplicate record was detected. Entity ID: {{entity_id}}.",
    partner_facing: false,
  },
  internal_sync_failure: {
    subject: "Sync failure",
    body: "A sync job failed and needs attention. Sync job ID: {{sync_job_id}}.",
    partner_facing: false,
  },
  internal_admin_decision_needed: {
    subject: "Admin decision needed",
    body: "A record requires admin decision. Entity ID: {{entity_id}}.",
    partner_facing: false,
  },
  partner_submission_received_for_review: {
    subject: "Submission received for review",
    body: "Your submission was received for review. Funding options may vary. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.",
    partner_facing: true,
  },
};

export function renderTemplate(name: NotificationTemplateName, data: Record<string, unknown>): NotificationTemplate {
  const template = TEMPLATES[name];
  const render = (text: string) => text.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key) => String(data[key] ?? ""));
  return {
    ...template,
    subject: render(template.subject),
    body: render(template.body),
  };
}
