import { renderTemplate, NotificationTemplateName } from "./templates";
import { assertSafeNotificationLanguage, isSuppressed, NotificationRuleInput } from "./rules";

export interface NotifyInput extends NotificationRuleInput {
  template: NotificationTemplateName;
  data: Record<string, unknown>;
  channels?: Array<"email" | "slack" | "hubspot_task" | "gmail_draft" | "n8n" | "activepieces">;
}

export interface NotifyResult {
  ok: boolean;
  sent: boolean;
  suppressed?: boolean;
  suppression_reason?: string;
  provider?: "stub";
  message?: string;
  rendered?: {
    subject: string;
    body: string;
  };
}

export async function notify(input: NotifyInput): Promise<NotifyResult> {
  const suppression = isSuppressed(input);
  if (suppression.suppressed) {
    return {
      ok: true,
      sent: false,
      suppressed: true,
      suppression_reason: suppression.reason,
      message: "Notification suppressed by policy.",
    };
  }

  const rendered = renderTemplate(input.template, input.data);
  assertSafeNotificationLanguage(`${rendered.subject}\n${rendered.body}`);

  // Provider stubs only. Wire to Resend/SendGrid/HubSpot/Gmail/Slack/n8n/Activepieces later.
  return {
    ok: true,
    sent: false,
    provider: "stub",
    message: "Notification rendered but not sent. Configure a provider adapter to send.",
    rendered,
  };
}
