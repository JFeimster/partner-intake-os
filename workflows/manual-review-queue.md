# Manual Review Queue Workflow

## Purpose

Create a controlled review lane for partners who are incomplete, risky, unclear, strategically important, or not ready for automation.

This protects the system from turning “guy with a spreadsheet and legal exposure” into “approved partner.” Machines sort. Humans approve. 🧯

## Trigger

Manual review is triggered when any of these are true:

- `manual_review_required: true`
- `risk_level: high`
- `partner_tier: reject`
- `partner_tier: tier_1`
- Missing contact fields
- Missing audience detail
- Low classification confidence
- Compliance-risk language detected
- Duplicate or suspicious submission
- Strategic/vendor integration request
- Admin manually marks as review-needed

## Inputs

- Partner profile
- Normalized intake
- Scorecard
- Risk flags
- Raw notes
- Source payload reference
- Current status
- Recommended decision
- Recommended next action

## Steps

1. Intake completes classification.
2. Workflow evaluates manual review triggers.
3. Review card is created.
4. Partner status changes to `manual_review`.
5. Record is routed to the review queue.
6. Admin reviews:
   - profile quality
   - audience relevance
   - deal flow claim
   - compliance language
   - strategic value
   - missing data
7. Admin decision is recorded:
   - approve
   - approve with restrictions
   - request more info
   - nurture/watchlist
   - reject
8. Follow-up action is created.
9. Status and notes are synced back to storage.
10. Future dashboard queue displays the result.

## Outputs

- Admin review card
- Recommended decision
- Manual notes
- Review task
- Status update
- Follow-up action
- Risk disposition

## Systems touched

- Vercel API output
- Storage router
- Notion review database/view
- HubSpot task/pipeline stage
- Google Sheets review columns
- n8n/Activepieces task routing
- Future admin dashboard

## Failure handling

| Failure | Handling |
|---|---|
| Review queue unavailable | Keep status as `manual_review` and surface in primary storage. |
| Missing risk flags | Set conservative review requirement. |
| Missing owner | Assign default owner: Jason/admin. |
| Duplicate record | Merge or link records before approval. |
| Admin decision missing | Do not move partner to approved. |

## Human review rules

Manual review should resolve:

- Is this person a real partner or a lead seller in a trench coat?
- Do they have a legitimate audience?
- Is their audience relevant to business funding or business credit readiness?
- Are they making risky claims?
- Do they need education before activation?
- Are they strategic enough for a call?
- Should this partner be rejected, watched, or activated?

## Fields updated

- `status`
- `manual_review_required`
- `risk_level`
- `risk_flags`
- `recommended_decision`
- `review_owner`
- `review_due_date`
- `review_notes`
- `decision`
- `decision_at`
- `next_action`

## Future improvements

- Build admin review dashboard.
- Add approval/reject buttons.
- Add review SLA.
- Add risk taxonomy and reason codes.
- Add automated email drafts for “request more info” and “not a fit.”
- Add audit log for all review decisions.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
