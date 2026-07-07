# Safe IP Handling Policy

## Principle

Use IP addresses only for operational security, rate limiting, abuse prevention, and debugging. Do not use them for invasive tracking or partner profiling.

## Recommended storage

Store an HMAC hash of the IP address, not the raw IP:

```text
ip_hash = HMAC_SHA256(IP, SERVER_SIDE_SECRET)
```

## Retention

Suggested:

- Raw IP: avoid storage where possible.
- IP hash: 30-90 days for rate limit/abuse review.
- Aggregated rate-limit counters: expire automatically.

## Headers

When behind Vercel/proxies, read forwarded headers carefully:

- `x-forwarded-for`
- `x-real-ip`
- provider request metadata

Only trust proxy headers from your known deployment environment.
