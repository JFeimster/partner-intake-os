# Vercel Environment Variable Verification

## Rule

Verify environment variable presence without exposing real values.

Use:

```text
set
missing
not needed in this phase
placeholder only
```

Never paste real secrets into files, commits, screenshots, Slack, email, GPT builder notes, or logs.

## Required variables

| Variable | Purpose | Environment(s) | Status | Notes |
|---|---|---|---|---|
| `PARTNER_INTAKE_ACTION_TOKEN` | Bearer token for GPT-facing partner endpoints | Preview/Production |  | Do not reuse public tokens |
| `TALLY_SIGNING_SECRET` | Tally webhook signature validation | Preview/Production |  | Tally only; not GPT Actions |
| `PARTNER_INTAKE_ENV` | Runtime environment marker | Preview/Production |  | Example values: `preview`, `production` |
| `PARTNER_INTAKE_STORAGE_MODE` | Selects storage behavior | Preview/Production |  | Recommended test value: `mock` |
| `NOTION_API_KEY` | Notion sandbox sync | Preview/Production only if testing sync |  | Use sandbox integration |
| `NOTION_PARTNER_DATABASE_ID` | Notion partner database ID | Preview/Production only if testing sync |  | Sandbox DB first |
| `HUBSPOT_ACCESS_TOKEN` | HubSpot sandbox/private app sync | Preview/Production only if testing sync |  | Sandbox/private app only |
| `HUBSPOT_PARTNER_PIPELINE_ID` | HubSpot pipeline mapping | Preview/Production only if testing sync |  | Verify sandbox pipeline |
| `PARTNER_BASE_URL` | Public/base partner URL | Preview/Production |  | Use current Vercel domain during test |
| `PARTNER_SIGNUP_URL` | Tally/partner signup URL | Preview/Production |  | Public signup path |
| `PARTNER_LEAD_SUBMISSION_URL` | Lead submission page/API URL | Preview/Production |  | Confirm static page route |
| `TRACKING_BASE_URL` | Tracking link base URL | Preview/Production |  | Use test domain first |

## Recommended Vercel dashboard process

1. Open Vercel project.
2. Go to Settings → Environment Variables.
3. Filter by `PARTNER_`, `TALLY_`, `NOTION_`, `HUBSPOT_`, and `TRACKING_`.
4. Confirm each variable exists in the intended environment.
5. Do not reveal values.
6. Add missing variables with placeholder/test values only if safe.
7. Redeploy after environment changes.

## Suggested test-mode values

Do not commit these as actual secrets. These are operator-facing examples.

```text
PARTNER_INTAKE_ENV=preview
PARTNER_INTAKE_STORAGE_MODE=mock
PARTNER_BASE_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
PARTNER_SIGNUP_URL=https://tally.so/r/YOUR_FORM_ID
PARTNER_LEAD_SUBMISSION_URL=https://YOUR_VERCEL_DOMAIN.vercel.app/site/partner-intake/submit-lead.html
TRACKING_BASE_URL=https://YOUR_VERCEL_DOMAIN.vercel.app/r
```

## Verification from endpoint behavior

Without printing values, confirm:

- Partner endpoints reject bad Bearer tokens.
- Partner endpoints accept the valid test Bearer token.
- Tally webhook behavior changes when signing secret is required.
- Storage mode returns mock/stub behavior until sandbox sync is intentionally enabled.

## Red flags

Stop the test window if:

- A real token appears in a public repo file.
- A real token appears in browser JS.
- A real token appears in screenshots.
- Production HubSpot/Notion writes happen unintentionally.
- Tally webhook can be called without expected signature/security behavior after enforcement is built.
- GPT Actions schema exposes admin or Tally webhook paths.

## Record template

```md
## Env Var Verification

- Date:
- Operator:
- Vercel project:
- Environment checked: Preview / Production
- Variables missing:
- Variables intentionally skipped:
- Storage mode:
- Token exposure check complete: yes/no
- Notes:
```
