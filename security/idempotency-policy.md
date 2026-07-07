# Idempotency Policy

## Purpose

Prevent repeated duplicate submissions from creating duplicate partners, leads, events, or review tasks.

## Accepted key

Clients may send:

- `Idempotency-Key`
- `X-Idempotency-Key`

## Server-generated fallback

If no key is provided, generate a duplicate payload hash from stable, non-sensitive fields:

- endpoint path
- partner ID if available
- lead email hash if available
- tracking link ID if available
- event type
- normalized timestamp bucket
- payload safe fields

Do not hash entire raw borrower data into logs. Build a safe canonical payload first.

## Response behavior

If duplicate key is detected:

```json
{
  "ok": true,
  "duplicate": true,
  "message": "Request already received for review.",
  "existing_request_id": "req_123"
}
```
