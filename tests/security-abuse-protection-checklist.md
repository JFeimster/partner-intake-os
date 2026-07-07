# Security Abuse Protection Checklist

## Files

- [ ] `/security/README.md`
- [ ] `/security/rate-limit-policy.md`
- [ ] `/security/abuse-detection.md`
- [ ] `/security/spam-rules.md`
- [ ] `/security/ip-handling-policy.md`
- [ ] `/security/idempotency-policy.md`
- [ ] `/lib/security/*`
- [ ] `/api/security/health.ts`

## Validation

- [ ] Protected endpoints are listed.
- [ ] Rate limit keys are hashed.
- [ ] IP handling avoids raw IP storage by default.
- [ ] Honeypot fields are documented and detected.
- [ ] Duplicate payload hash uses safe canonical payload.
- [ ] No fingerprinting is introduced.
- [ ] No single third-party service is required.
- [ ] Severe abuse returns block/quarantine recommendation.
