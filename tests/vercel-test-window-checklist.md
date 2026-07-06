# Vercel Test Window Checklist

Use this manual checklist during Phase 22.

## Test window metadata

| Field | Value |
|---|---|
| Date |  |
| Operator |  |
| Repo | `JFeimster/partner-command-center` |
| Branch |  |
| Commit SHA |  |
| Vercel project |  |
| Deployment URL |  |
| Environment | Preview / Production |
| Window opened |  |
| Window closed |  |

## Pre-window checks

| Check | Pass/Fail | Notes |
|---|---|---|
| Phase 21 merge validation complete |  |  |
| Working branch confirmed |  |  |
| Repo status clean before deploy |  |  |
| Intended deployment environment confirmed |  |  |
| Vercel project confirmed |  |  |
| No real PII in test payloads |  |  |
| No secrets committed |  |  |
| Rollback path known |  |  |
| Auto-deploy behavior documented |  |  |

## Environment variables

| Variable | Status | Notes |
|---|---|---|
| `PARTNER_INTAKE_ACTION_TOKEN` |  |  |
| `TALLY_SIGNING_SECRET` |  |  |
| `PARTNER_INTAKE_ENV` |  |  |
| `PARTNER_INTAKE_STORAGE_MODE` |  |  |
| `NOTION_API_KEY` |  |  |
| `NOTION_PARTNER_DATABASE_ID` |  |  |
| `HUBSPOT_ACCESS_TOKEN` |  |  |
| `HUBSPOT_PARTNER_PIPELINE_ID` |  |  |
| `PARTNER_BASE_URL` |  |  |
| `PARTNER_SIGNUP_URL` |  |  |
| `PARTNER_LEAD_SUBMISSION_URL` |  |  |
| `TRACKING_BASE_URL` |  |  |

Allowed status values:

```text
set
missing
not used
placeholder only
```

## Static route tests

| Route | Expected | Pass/Fail | Notes |
|---|---|---|---|
| `/site/partner-intake/` | Loads |  |  |
| `/site/partner-intake/submit-lead.html` | Loads |  |  |
| `/site/partner-intake/tracking-link-builder.html` | Loads |  |  |
| `/site/partner-intake/admin/` | Loads or safe admin fallback |  |  |

## Static UI checks

| Check | Pass/Fail | Notes |
|---|---|---|
| Browser console clean |  |  |
| CSS/JS assets load |  |  |
| Sample JSON loads or fails gracefully |  |  |
| Mobile layout usable |  |  |
| No secrets in page source |  |  |
| No real PII displayed |  |  |
| Compliance-safe copy |  |  |

## API route tests

| Endpoint | Expected | Pass/Fail | Notes |
|---|---|---|---|
| `GET /api/health` | `200` or log missing route |  |  |
| `POST /api/partners/classify` valid auth | `200` if implemented |  |  |
| `POST /api/partners/classify` bad auth | `401/403` |  |  |
| `POST /api/partners/recommend-resources` valid auth | `200` if implemented |  |  |
| `POST /api/partners/generate-onboarding-plan` valid auth | `200` if implemented |  |  |
| `POST /api/partners/generate-campaign-kit` valid auth | `200` if implemented |  |  |
| `POST /api/partners/log-event` valid auth | `200` if implemented |  |  |
| `POST /api/tally/partner-intake-webhook` fake payload | `2XX`, `401/403`, or log missing route |  |  |

## GPT Action boundary checks

| Check | Pass/Fail | Notes |
|---|---|---|
| OpenAPI exposes `GET /api/health` |  |  |
| OpenAPI exposes partner endpoints only |  |  |
| OpenAPI uses Bearer auth |  |  |
| Tally webhook is not exposed in GPT Actions |  |  |
| Admin endpoints are not exposed in GPT Actions |  |  |
| Storage/raw sync endpoints are not exposed in GPT Actions |  |  |

## Failure handling

| Failure | Issue created | Owner | Notes |
|---|---|---|---|
| Static route missing |  |  |  |
| API route missing |  |  |  |
| Bad auth accepted |  |  |  |
| Env var missing |  |  |  |
| Console errors |  |  |  |
| Secret exposure |  |  |  |
| Tally webhook exposed |  |  |  |

## Close-window checks

| Check | Pass/Fail | Notes |
|---|---|---|
| Results recorded |  |  |
| Incidents logged |  |  |
| Screenshots attached to PR/issue if needed |  |  |
| Rollback performed if needed |  |  |
| Deployment behavior locked down/documented |  |  |
| Phase 23 repair list created |  |  |

## Final decision

```text
[ ] Ready for Phase 23 endpoint repair
[ ] Blocked by deployment setup
[ ] Blocked by missing env vars
[ ] Blocked by repo/route mismatch
[ ] Rollback required before continuing
```
