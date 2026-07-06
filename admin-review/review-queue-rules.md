# Review Queue Rules

## Queue priority rules

Priority order:

1. Tier 1 strategic partner with high score
2. High-risk partner or suspicious lead seller
3. Missing-info signup blocking classification
4. Tier 2 broker/referral partner ready for approval
5. Partner with stale pending status
6. Tier 3 affiliate or creator needing activation proof
7. Watchlist/nurture partner
8. General non-fit or rejected record

## Tier 1 handling

Tier 1 partners should not be auto-approved. They deserve speed, not sloppiness.

Route Tier 1 records to Jason/admin when:

- score is 85+
- strategic leverage is high
- integration or co-marketing is possible
- partner owns a strong audience or distribution channel
- contract, rev-share, or brand alignment needs review

## High-risk handling

High-risk records require manual review before activation.

Common high-risk flags:

- bulk lead seller
- unclear consent
- aggressive funding claims
- fake urgency
- invented lender certainty
- credit repair positioning
- suspicious referral source
- unverifiable audience
- duplicate or mismatched identity

## Missing-info handling

Request more information when required fields are missing:

- company
- email
- partner role
- audience
- website/social proof
- referral source
- funding or client context

Do not guess partner tier from smoke and vibes.

## Duplicate handling

Check duplicates by:

- email
- company domain
- phone
- partner_id
- company name
- similar website/social handle

If duplicate exists, merge notes into the existing record or flag for review.

## Stale record handling

A record becomes stale when:

- no owner action after 7 days
- missing info not answered after 14 days
- watchlist partner inactive after 30 days
- approved partner does not activate after 30 days

Recommended stale actions:

- send reminder
- move to nurture
- archive
- schedule manual review

## Manual review triggers

Manual review is required when:

- risk_level is medium or high
- manual_review_required is true
- partner_tier is tier_1 or reject
- score is below 40 or above 85
- partner_type is unknown
- legal/compliance copy risk appears
- lead source or consent is unclear

## Escalation rules

Escalate to Jason/admin when:

- strategic partnership opportunity exists
- partner asks for custom terms
- partner wants API/integration access
- high-risk claims appear
- sensitive relationship risk exists
- public co-branding is proposed
