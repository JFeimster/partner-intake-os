# Partner Intake OS API — Phase 23 Endpoint Repair

Phase 23 converts the Partner Intake OS API layer from example-only planning into Vercel-compatible TypeScript route files.

This packet is designed for the Partner Command Center repo, but it stays conservative:

- no hardcoded secrets
- no real database writes
- no raw PII logging
- no lender certainty
- no guaranteed approval/funding/commission language
- no Tally webhook exposure through GPT Actions

## What changed

Phase 23 adds or repairs:

```text
/api/health.ts
/api/partners/classify.ts
/api/partners/recommend-resources.ts
/api/partners/generate-onboarding-plan.ts
/api/partners/generate-campaign-kit.ts
/api/partners/log-event.ts
/api/tally/partner-intake-webhook.ts
/lib/http.ts
/lib/validation.ts
/lib/request-id.ts
/lib/errors.ts
/lib/cors.ts
```

## Runtime assumptions

These files are written for Vercel serverless functions using dependency-minimal TypeScript. They use only Node/Vercel runtime primitives and `crypto` for webhook HMAC checking.

If your repo does not yet have a TypeScript/Vercel API runtime, add this phase in a controlled branch and test during a deployment window.

## Environment variables

Required for GPT-facing partner endpoints:

```text
PARTNER_INTAKE_ACTION_TOKEN=
PARTNER_INTAKE_ENV=local
PARTNER_INTAKE_STORAGE_MODE=mock
```

Required only if Tally webhook signature verification is active:

```text
TALLY_SIGNING_SECRET=
```

Optional:

```text
PARTNER_INTAKE_VERSION=0.1.0
PARTNER_INTAKE_ALLOWED_ORIGIN=*
```

## Endpoint map

| Endpoint | Method | Auth | Purpose |
|---|---:|---|---|
| `/api/health` | GET | none | Service health check |
| `/api/partners/classify` | POST | Bearer | Classify partner intake |
| `/api/partners/recommend-resources` | POST | Bearer | Recommend resources |
| `/api/partners/generate-onboarding-plan` | POST | Bearer | Generate onboarding plan |
| `/api/partners/generate-campaign-kit` | POST | Bearer | Generate campaign kit |
| `/api/partners/log-event` | POST | Bearer | Stub event logging |
| `/api/tally/partner-intake-webhook` | POST | Tally signature when configured | Tally-only intake webhook |

## GPT Actions exposure

Expose only these endpoints in GPT Actions:

```text
GET /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

Do **not** expose:

```text
POST /api/tally/partner-intake-webhook
```

That route is for Tally only.

## Standard success response

```json
{
  "ok": true,
  "request_id": "pio_example",
  "status": "ok"
}
```

## Standard error response

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Partner intake is missing required fields or has invalid values.",
    "fields": ["email"],
    "request_id": "pio_example"
  }
}
```

## Local test commands

Set a local token:

```powershell
$env:PARTNER_INTAKE_ACTION_TOKEN="dev-partner-intake-token"
$env:PARTNER_INTAKE_ENV="local"
$env:PARTNER_INTAKE_STORAGE_MODE="mock"
```

Health:

```powershell
curl.exe -X GET "http://localhost:3000/api/health"
```

Classify:

```powershell
curl.exe -X POST "http://localhost:3000/api/partners/classify" `
  -H "Authorization: Bearer dev-partner-intake-token" `
  -H "Content-Type: application/json" `
  -d "{\"intake\":{\"first_name\":\"Dana\",\"last_name\":\"Cole\",\"email\":\"dana@example.com\",\"company\":\"Cole Advisory\",\"partner_type_claimed\":\"CPA\",\"audience\":\"contractors\",\"notes\":\"Existing clients ask about working capital.\"}}"
```

Bad auth:

```powershell
curl.exe -X POST "http://localhost:3000/api/partners/classify" `
  -H "Authorization: Bearer wrong-token" `
  -H "Content-Type: application/json" `
  -d "{\"intake\":{\"email\":\"test@example.com\"}}"
```

Tally webhook stub test without signing secret:

```powershell
curl.exe -X POST "http://localhost:3000/api/tally/partner-intake-webhook" `
  -H "Content-Type: application/json" `
  -d "{\"data\":{\"fields\":[{\"label\":\"First name\",\"value\":\"Alex\"},{\"label\":\"Email\",\"value\":\"alex@example.com\"},{\"label\":\"Company / brand\",\"value\":\"Alex Partners\"},{\"label\":\"Which best describes you?\",\"value\":\"Funding broker\"}]}}"
```

## Storage notes

Phase 23 does not write to Notion or HubSpot. Responses include `storage.written=false`.

Storage handoff points are commented in code for the sandbox sync phase.
