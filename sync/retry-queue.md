# Retry Queue

The retry queue is for safe recovery, not blind hammering.

## Retry states

- `queued`
- `running`
- `succeeded`
- `failed_retryable`
- `failed_terminal`
- `needs_review`
- `paused`

## Backoff policy

| Attempt | Delay |
|---:|---|
| 1 | 5 minutes |
| 2 | 15 minutes |
| 3 | 1 hour |
| 4 | 4 hours |
| 5 | 24 hours |
| 6+ | terminal unless admin retries |

## Retryable failures

- Provider timeout
- HTTP 429 rate limit
- HTTP 500/502/503/504
- temporary DNS/network failure
- provider maintenance

## Terminal failures

- HTTP 401 or 403
- missing required field
- invalid external object ID
- field locked conflict
- malformed payload after normalization
- detected sensitive-data policy violation

## Operator requirements

Each manual retry should capture:

- admin/operator ID
- reason
- target system
- previous error
- timestamp
- audit-log reference
