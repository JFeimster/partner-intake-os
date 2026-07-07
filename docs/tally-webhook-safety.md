# Tally Webhook Safety

The Tally webhook is public inbound infrastructure. It is not a GPT Action and should never be imported into Custom GPT Actions.

## Route

```text
POST /api/tally/partner-intake-webhook
```

Implementation file:

```text
api/tally/partner-intake-webhook.ts
```

## Required safety behavior

- Accept only `POST`.
- Verify the Tally signature when `TALLY_SIGNING_SECRET` is configured.
- Use the raw request body for HMAC signature verification.
- Return a fast `2xx` response after accepting and normalizing the payload.
- Never log raw Tally payloads with PII.
- Hand off persistence/sync to a queue or approved storage layer before live production use.
- Keep the webhook out of OpenAPI production GPT specs.

## Current implementation note

The webhook calls `readRawBody(req)` and verifies the signature before parsing JSON. That is the right order.

Important limitation: `lib/http.ts` includes a fallback where `readRawBody(req)` returns `JSON.stringify(req.body)` if the request body has already been parsed into an object. This can break signature verification because the reconstructed JSON string may not byte-match the original payload.

## Vercel body parser guidance

Before live signed-webhook use, confirm the route receives the raw body bytes/string before parsing. If Vercel or middleware parses the body first, signature verification can fail even when the payload is legitimate.

Recommended follow-up when moving to production:

1. Confirm Vercel runtime body behavior for the route.
2. Add a signed Tally test payload.
3. Verify the raw-body signature path with `TALLY_SIGNING_SECRET` enabled.
4. Confirm no raw payload or sensitive PII is logged.
5. Move storage/sync work into approved storage/queue infrastructure.

## Environment variable

```text
TALLY_SIGNING_SECRET
```

Set this before live use. If it is not set, the current route skips signature verification.

## Response language

Webhook responses should stay operational and review-based. Do not return approval, funding, rates, terms, timelines, lender review, commission, income, or specific outcome guarantees.
