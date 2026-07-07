# Webhook Signing

## Signing model

Outbound webhook payloads should be signed with HMAC SHA-256.

Recommended header:

```http
X-Partner-Intake-Signature: t=1720000000,v1=<hex_signature>
```

Signing payload:

```text
<timestamp>.<raw_body>
```

## Verification steps

1. Parse timestamp and signature.
2. Reject stale timestamps.
3. Compute expected signature.
4. Compare using timing-safe equality.
5. Reject mismatches.

## Secret handling

- Never commit webhook secrets.
- Rotate secrets per partner integration.
- Store hashed/metadata only where practical.
- Do not share secrets in GPT Actions or static pages.
