# E2E Tally → Review Queue Checklist

Use this as the manual pass/fail log for Phase 29.

## Environment

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Correct branch deployed |  |  |
| `PARTNER_INTAKE_ACTION_TOKEN` set |  |  |
| `PARTNER_ADMIN_TOKEN` set |  |  |
| `PARTNER_INTAKE_STORAGE_MODE=mock` for first pass |  |  |
| `PARTNER_INTAKE_DRY_RUN=true` for first pass |  |  |
| `TALLY_SIGNING_SECRET` intentionally unset or tested with valid signature |  |  |
| No real PII in fixture payloads |  |  |

## Endpoint smoke tests

| Test | Expected | Pass/Fail | Notes |
| --- | --- | --- | --- |
| `GET /api/health` | 200 |  |  |
| `POST /api/tally/partner-intake-webhook` valid fixture | 202 |  |  |
| `POST /api/tally/partner-intake-webhook` malformed fixture | 400 |  |  |
| `POST /api/partners/classify` good token | 200 |  |  |
| `POST /api/partners/classify` bad token | 401 |  |  |
| `GET /api/admin/review-queue` no token | 401 |  |  |
| `GET /api/admin/review-queue` admin token | 200 |  |  |

## Required case results

| Case ID | Expected result | Pass/Fail | Notes |
| --- | --- | --- | --- |
| `tier1-strategic-partner` | Tier 1 / manual review |  |  |
| `tier2-broker` | Tier 2 / broker review |  |  |
| `cpa-bookkeeper` | Tier 2 / standard review |  |  |
| `business-attorney` | Tier 2 / standard review |  |  |
| `veteran-community-connector` | Tier 3 / nurture path |  |  |
| `content-creator-affiliate` | Tier 3 / disclosure review |  |  |
| `low-info-signup` | Needs info |  |  |
| `high-risk-lead-seller` | Block/watchlist review |  |  |
| `duplicate-submission` | Duplicate-safe review |  |  |
| `malformed-payload` | 400 / not created |  |  |

## Logging checks

| Check | Pass/Fail | Notes |
| --- | --- | --- |
| Logs show route/status/request ID only |  |  |
| Logs do not show raw Tally payloads |  |  |
| Logs do not show real emails or phones |  |  |
| Logs do not show bank/tax/private document data |  |  |
| Script result file is redacted |  |  |

## Review queue checks

| Check | Pass/Fail | Notes |
| --- | --- | --- |
| Queue requires admin auth |  |  |
| Queue distinguishes sample vs real data |  |  |
| Queue shows manual-review posture |  |  |
| High-risk lead seller is not activated |  |  |
| Low-info signup is routed to needs-info |  |  |
| Duplicate is not treated as a clean new active record |  |  |

## Storage / sandbox checks

| Check | Pass/Fail | Notes |
| --- | --- | --- |
| First pass uses mock storage |  |  |
| Sandbox Notion sync is optional and explicitly enabled |  |  |
| Sandbox HubSpot sync is optional and explicitly enabled |  |  |
| No production CRM writes happened during fixture test |  |  |
| Dry-run mode remained enabled unless intentionally disabled |  |  |

## Release gate

Do not proceed to Phase 30 until:

- [ ] All valid fixtures return expected 2XX behavior.
- [ ] Malformed payload returns expected 400 behavior.
- [ ] Bad auth fails.
- [ ] Admin review queue is protected.
- [ ] No logs contain raw payloads or sensitive data.
- [ ] Duplicate behavior is documented.
- [ ] Manual review triggers match expected outcomes.

## Operator sign-off

```text
Tester:
Date:
Environment:
Base URL:
Result: PASS / FAIL
Blocking issues:
Proceed to Phase 30: YES / NO
```
