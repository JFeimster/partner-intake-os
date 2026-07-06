# Tier 1 Partner Alert Workflow

## Purpose

Alert Jason/admin when a new partner looks strategically valuable enough to warrant fast human follow-up.

Tier 1 partners are not “send a generic welcome email and pray” partners. They may be brokers with existing flow, CPAs/bookkeepers with trusted SMB access, business brokers, veteran/community connectors, fintech vendors, or channel partners with leverage.

## Trigger

A partner intake is classified with one or more of the following:

- `partner_tier: tier_1`
- `overall_score >= 85`
- `strategic_value_score >= 8`
- `referral_volume_estimate` indicates meaningful deal flow
- `partner_type` is `strategic_partner`, `fintech_vendor_partner`, `business_broker`, `funding_broker`, or high-quality `center_of_influence`
- Admin/GPT flags as “priority review”

## Inputs

- Partner profile
- Partner scorecard
- Risk flags
- Referral volume estimate
- Audience description
- Desired partner role
- Current tools
- Recommended next action
- Storage record URL if available

## Steps

1. Intake workflow finishes classification.
2. Workflow checks score and tier.
3. Workflow confirms risk level is not `high` unless the alert is for risk review.
4. Alert payload is created for Jason/admin.
5. Follow-up task is created in the selected system:
   - HubSpot task
   - Notion task/status field
   - Google Sheet row flag
   - n8n/Activepieces notification
6. Optional notification is sent to Slack, Gmail, or another internal channel.
7. Partner status changes to `priority_review`.
8. Admin reviews the partner and chooses:
   - approve fast-track
   - request more info
   - schedule call
   - assign campaign kit
   - reject/manual risk review

## Outputs

- Tier 1 alert
- Admin follow-up task
- Partner status update
- Priority review note
- Recommended outreach angle
- Suggested call agenda

## Systems touched

- Vercel API output
- Storage router
- HubSpot task/contact/company record
- Notion partner database
- Google Sheets review column
- Slack/Gmail notification through n8n or Activepieces
- Future dashboard admin queue

## Failure handling

| Failure | Handling |
|---|---|
| Alert channel unavailable | Store task in system of record and retry notification. |
| Missing scorecard | Route to manual classification before alerting. |
| Conflicting risk flags | Alert as `priority_risk_review`, not `priority_approval`. |
| Missing admin owner | Assign default owner: Jason/admin. |
| Duplicate alert | Update existing task instead of creating noise. |

## Human review rules

Tier 1 partners should never be fully approved without human review. High value can still be high liability. Especially watch:

- Large claimed lists with no source detail
- “Guaranteed funding” marketing language
- Broker/ISO partners without process discipline
- Vendor partners asking for technical access
- Partners asking about payouts before fit is clear

## Fields updated

- `partner_tier`
- `status`
- `next_action`
- `owner`
- `priority`
- `review_due_date`
- `alert_sent_at`
- `admin_task_id`
- `manual_review_required`
- `review_notes`

## Future improvements

- Create a Tier 1 dashboard lane.
- Add round-robin assignment if more admins join.
- Add call booking link routing.
- Add CRM stage automation.
- Add score decay if no admin response after a defined window.
- Add partner source attribution for campaign ROI.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
