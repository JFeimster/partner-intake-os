# Phase 29 — End-to-End Tally → API → Review Queue Test

This packet validates the full Partner Intake OS intake path from a Tally-style submission into the Vercel API layer and then into the admin review workflow.

## Scope

Phase 29 tests the flow. It does not create a new production database, rewrite the admin dashboard, activate partner accounts, approve partners, route leads to lenders, or promise commissions.

## Intended flow

```text
Tally form submission
  → POST /api/tally/partner-intake-webhook
  → normalize intake fields
  → classify / score / tier partner
  → apply risk rules
  → create or confirm review queue posture
  → optional Notion / HubSpot sandbox sync
  → verify admin review queue route
```

## Files

```text
/e2e/README.md
/e2e/tally-to-review-queue-runbook.md
/e2e/e2e-test-matrix.md
/e2e/sample-tally-e2e-payloads.json
/e2e/expected-review-queue-results.json
/e2e/failure-scenarios.md
/e2e/manual-review-triggers.md
/scripts/run-e2e-tally-review-test.ps1
/tests/e2e-tally-review-checklist.md
```

## Systems touched

| System | Role in test | Write posture |
| --- | --- | --- |
| Tally | Source payload shape | Use fixture payloads first |
| Vercel API | Webhook + classification route | Live endpoint test allowed during window |
| Storage router | Optional sync mode validation | `mock` or sandbox only |
| Notion | Optional staging database | Sandbox only |
| HubSpot | Optional CRM mirror | Sandbox only |
| Admin review API | Queue visibility check | Sample/internal data only |

## Required environment variables

```text
PARTNER_INTAKE_ACTION_TOKEN=
PARTNER_ADMIN_TOKEN=
PARTNER_INTAKE_STORAGE_MODE=mock
PARTNER_INTAKE_DRY_RUN=true
TALLY_SIGNING_SECRET=
```

For first pass, leave `TALLY_SIGNING_SECRET` unset unless you are explicitly testing signature behavior.

## No-real-PII rule

Use only the sample payloads in this packet. Do not test with real partner emails, borrower data, business financial data, bank information, tax IDs, documents, private notes, or credentials.

## Pass criteria

1. Webhook returns expected HTTP status.
2. Normalized payload includes only safe fields.
3. Classification returns expected partner direction.
4. Risk/manual-review posture matches expected outcome.
5. Storage mode remains `mock` or sandbox.
6. Admin review queue is protected by admin auth.
7. No raw payloads or sensitive data appear in logs.

## Recommended sequence

1. Run local/sandbox endpoint tests with fixture payloads.
2. Confirm webhook behavior.
3. Confirm classification behavior.
4. Confirm review queue access control.
5. Only then test a real Tally sandbox submission.

Do not proceed to internal launch QA until this packet passes. ⚙️
