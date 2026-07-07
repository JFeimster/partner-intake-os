# Tracking Analytics Checklist

## Files

- [ ] `/tracking/attribution-model.md`
- [ ] `/tracking/event-taxonomy.md`
- [ ] `/tracking/campaign-reporting.md`
- [ ] `/lib/tracking/*`
- [ ] `/api/tracking/summary.ts`
- [ ] `/api/tracking/campaigns.ts`
- [ ] `/api/tracking/partner/[partner_id]/summary.ts`

## Validation

- [ ] Only safe events are allowed.
- [ ] Metadata sanitizer removes IP/fingerprint/borrower-sensitive/payout fields.
- [ ] Summaries do not include commission calculations.
- [ ] API endpoints require admin token.
- [ ] Storage remains compatible with Batch 31 `tracking_events`.
- [ ] Reporting copy avoids guaranteed outcomes.
