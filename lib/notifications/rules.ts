import { NotificationTemplateName, TEMPLATES } from "./templates";

export interface NotificationRuleInput {
  template: NotificationTemplateName;
  entity_type: string;
  entity_id: string;
  recipient?: string;
  partner_facing_enabled?: boolean;
  record_status?: string;
  last_sent_at?: string | null;
}

const SUPPRESSION_WINDOWS_MINUTES: Record<NotificationTemplateName, number> = {
  internal_new_partner_needs_review: 240,
  internal_high_risk_partner_flagged: 60,
  internal_lead_submitted: 120,
  internal_duplicate_detected: 240,
  internal_sync_failure: 30,
  internal_admin_decision_needed: 120,
  partner_submission_received_for_review: 1440,
};

export function suppressionKey(input: NotificationRuleInput): string {
  return [input.template, input.entity_type, input.entity_id, input.recipient ?? "internal"].join(":");
}

export function isSuppressed(input: NotificationRuleInput, now = new Date()): { suppressed: boolean; reason?: string } {
  const template = TEMPLATES[input.template];

  if (input.record_status === "archived") return { suppressed: true, reason: "record_archived" };
  if (template.partner_facing && !input.partner_facing_enabled) return { suppressed: true, reason: "partner_facing_disabled" };
  if (!input.recipient && template.partner_facing) return { suppressed: true, reason: "missing_partner_recipient" };

  if (input.last_sent_at) {
    const ageMinutes = (now.getTime() - new Date(input.last_sent_at).getTime()) / 60000;
    if (ageMinutes < SUPPRESSION_WINDOWS_MINUTES[input.template]) {
      return { suppressed: true, reason: "suppression_window_active" };
    }
  }

  return { suppressed: false };
}

export function assertSafeNotificationLanguage(text: string): void {
  const blocked = [
    "guaranteed approval",
    "everyone qualifies",
    "instant funding",
    "guaranteed commission",
    "approved for funding",
    "lender approved",
  ];
  const lower = text.toLowerCase();
  const found = blocked.find((phrase) => lower.includes(phrase));
  if (found) throw new Error(`Unsafe notification language detected: ${found}`);
}
