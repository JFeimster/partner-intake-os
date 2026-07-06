# Partner Watchlist Flow

## Purpose

Route not-ready partners into a nurture/watchlist lane instead of rejecting them outright or wasting admin time.

Some partners are bad fits. Some are baby deer with a LinkedIn profile. Different treatment.

## Trigger

A partner is classified as:

- `partner_tier: tier_4`
- `onboarding_path: nurture_watchlist`
- `onboarding_path: education_first_partner`
- `status: watchlist`
- `recommended_decision: nurture`
- Low information but not clearly risky
- Relevant audience but low activation readiness

## Inputs

- Partner profile
- Scorecard
- Risk flags
- Audience detail
- Current tools
- Desired partner role
- Missing fields
- Recommended education-first resources
- Admin notes

## Steps

1. Intake workflow classifies partner as not ready.
2. Workflow confirms they are not high-risk/reject.
3. Status changes to `watchlist`.
4. Missing information is recorded.
5. Education-first resource pack is assigned.
6. Optional “request more info” message is drafted.
7. Recheck date is set.
8. CRM/storage record is updated.
9. Future dashboard displays watchlist status.
10. Partner can later be upgraded if they provide better details or generate activity.

## Outputs

- Watchlist status
- Missing info list
- Nurture resource pack
- Recheck date
- Admin note
- Optional request-more-info draft
- Upgrade criteria

## Systems touched

- Storage router
- Notion database/status/view
- HubSpot lifecycle stage/task
- Google Sheets watchlist columns
- Future dashboard watchlist lane
- Future email/nurture automation

## Failure handling

| Failure | Handling |
|---|---|
| Missing email | Store only if allowed; do not send. |
| Unclear risk | Route to manual review instead of watchlist. |
| No resource match | Assign general education-first pack. |
| Duplicate watchlist record | Update existing record. |
| Recheck task fails | Keep `recheck_due_date` in system of record. |

## Human review rules

Manual review is required before moving a watchlist partner to approved when:

- Their audience source is still unclear.
- They provide deal-flow claims without support.
- They mention risky marketing tactics.
- They request advanced partner access.
- They want campaign assets before proving fit.

## Fields updated

- `status`
- `partner_tier`
- `onboarding_path`
- `missing_information`
- `recommended_resources`
- `recheck_due_date`
- `upgrade_criteria`
- `next_action`
- `notes`
- `event_type: partner_watchlisted`

## Future improvements

- Add nurture email sequence.
- Add partner self-update form.
- Add watchlist scoring decay/upgrade logic.
- Add dashboard watchlist filter.
- Add automatic follow-up after recheck date.
- Add “graduate to approved” admin action.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
