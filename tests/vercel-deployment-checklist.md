# Vercel Deployment Checklist

Use this as the pass/fail test record for Batch 14.

## Deployment exists

| Test | Pass/Fail | Notes |
|---|---|---|
| Vercel project exists |  |  |
| Repo is linked to correct Vercel project |  |  |
| Production branch is correct |  |  |
| Deployment was manual/controlled |  |  |
| Last deployment completed successfully |  |  |

## Static dashboard loads

| Test | Pass/Fail | Notes |
|---|---|---|
| Root site still loads |  |  |
| `/site/partner-intake/` loads locally |  |  |
| `/site/partner-intake/` loads on deployed domain |  |  |
| Static CSS loads |  |  |
| Static JS loads |  |  |
| Local sample JSON loads |  |  |
| No real PII appears in static files |  |  |

## API health endpoint works

| Test | Expected | Pass/Fail | Notes |
|---|---|---|---|
| `GET /api/health` | 200 |  |  |
| Response is JSON | JSON |  |  |
| Response identifies environment | `production`, `preview`, or `development` |  |  |

## Bearer-token endpoints reject bad auth

| Endpoint | Missing token expected | Bad token expected | Pass/Fail | Notes |
|---|---|---|---|---|
| `POST /api/partners/classify` | 401 | 401 |  |  |
| `POST /api/partners/recommend-resources` | 401 | 401 |  |  |
| `POST /api/partners/generate-onboarding-plan` | 401 | 401 |  |  |
| `POST /api/partners/generate-campaign-kit` | 401 | 401 |  |  |
| `POST /api/partners/log-event` | 401 | 401 |  |  |

## Bearer-token endpoints accept valid auth

| Endpoint | Expected | Pass/Fail | Notes |
|---|---|---|---|
| `POST /api/partners/classify` | 200 |  |  |
| `POST /api/partners/recommend-resources` | 200 |  |  |
| `POST /api/partners/generate-onboarding-plan` | 200 |  |  |
| `POST /api/partners/generate-campaign-kit` | 200 |  |  |
| `POST /api/partners/log-event` | 200 or 201 |  |  |

## Tally webhook endpoint

| Test | Expected | Pass/Fail | Notes |
|---|---|---|---|
| Endpoint exists | `/api/tally/partner-intake-webhook` |  |  |
| Test submission returns quickly | 2XX or expected auth failure if unsigned |  |  |
| Signing secret is configured | Yes |  |  |
| Webhook is not in GPT Action OpenAPI | Absent |  |  |
| Webhook does not require GPT Action token | Not Action-token based |  |  |

## OpenAPI server URL

| Test | Expected | Pass/Fail | Notes |
|---|---|---|---|
| OpenAPI server URL uses deployed domain | `https://YOUR_VERCEL_DOMAIN.vercel.app` |  |  |
| Server URL does not use localhost | No localhost |  |  |
| Server URL does not use preview domain in production GPT | Production domain only |  |  |
| Operation IDs unchanged | Required IDs present |  |  |
| Tally webhook excluded | No Tally path |  |  |

## Security and compliance

| Test | Expected | Pass/Fail | Notes |
|---|---|---|---|
| No secrets committed | Clean |  |  |
| No `.env` committed | Clean |  |  |
| No real partner PII in static JSON | Clean |  |  |
| No approval/funding guarantees | Clean |  |  |
| No credit repair positioning | Clean |  |  |
| Logs checked for secrets | Clean |  |  |
