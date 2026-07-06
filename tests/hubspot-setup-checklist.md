# HubSpot Setup Checklist

Use this pass/fail checklist before enabling live HubSpot sync for Partner Intake OS.

## Basic setup

| Test | Pass/Fail | Notes |
|---|---|---|
| HubSpot private app exists |  |  |
| `HUBSPOT_ACCESS_TOKEN` stored in Vercel only |  |  |
| Token is not committed to GitHub |  |  |
| Partner Intake Pipeline exists |  |  |
| Pipeline stages match setup guide |  |  |
| Contact custom properties exist |  |  |
| Company custom properties exist |  |  |
| Deal custom properties exist |  |  |

## Property validation

| Test | Pass/Fail | Notes |
|---|---|---|
| `partner_id` exists on contact |  |  |
| `partner_id` exists on deal |  |  |
| `partner_type` options match internal enum |  |  |
| `partner_tier` options match internal enum |  |  |
| `onboarding_path` options match internal enum |  |  |
| `risk_level` options are low/medium/high |  |  |
| `partner_status` options match status model |  |  |
| `manual_review_required` is boolean |  |  |
| `partner_score` is numeric |  |  |
| `last_partner_intake_sync` is date/time |  |  |

## Pipeline validation

| Test | Pass/Fail | Notes |
|---|---|---|
| New Intake stage works |  |  |
| Needs Review stage works |  |  |
| Missing Info stage works |  |  |
| Approved stage works |  |  |
| Onboarding stage works |  |  |
| Active Partner stage works |  |  |
| Watchlist stage works |  |  |
| Rejected stage works |  |  |
| Archived stage works |  |  |
| High-risk record does not auto-activate |  |  |
| Tier 1 record creates review/follow-up |  |  |

## Sync tests

| Test | Pass/Fail | Notes |
|---|---|---|
| Broker sample syncs |  |  |
| CPA/bookkeeper sample syncs |  |  |
| Business attorney sample syncs |  |  |
| Business broker sample syncs |  |  |
| Veteran/community connector sample syncs |  |  |
| Affiliate/content creator sample syncs |  |  |
| Contact association works |  |  |
| Company association works |  |  |
| Deal association works |  |  |
| Duplicate email updates existing contact |  |  |
| Duplicate domain updates existing company |  |  |
| Duplicate Partner ID does not create extra active deal |  |  |

## Task/activity validation

| Test | Pass/Fail | Notes |
|---|---|---|
| Admin Review task created |  |  |
| Tier 1 Follow-Up task created |  |  |
| Missing Info task created |  |  |
| Risk Review task created |  |  |
| Onboarding Kickoff task created |  |  |
| GPT review note created |  |  |
| Decision note template works |  |  |
| Sync note template works |  |  |

## Security and compliance

| Test | Pass/Fail | Notes |
|---|---|---|
| No API keys in HubSpot notes |  |  |
| No webhook secrets in HubSpot notes |  |  |
| No private keys in HubSpot properties |  |  |
| No guaranteed approval language |  |  |
| No guaranteed funding amount claims |  |  |
| No credit repair positioning |  |  |
| No fake lender certainty |  |  |
| Rejected records do not receive onboarding automations |  |  |

## Final readiness

- [ ] All required properties created.
- [ ] Pipeline created and tested.
- [ ] Dedupe behavior confirmed.
- [ ] Sample syncs tested.
- [ ] Task creation tested.
- [ ] Activity notes tested.
- [ ] Security review passed.
- [ ] HubSpot sync can be enabled for approved/review-worthy records.
