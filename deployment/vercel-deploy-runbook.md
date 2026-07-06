# Vercel Deploy Runbook

## Goal

Deploy Partner Intake OS intentionally to a Vercel environment, test expected routes, capture failures, and close the deployment window cleanly.

## Pre-deploy repo checks

Run from repo root:

```powershell
git status
git branch --show-current
git pull origin main
```

If working from a feature branch:

```powershell
git fetch origin
git diff --stat origin/main...HEAD
```

Recommended validation before deploy:

```powershell
.\scriptsalidate-partner-intake-structure.ps1
```

If that script is missing, run:

```powershell
Get-ChildItem -Force
Get-ChildItem .\site\partner-intake -Recurse -ErrorAction SilentlyContinue
Get-ChildItem .pi -Recurse -ErrorAction SilentlyContinue
```

## Vercel project check

Confirm:

- Project: `partner-command-center`
- Team/account: Jason/admin Vercel account
- Domain: `https://YOUR_VERCEL_DOMAIN.vercel.app`
- Target branch: explicit and known
- Production deploy behavior: intentional only
- Preview deploy behavior: intentional only, if enabled for this test

## Branch selection

Recommended branch for this phase:

```text
phase-22/vercel-deployment-test-window
```

Do not deploy random branches with half-built files. That is not testing. That is shaking the vending machine and acting shocked when it falls over.

## Environment variable check

Before deploy, verify presence in Vercel dashboard. Do not print real values in logs or docs.

Required for API/GPT/Tally test windows:

```text
PARTNER_INTAKE_ACTION_TOKEN
TALLY_SIGNING_SECRET
PARTNER_INTAKE_ENV
PARTNER_INTAKE_STORAGE_MODE
NOTION_API_KEY
NOTION_PARTNER_DATABASE_ID
HUBSPOT_ACCESS_TOKEN
HUBSPOT_PARTNER_PIPELINE_ID
PARTNER_BASE_URL
PARTNER_SIGNUP_URL
PARTNER_LEAD_SUBMISSION_URL
TRACKING_BASE_URL
```

Allowed values in docs:

```text
set
missing
not used in this phase
placeholder only
```

Forbidden values in docs:

```text
real tokens
real signing secrets
real API keys
real partner PII
borrower data
```

## Manual deployment workflow

Option A — Vercel dashboard:

1. Open Vercel project.
2. Confirm branch/source.
3. Confirm environment.
4. Trigger deploy manually if configured.
5. Watch build logs.
6. Copy deployment URL.
7. Run smoke tests.

Option B — Vercel CLI, if already authenticated:

```powershell
vercel --confirm
```

For production only when intentionally opening production window:

```powershell
vercel --prod --confirm
```

## Expected routes

Static routes:

```text
/site/partner-intake/
/site/partner-intake/submit-lead.html
/site/partner-intake/tracking-link-builder.html
/site/partner-intake/admin/
```

API routes:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
POST /api/tally/partner-intake-webhook
```

## Expected success states

Static routes:

- Status `200`.
- Page loads.
- No broken core assets.
- No secrets appear in HTML, JS, or browser console.
- Mobile viewport is usable.

API routes:

- `GET /api/health` returns JSON.
- Partner endpoints require Bearer auth.
- Bad token returns `401` or `403`.
- Missing body returns `400` or validation error.
- Tally webhook returns a fast `2XX` only for acceptable test payload/signature behavior.

## Expected failure modes

These are not disasters. They are useful failure signals.

| Failure | Meaning | Next action |
|---|---|---|
| `404` static route | File missing or Vercel route mismatch | Confirm file path and deploy output |
| `404` API route | Endpoint not implemented or wrong Vercel convention | Repair in Phase 23 |
| `401/403` with bad token | Correct auth behavior | Log pass |
| `200` with bad token | Auth failure | Repair in Phase 23 |
| `500` API route | Runtime or env issue | Check logs, repair in Phase 23 |
| Tally webhook exposed in OpenAPI | Security boundary failure | Remove before GPT import |

## Rollback workflow

1. Stop testing.
2. Capture deployment URL and timestamp.
3. Log the failing route and expected behavior.
4. Revert the deployment from Vercel dashboard or redeploy last known-good commit.
5. Confirm public/static routes restored.
6. Do not continue to Phase 23 until the failure is logged.

## Deployment notes template

```md
## Deployment Test Window

- Date:
- Operator:
- Branch:
- Commit:
- Vercel URL:
- Environment:
- Static routes tested:
- API routes tested:
- Failed tests:
- Screenshots:
- Rollback needed: yes/no
- Window closed at:
```

## Go/no-go decision

Go to Phase 23 only when:

- Expected routes are known.
- Failures are documented.
- Environment variable gaps are documented.
- No real secrets or PII were exposed.
- Tally webhook remains private to Tally and is not exposed to GPT Actions.
