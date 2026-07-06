# GPT Action Error Repair Map

## Purpose

Fast triage for GPT Action import and live-test failures.

## Import errors

| Error pattern | Cause | Repair |
|---|---|---|
| Schema cannot be parsed | YAML indentation or invalid JSON shape | Validate YAML, fall back to `openapi.json` |
| Unknown server URL | Placeholder not replaced | Replace `https://YOUR_VERCEL_DOMAIN.vercel.app` |
| Operation missing | `operationId` typo or endpoint omitted | Restore required operation IDs |
| Auth not recognized | Security scheme mismatch | Use `type: http`, `scheme: bearer` |
| Too many actions shown | Private routes accidentally included | Remove Tally, admin, storage, sync routes |
| Duplicate names | Same schema/operation reused | Rename cleanly and re-import |

## Live test errors

| Status | Meaning | Repair |
|---|---|---|
| 200 | Good | Compare response to fixture |
| 400 | Body validation failed | Check required payload shape |
| 401 | Auth mismatch | Check Bearer token in GPT and Vercel |
| 404 | Route not deployed | Confirm Phase 23 files copied and Vercel deployment succeeded |
| 405 | Wrong method | Use GET for health, POST for partner actions |
| 500 | Server/runtime failure | Check Vercel logs and request ID |

## GPT behavior errors

| Behavior | Cause | Repair |
|---|---|---|
| GPT calls Tally webhook | Webhook exposed in schema or instructions unclear | Remove route and add explicit instruction not to call it |
| GPT gives funding guarantees | Copy guardrails missing or endpoint fixture unsafe | Repair prompt, endpoint copy, and fixtures |
| GPT skips manual review on risky partner | Classification response too optimistic | Add high-risk fixture and adjust API scoring rules |
| GPT sends raw PII in log event | Event schema too permissive or instructions weak | Add “no raw PII in metadata” rule |
| GPT recommends production sync before sandbox | Storage mode not respected | Add storage-mode warning to docs and endpoint responses |

## Required repair sequence

1. Confirm live route with curl.
2. Confirm token with bad-token and good-token tests.
3. Validate OpenAPI import.
4. Test health.
5. Test low-info intake.
6. Test high-risk lead seller.
7. Test normal partner classification.
8. Compare response to fixtures.
9. Update test log.
10. Only then mark release checklist complete.

## Red-line routes

Never expose these in GPT Actions:

```text
/api/tally/partner-intake-webhook
/api/admin/*
/api/storage/*
/api/sync/*
```

The GPT should talk to the controlled Partner Intake OS API layer, not raw intake pipes or admin machinery.
