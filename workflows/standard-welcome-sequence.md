# Standard Welcome Sequence Workflow

## Purpose

Send or queue a practical welcome sequence for approved Tier 2 and Tier 3 partners with resource links, expectations, and next steps.

This is for useful but not yet elite partners. Give them enough structure to move, not a 47-step onboarding swamp.

## Trigger

A partner is approved with:

- `partner_tier: tier_2` or `partner_tier: tier_3`
- `risk_level: low` or `medium`
- `status: approved`
- `onboarding_path` is one of:
  - `standard_affiliate_partner`
  - `referral_only_partner`
  - `education_first_partner`
  - `standard_onboarding`

## Inputs

- Partner profile
- Approved partner type
- Onboarding path
- Recommended resources
- Recommended campaign
- Tracking/partner ID placeholder if available
- Admin approval note
- Preferred communication channel if captured

## Steps

1. Partner status changes to `approved`.
2. Workflow checks risk flags and onboarding path.
3. Resource pack is selected based on partner type/audience.
4. Campaign kit is selected or queued for generation.
5. Welcome message is drafted or sent depending on approval setting.
6. Partner is given next step:
   - review resource pack
   - submit first lead
   - schedule onboarding call
   - launch first campaign
   - complete funding readiness training
7. CRM/storage record is updated.
8. Follow-up reminder is scheduled.
9. Dashboard access placeholder is set if applicable.

## Outputs

- Welcome email/message draft
- Resource pack assignment
- Campaign kit assignment
- Partner next action
- CRM note
- Follow-up task
- Dashboard checklist seed data

## Systems touched

- HubSpot contact/task/deal
- Notion partner record
- Google Sheets row
- Gmail or email platform through automation tool
- n8n/Activepieces
- Future Partner Command Center dashboard

## Failure handling

| Failure | Handling |
|---|---|
| Missing email | Do not send; set `next_action: request_contact_info`. |
| Missing recommended resources | Route to default education-first pack. |
| Medium risk flag | Queue welcome draft for human approval, do not auto-send. |
| Email send failure | Log failure and create manual task. |
| Duplicate welcome | Do not resend unless admin forces restart. |

## Human review rules

Require human approval before sending when:

- Partner has medium risk flags.
- Partner is a broker/ISO with aggressive claims.
- Partner asks for commission language that has not been approved.
- Partner serves a sensitive or regulated niche.
- Partner communication needs custom terms.

## Fields updated

- `status`
- `onboarding_path`
- `recommended_resources`
- `recommended_campaigns`
- `welcome_sequence_status`
- `welcome_sent_at`
- `next_action`
- `follow_up_due_date`
- `dashboard_access_status`
- `notes`

## Future improvements

- Add segmented email sequences by partner type.
- Add partner portal checklist sync.
- Add first-lead milestone trigger.
- Add automated reminder if no activity in seven days.
- Add campaign attribution fields.
- Add lead submission CTA once Batch 18 exists.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
