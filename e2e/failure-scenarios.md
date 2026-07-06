# E2E Failure Scenarios

## 1. Webhook returns 404

Likely cause:

- API route is not deployed.
- File path is wrong.
- Vercel project points to the wrong repo/branch.

Action:

1. Confirm `/api/tally/partner-intake-webhook.ts` exists in the deployed branch.
2. Confirm deployment includes API functions.
3. Run `/api/health`.
4. Do not change Tally production webhook until route is stable.

## 2. Webhook returns 400

Likely cause:

- Invalid JSON.
- Tally payload shape changed.
- Raw body parsing issue.

Action:

1. Compare payload with `/e2e/sample-tally-e2e-payloads.json`.
2. Confirm `data.fields[]` exists.
3. Confirm JSON is valid.
4. For malformed-payload test, 400 is expected.

## 3. Webhook returns 401 or 403

Likely cause:

- `TALLY_SIGNING_SECRET` is configured but signature header is missing or wrong.

Action:

1. For fixture testing, unset `TALLY_SIGNING_SECRET`.
2. For signed testing, confirm the header name and signature format.
3. Confirm Vercel env vars were redeployed after changes.

## 4. Webhook returns 500

Likely cause:

- Runtime import path issue.
- TypeScript compile/deploy issue.
- Unexpected payload branch.

Action:

1. Stop test submissions.
2. Check Vercel function logs for stack trace.
3. Confirm logs do not include raw payload or real PII.
4. Repair route before retesting.

## 5. Classification is wrong

Likely cause:

- Tally label map does not match current form fields.
- Intake text does not include expected keywords.
- Scoring rules need tuning.

Action:

1. Review normalized fields.
2. Check label mapping for changed Tally labels.
3. Confirm expected result focuses on posture, not exact score.
4. Add rule tuning in a future scoring batch if needed.

## 6. Duplicate creates multiple active records

Likely cause:

- No idempotency key or response ID dedupe.

Action:

1. Treat `responseId`, `eventId`, `email`, and `company` as dedupe signals.
2. Keep duplicate records in review status only.
3. Do not activate duplicate partner records without operator review.
4. Add persistent idempotency in a later storage/database phase.

## 7. Admin review queue is public

Likely cause:

- Phase 26 auth route not deployed.
- Admin endpoint auth bypass left in demo mode.

Action:

1. Confirm `PARTNER_ADMIN_DEMO_MODE=false` in Vercel production.
2. Confirm missing token returns 401.
3. Confirm bad token returns 401.
4. Do not use admin queue with real data until fixed.

## 8. Storage writes to production by accident

Likely cause:

- `PARTNER_INTAKE_STORAGE_MODE` set to `notion`, `hubspot`, or `dual_sandbox` without sandbox-only credentials.
- `PARTNER_INTAKE_DRY_RUN=false` during a test window.

Action:

1. Pause test submissions.
2. Switch env vars back to:

```text
PARTNER_INTAKE_STORAGE_MODE=mock
PARTNER_INTAKE_DRY_RUN=true
```

3. Manually delete sandbox mistakes only if safe.
4. Never delete production CRM records blindly.

## 9. Logs contain raw PII

Likely cause:

- Debug logging left in API route or script.

Action:

1. Remove raw body logging.
2. Redact email/phone fields in logs.
3. Rotate exposed test secrets if needed.
4. Do not proceed to Phase 30 until fixed.

## 10. Tally webhook retries repeatedly

Likely cause:

- Endpoint does not return 2XX quickly.
- API timeout.
- Signature or validation failure.

Action:

1. Disable webhook temporarily.
2. Repair endpoint response.
3. Add idempotency handling before re-enabling.
4. Replay fixture tests before real Tally test.
