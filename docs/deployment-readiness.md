# Deployment Readiness

This repo is Vercel-shaped, but deployment readiness is not the same thing as production readiness. Don’t let the deploy button cosplay as a launch plan. 🚦

## Vercel assumptions

- Vercel hosts the API/runtime layer.
- Serverless routes live under `/api/`.
- Static demo/dashboard files live under `/site/partner-intake/`.
- Environment variables are configured in Vercel, not committed to GitHub.

## Deploy brake

`vercel.json` currently includes:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

Do not turn automatic deployments on during this sprint. Use a controlled deploy window only when explicitly requested.

## Required environment variables

Core GPT/API:

```text
PARTNER_INTAKE_ACTION_TOKEN
PARTNER_INTAKE_ENV
PARTNER_INTAKE_STORAGE_MODE
```

Tally webhook:

```text
TALLY_SIGNING_SECRET
```

Admin/session:

```text
PARTNER_ADMIN_TOKEN
PARTNER_ADMIN_SESSION_SECRET
```

Tracking:

```text
PARTNER_TRACKING_API_TOKEN
TRACKING_BASE_URL
PARTNER_BASE_URL
```

Future storage/sync:

```text
NOTION_API_KEY
NOTION_PARTNER_DATABASE_ID
HUBSPOT_ACCESS_TOKEN
HUBSPOT_PARTNER_PIPELINE_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
```

Only configure what the route under test actually needs.

## Local validation commands

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center\partner-intake-os"

npm install
npm run validate
```

Individual checks:

```powershell
npm run validate:json
npm run validate:openapi
npm run validate:structure
```

## API route safety notes

- GPT-facing routes should use `PARTNER_INTAKE_ACTION_TOKEN` Bearer auth unless intentionally public like `/api/health`.
- Tally webhook should verify `TALLY_SIGNING_SECRET` before live use.
- Admin routes must use admin token/session handling and no-store responses.
- Lead submission is review-based intake only.
- Tracking create/log routes are stubs until storage is wired.
- Do not expose admin, Tally, tracking, lead submission, sync, or security routes through production GPT Actions by default.

## Pre-deploy checklist

1. Confirm branch/PR review is complete.
2. Run `npm run validate` locally.
3. Replace OpenAPI placeholder server URLs only when ready.
4. Confirm Vercel env vars exist for the route group being tested.
5. Confirm no secrets were committed.
6. Confirm no sample/static JSON contains real PII.
7. Confirm `actions/openapi.production.yaml` contains only the six production-safe routes.
8. Confirm Tally webhook is not in GPT Actions.
9. Confirm admin routes are not public/static-only for production data.
10. Confirm rollback path before enabling deployment.

## Rollback notes

- Keep automatic deployments off until the test window is intentional.
- If a deployed route fails, revert the PR or redeploy the previous known-good commit.
- If a GPT Action import is wrong, remove the Action from the GPT and re-import from the corrected production spec.
- If a Tally webhook signature fails, disable the webhook or remove the signing secret during diagnosis only in a non-production test window.
- If sensitive data is accidentally committed, remove it from the repo and rotate affected secrets immediately.

## Production readiness boundary

This sprint does not create the production datastore, audit log, partner portal auth, admin dashboard v2 production storage, or CRM sync runtime. Those belong to the numbered production roadmap.
