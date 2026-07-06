# n8n / Activepieces Low-Code Automation Flow

## Purpose

Document the low-code version of Partner Intake OS workflows using n8n or Activepieces as the glue between Tally, Vercel, Notion, HubSpot, Google Sheets, Gmail/Slack, and the future dashboard.

Use low-code for orchestration. Keep scoring/classification logic in the API/GPT system, not scattered across fifty tiny workflow blocks like confetti in a server room.

## Trigger

Primary trigger options:

- Webhook event from Vercel after intake is accepted.
- Scheduled check for new records in Notion/Google Sheets.
- HubSpot property change.
- Manual admin trigger.
- Future dashboard admin button.

## Inputs

- Partner profile JSON
- Partner scorecard
- Risk flags
- Status
- Next action
- Storage object IDs/URLs
- API action outputs
- Admin decision

## Steps

1. Receive trigger from Vercel, Notion, HubSpot, Sheets, or manual run.
2. Validate payload includes `partner_id` and `status`.
3. Branch by partner status:
   - `manual_review`
   - `priority_review`
   - `approved`
   - `watchlist`
   - `rejected`
   - `activated_pending`
4. Branch by risk level.
5. Create/update CRM/storage record.
6. Send internal notification when needed.
7. Create task for admin/follow-up.
8. Queue welcome/resource/campaign sequence where allowed.
9. Log workflow event.
10. Return success/failure metadata.

## Outputs

- Updated storage record
- Notification
- Task
- Optional draft/sent message
- Event log
- Workflow run status

## Systems touched

- n8n or Activepieces
- Vercel API
- Tally-origin intake record
- Notion
- HubSpot
- Google Sheets
- Gmail/Slack/internal notifications
- Future Partner Command Center dashboard

## Failure handling

| Failure | Handling |
|---|---|
| Missing partner ID | Stop run; log invalid payload. |
| Missing status | Route to manual review fallback. |
| CRM sync fails | Continue storage update and queue retry. |
| Notification fails | Log and retry once. |
| Email send blocked | Create draft/manual task instead. |
| High-risk partner | Never auto-send external messages. |

## Human review rules

Manual review must override automation when:

- `manual_review_required: true`
- `risk_level: high`
- `partner_tier: tier_1`
- `recommended_decision: reject`
- Partner wants custom terms
- Partner asks for claims that violate guardrails
- Partner involves integrations/vendor access

## Fields updated

- `workflow_run_id`
- `workflow_status`
- `workflow_last_run_at`
- `automation_source`
- `last_notification_sent_at`
- `task_id`
- `message_status`
- `sync_status`
- `next_action`
- `event_type`

## Recommended low-code branches

1. New partner created
2. Priority review
3. Manual review
4. Approved partner activation
5. Watchlist/nurture
6. Resource assignment
7. Campaign assignment
8. HubSpot sync
9. Notion sync
10. Failed sync retry

## Future improvements

- Add dead-letter queue for failed runs.
- Add workflow observability sheet.
- Add admin approval form.
- Add dashboard buttons that trigger workflows.
- Add partner activity scoring from submitted leads.
- Add versioned workflow exports once implemented.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
