# Rate Limit Policy

## Default policies

| Endpoint | Window | Limit | Notes |
|---|---:|---:|---|
| `/api/tally/partner-intake-webhook` | 60s | 120 | Tally bursts are possible; signature should still be verified. |
| `/api/leads/submit` | 60s | 20 | Partner-facing lead submission. |
| `/api/tracking/log-event` | 60s | 120 | Safe event logging only. |
| `/api/partners/classify` | 60s | 30 | GPT/API classification endpoint. |

## Limit key

Preferred rate limit key priority:

1. Authenticated partner ID
2. API token hash
3. Tally source/form ID
4. Anonymized IP hash
5. Request path fallback

## Response

Use HTTP `429`:

```json
{
  "error": "rate_limited",
  "message": "Too many requests. Please retry later.",
  "retry_after_seconds": 60
}
```

## Storage

Local/dev: in-memory map.

Production: use Postgres, Redis, KV, or provider edge config. Do not rely on memory across serverless instances for production enforcement.
