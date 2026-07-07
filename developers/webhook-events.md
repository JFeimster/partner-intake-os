# Webhook Events

## Safe public webhook events

- `partner.created`
- `partner.review_required`
- `partner.onboarding_ready`
- `lead.received`
- `lead.needs_info`
- `tracking.link_created`
- `campaign.generated`
- `resource.recommended`

## Prohibited events

Do not expose admin-only events, audit-log internals, payout/commission details, lender submission details, borrower sensitive data, API keys, tokens, or private notes.

## Event envelope

```json
{
  "event_id": "evt_01H...",
  "event_type": "partner.review_required",
  "created_at": "2026-07-06T12:00:00.000Z",
  "data": {
    "partner_id": "ptr_123",
    "status": "needs_review"
  }
}
```

## Delivery behavior

- Sign all outbound webhooks.
- Retry retryable failures with backoff.
- Stop after terminal failures.
- Never include sensitive borrower data.
