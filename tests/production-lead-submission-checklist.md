# Production Lead Submission Checklist

## Files

- [ ] `/lead-submission/*`
- [ ] `/lib/leads/*`
- [ ] `/api/leads/submit.ts`
- [ ] `/api/leads/[lead_id].ts`
- [ ] `/api/admin/leads/[lead_id]/decision.ts`

## Validation

- [ ] Submit endpoint preserves review-based language.
- [ ] Missing consent routes to manual review.
- [ ] Duplicate detection creates duplicate key.
- [ ] Sensitive-data references create flags.
- [ ] Operator notes are sanitized.
- [ ] No notifications are sent in this batch.
- [ ] No lender/funding approval certainty appears in responses.

## Example curl

```powershell
curl -X POST "$env:VERCEL_URL/api/leads/submit" `
  -H "Content-Type: application/json" `
  -d '{"partner_id":"ptr_demo","business_name":"Demo HVAC LLC","email":"owner@example.test","consent_to_contact":true,"consent_source":"partner referral","consent_timestamp":"2026-07-06T17:00:00Z"}'
```
