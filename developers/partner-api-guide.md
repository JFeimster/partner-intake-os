# Partner API Guide

## Purpose

The Partner API lets approved integrations receive safe partner-ops events and submit limited partner workflow actions.

## MVP endpoints

- `POST /api/developers/webhooks/register`
- `GET /api/developers/events`

## Safe event model

Events are operational. They do not guarantee funding, lender review, approvals, commissions, income, timelines, or business outcomes.

## Example registration

```json
{
  "destination_url": "https://example.com/webhooks/partner-intake",
  "events": ["partner.review_required", "lead.received"],
  "description": "Demo partner ops integration"
}
```

## Example event fetch

```powershell
curl -H "Authorization: Bearer $env:PARTNER_DEVELOPER_API_KEY" \
  http://localhost:3000/api/developers/events
```
