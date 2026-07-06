# Tally → API → Review Queue Runbook

## Objective

Validate that a partner signup can travel from Tally-style payload to API response to operator review posture without leaking sensitive data, skipping manual review, or creating false approval language.

## Pre-flight checks

- [ ] Test branch deployed to a controlled Vercel preview or explicit production test window.
- [ ] `PARTNER_INTAKE_STORAGE_MODE=mock` for first test.
- [ ] `PARTNER_INTAKE_DRY_RUN=true` for first test.
- [ ] `PARTNER_INTAKE_ACTION_TOKEN` exists in Vercel env vars.
- [ ] `PARTNER_ADMIN_TOKEN` exists if admin review queue endpoint will be tested.
- [ ] `TALLY_SIGNING_SECRET` is unset for fixture tests or configured only when signature validation is being tested.
- [ ] No real PII in fixture payloads.
- [ ] Logs are open in Vercel for safe status inspection only.

## E2E flow

```text
1. Load fixture from /e2e/sample-tally-e2e-payloads.json
2. POST payload to /api/tally/partner-intake-webhook
3. Confirm 2XX for valid fixtures or 400 for malformed fixture
4. Confirm response classification fields
5. POST normalized intake to /api/partners/classify when Bearer token is available
6. Confirm classification/risk/manual-review posture
7. GET /api/admin/review-queue with admin token
8. Confirm admin route is protected and visible only with auth
9. Compare output against /e2e/expected-review-queue-results.json
10. Record pass/fail in /tests/e2e-tally-review-checklist.md
```

## Test command

```powershell
$env:PARTNER_INTAKE_ACTION_TOKEN="dev-partner-intake-token"
$env:PARTNER_ADMIN_TOKEN="dev-admin-token-change-me"

.\scriptsun-e2e-tally-review-test.ps1 `
  -BaseUrl "http://localhost:3000" `
  -ActionToken $env:PARTNER_INTAKE_ACTION_TOKEN `
  -AdminToken $env:PARTNER_ADMIN_TOKEN
```

## Live Vercel command

```powershell
.\scriptsun-e2e-tally-review-test.ps1 `
  -BaseUrl "https://YOUR_VERCEL_DOMAIN.vercel.app" `
  -ActionToken $env:PARTNER_INTAKE_ACTION_TOKEN `
  -AdminToken $env:PARTNER_ADMIN_TOKEN `
  -OutputPath ".\e2eesultsercel-e2e-results.json"
```

## Real Tally sandbox submission

After fixture tests pass:

1. Open Tally form settings.
2. Confirm webhook URL:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
```

3. Submit one fake/sandbox form response.
4. Confirm webhook returned 2XX.
5. Confirm Vercel logs show request ID and status only.
6. Confirm no raw form payloads or real PII in logs.
7. Confirm review queue/manual-review behavior.

## Expected valid webhook response posture

```json
{
  "ok": true,
  "accepted": true,
  "source": "tally",
  "classification": {
    "tier": "tier_2",
    "manual_review_required": true
  },
  "storage": {
    "mode": "mock",
    "written": false
  }
}
```

Exact score values may change as scoring rules evolve. Tier, risk, and manual-review posture matter more than numeric score in this phase.

## Rollback / retry notes

- If webhook returns 500, disable the Tally webhook before more submissions.
- If storage writes happen unexpectedly, reset `PARTNER_INTAKE_STORAGE_MODE=mock` and `PARTNER_INTAKE_DRY_RUN=true`.
- If admin review queue is public without auth, remove the deployment from test rotation and repair Phase 26 before retesting.
- If a duplicate creates multiple live records, stop and add idempotency before production use.
- If logs contain raw payloads, purge logs if possible, rotate test secrets, and repair logging.
