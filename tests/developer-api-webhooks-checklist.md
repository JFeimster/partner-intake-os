# Developer API + Webhooks Checklist

## Event checks

- [ ] Safe event enum includes required events.
- [ ] Admin-only events are not public.
- [ ] Sensitive borrower data is excluded.
- [ ] Commission/payout fields are excluded.

## Signing checks

- [ ] HMAC SHA-256 signing helper exists.
- [ ] Verification uses timestamp tolerance.
- [ ] Timing-safe comparison is used.
- [ ] Secrets are never committed.

## Endpoint checks

- [ ] Webhook registration requires developer API key.
- [ ] Unsafe event request is rejected.
- [ ] Events endpoint returns safe sample payload only.
- [ ] Retry behavior is documented.
