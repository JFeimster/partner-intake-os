# Tracking Attribution Model

Batch 37 turns tracking links into safe partner/campaign summaries.

## Safe attribution

Track only operational attribution events:

- `link_created`
- `click`
- `lead_started`
- `lead_submitted`
- `manual_review`
- `partner_resource_opened`
- `campaign_kit_viewed`

## Not allowed

- fingerprinting
- cross-site identity graphs
- sensitive borrower behavior tracking
- payout or commission calculation
- hidden behavioral profiling

## Attribution hierarchy

1. partner ID
2. campaign ID
3. tracking link ID
4. source
5. medium
6. safe event type

## Source of truth

Store event records in Postgres/database layer from Batch 31. HubSpot/Notion can display summaries, not act as attribution truth.
