# Rate Limits + Abuse Protection

Batch 34 adds defensive controls for public and partner-facing endpoints.

## Protected endpoints

- `/api/tally/partner-intake-webhook`
- `/api/leads/submit`
- `/api/tracking/log-event`
- `/api/partners/classify`

## Design

This batch is vendor-neutral. It can run with in-memory fallback during local development and can later move to Postgres, Redis, Vercel KV, Upstash, Cloudflare, or another shared store.

## What this does

- Applies endpoint-level rate limit policies.
- Creates abuse score signals.
- Supports honeypot fields.
- Supports idempotency keys.
- Creates duplicate payload hashes.
- Handles IP data safely.

## What this does not do

- No fingerprinting.
- No invasive tracking.
- No third-party-only dependency.
- No storing complete borrower payloads for abuse checks.
