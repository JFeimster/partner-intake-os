# Phase 23 — API Endpoint Repair Checklist

Use this checklist after copying Phase 23 files into the repo.

## Repo and file checks

| Check | Pass/Fail | Notes |
|---|---|---|
| `/api/health.ts` exists |  |  |
| `/api/partners/classify.ts` exists |  |  |
| `/api/partners/recommend-resources.ts` exists |  |  |
| `/api/partners/generate-onboarding-plan.ts` exists |  |  |
| `/api/partners/generate-campaign-kit.ts` exists |  |  |
| `/api/partners/log-event.ts` exists |  |  |
| `/api/tally/partner-intake-webhook.ts` exists |  |  |
| `/lib/http.ts` exists |  |  |
| `/lib/validation.ts` exists |  |  |
| `/lib/request-id.ts` exists |  |  |
| `/lib/errors.ts` exists |  |  |
| `/lib/cors.ts` exists |  |  |

## Method guards

| Test | Expected | Pass/Fail |
|---|---|---|
| `GET /api/health` | 200 |  |
| `POST /api/health` | 405 |  |
| `GET /api/partners/classify` | 405 |  |
| `POST /api/partners/classify` | 200 with valid auth |  |
| `GET /api/tally/partner-intake-webhook` | 405 |  |

## Auth checks

| Test | Expected | Pass/Fail |
|---|---|---|
| Missing Bearer token on classify | 401 |  |
| Bad Bearer token on classify | 403 |  |
| Valid Bearer token on classify | 200 |  |
| Tally webhook without Bearer token | 202 if no signing secret configured |  |
| Tally webhook with missing signature when secret configured | 401 |  |

## Validation checks

| Test | Expected | Pass/Fail |
|---|---|---|
| Invalid JSON body | 400 |  |
| Empty classify body | 200 low-info classification or validation warning, depending route context |  |
| High-risk lead seller language | manual review / reject risk path |  |
| Sensitive terms in payload | risk flag |  |
| Low-info intake | watchlist or request more context |  |

## Response shape

| Check | Pass/Fail | Notes |
|---|---|---|
| Every response includes `ok` |  |  |
| Every success response includes `request_id` |  |  |
| Every error response includes `error.code` |  |  |
| Every error response includes `error.message` |  |  |
| Every error response includes `error.request_id` |  |  |
| API responses set `Cache-Control: no-store` |  |  |

## Compliance checks

| Check | Pass/Fail | Notes |
|---|---|---|
| No endpoint returns “approved” as a funding decision |  |  |
| No endpoint says “guaranteed funding” |  |  |
| No endpoint says “everyone qualifies” |  |  |
| No endpoint logs or echoes raw sensitive PII |  |  |
| Lead/funding copy is readiness/review based |  |  |

## GPT Action checks

| Check | Pass/Fail | Notes |
|---|---|---|
| GPT endpoints require Bearer token |  |  |
| Tally webhook is not in OpenAPI Actions |  |  |
| Operation IDs remain compatible with action pack |  |  |
| Bad token test documented |  |  |

## Storage checks

| Check | Pass/Fail | Notes |
|---|---|---|
| Storage writes are stubbed |  |  |
| Response indicates storage mode |  |  |
| No Notion token hardcoded |  |  |
| No HubSpot token hardcoded |  |  |
