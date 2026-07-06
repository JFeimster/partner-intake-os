# Partner Approved Flow

## Purpose

Move an approved partner from intake/review into activation: dashboard access placeholder, onboarding checklist, resources, campaign kit, and first action.

Approval is not confetti. Approval is a work order. 🎯

## Trigger

Admin or approved automation sets:

- `status: approved`
- `manual_review_required: false`
- `risk_level: low` or accepted `medium`
- `recommended_decision: approve` or `approve_with_restrictions`

## Inputs

- Partner profile
- Admin approval note
- Partner tier
- Onboarding path
- Resource recommendations
- Campaign recommendations
- Dashboard contract payload
- Storage record link
- Partner ID/tracking ID placeholder

## Steps

1. Confirm approval decision.
2. Validate minimum required fields:
   - email
   - partner type
   - partner tier
   - onboarding path
   - next action
3. Set partner lifecycle status to `activated_pending`.
4. Create onboarding checklist.
5. Assign recommended resources.
6. Assign campaign kit or queue generation.
7. Set dashboard access placeholder:
   - `dashboard_access_status: pending`
8. Create first follow-up task.
9. Add CRM/admin note.
10. Trigger standard welcome sequence where allowed.
11. Update future dashboard payload.

## Outputs

- Activated partner status
- Onboarding checklist
- Resource assignment
- Campaign assignment
- Dashboard access placeholder
- Follow-up task
- Welcome sequence trigger
- CRM note/event

## Systems touched

- Partner Intake OS storage
- HubSpot contact/company/deal/task
- Notion partner database
- Google Sheets partner tracker
- Future dashboard module
- Future email/notification automation

## Failure handling

| Failure | Handling |
|---|---|
| Required fields missing | Keep `status: approved_pending_info`. |
| Resource assignment fails | Approve partner but mark resources pending. |
| Campaign generation fails | Use default campaign placeholder. |
| Dashboard access not available | Set placeholder only; do not block approval. |
| Welcome sequence fails | Create manual send task. |

## Human review rules

Human approval is always required when:

- Partner is Tier 1.
- Partner had medium/high risk flags.
- Partner gets approved with restrictions.
- Partner needs custom commission/process expectations.
- Partner is a vendor/strategic integration partner.
- Partner will receive co-branded assets.

## Fields updated

- `status`
- `approved_at`
- `approved_by`
- `activation_status`
- `dashboard_access_status`
- `onboarding_checklist`
- `recommended_resources`
- `recommended_campaigns`
- `next_action`
- `follow_up_due_date`
- `event_type: partner_approved`

## Future improvements

- Create actual authenticated dashboard access.
- Add partner ID and tracking link generation.
- Add automated first-lead milestone tracking.
- Add partner score recalculation after activity.
- Add approval restrictions field.
- Add partner agreement/esign workflow.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
