# Production Lead Submission Routing

Batch 36 refines lead submission for production review patterns without breaking Batch 27 compatibility.

## Flow

1. Partner submits lead.
2. API validates required fields.
3. Consent policy is checked.
4. Duplicate detection runs.
5. Sensitive-data flags are detected.
6. Routing assigns manual review when needed.
7. Lead is stored with review-based status.
8. Response says `received for review`.

## Statuses

- `received_for_review`
- `needs_info`
- `manual_review_required`
- `accepted_for_processing`
- `rejected`
- `paused`
- `archived`

## Safe response language

Use:

- "received for review"
- "manual review required"
- "funding options may vary"

Never imply lender review, approval, funding certainty, terms, rates, commissions, or timelines.
