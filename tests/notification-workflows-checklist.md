# Notification Workflows Checklist

## Files

- [ ] `/notifications/README.md`
- [ ] `/notifications/email-templates.md`
- [ ] `/notifications/internal-alert-rules.md`
- [ ] `/notifications/partner-message-rules.md`
- [ ] `/notifications/suppression-policy.md`
- [ ] `/lib/notifications/*`
- [ ] `/api/notifications/send-review-alert.ts`
- [ ] `/api/notifications/send-partner-update.ts`

## Validation

- [ ] Internal alert templates exist.
- [ ] Partner-facing templates are guarded and optional.
- [ ] No SMS implementation exists.
- [ ] No send provider is required.
- [ ] Suppression windows are defined.
- [ ] Unsafe phrases are blocked.
- [ ] Partner-facing copy includes no-guarantee language.
- [ ] Integration notes mention Resend, SendGrid, HubSpot task creation, Gmail drafts, Slack, n8n, and Activepieces.

## Provider notes

Future provider adapters can map `notify()` to:

- Resend email
- SendGrid email
- HubSpot task creation
- Gmail drafts
- Slack webhook/message
- n8n webhook
- Activepieces webhook
