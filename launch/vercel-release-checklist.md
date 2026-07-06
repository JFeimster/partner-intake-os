# Vercel Release Checklist

## Deployment window

| Check | Status | Notes |
| --- | --- | --- |
| Deployment window owner assigned. |  |  |
| Test start time documented. |  |  |
| Rollback owner assigned. |  |  |
| Expected routes documented. |  |  |
| Existing deployment policy reviewed. |  |  |

## Env vars

| Env var | Required for | Status | Notes |
| --- | --- | --- | --- |
| `PARTNER_INTAKE_ACTION_TOKEN` | GPT-facing API routes. |  |  |
| `PARTNER_LEAD_SUBMISSION_TOKEN` | Lead submission fallback auth. |  |  |
| `PARTNER_TRACKING_API_TOKEN` | Tracking fallback auth. |  |  |
| `PARTNER_ADMIN_TOKEN` | Admin login/bearer tests. |  |  |
| `PARTNER_ADMIN_SESSION_SECRET` | Admin signed cookie. |  |  |
| `PARTNER_INTAKE_ENV` | Runtime labeling. |  |  |
| `PARTNER_INTAKE_STORAGE_MODE` | mock/notion/hubspot/dual_sandbox. |  |  |
| `PARTNER_INTAKE_DRY_RUN` | Sync safety. |  |  |
| `TALLY_SIGNING_SECRET` | Webhook verification. |  |  |
| `NOTION_API_KEY` | Notion sandbox sync. |  |  |
| `NOTION_PARTNER_DATABASE_ID` | Notion sandbox sync. |  |  |
| `HUBSPOT_ACCESS_TOKEN` | HubSpot sandbox sync. |  |  |
| `TRACKING_BASE_URL` | Tracking generated URLs. |  |  |
| `PARTNER_BASE_URL` | Partner-facing URL generation. |  |  |

## Route checks

| Route | Expected | Status |
| --- | --- | --- |
| `/api/health` | 200. |  |
| `/api/partners/classify` | 401 without token; 2XX with token. |  |
| `/api/tally/partner-intake-webhook` | POST-only. |  |
| `/api/admin/session` | session logic. |  |
| `/api/admin/review-queue` | protected. |  |
| `/api/leads/submit` | review-first. |  |
| `/api/tracking/create-link` | auth + URL validation. |  |
| `/site/partner-intake/admin/login.html` | loads. |  |
| `/site/partner-intake/admin/index.html` | redirects/protects. |  |

## Logs

| Check | Status | Notes |
| --- | --- | --- |
| Request IDs appear. |  |  |
| Raw payloads do not appear. |  |  |
| Tokens do not appear. |  |  |
| Webhook signatures do not appear. |  |  |
| Test failures are readable. |  |  |

## Rollback

Rollback when:

- Env vars are wrong.
- API auth is bypassed.
- Admin route is exposed.
- Tally sends data to wrong endpoint.
- GPT Action exposes unsafe endpoints.
- Logs contain sensitive data.

Rollback steps:

```powershell
git checkout main
git pull origin main
# Revert merge commit or redeploy last known-good Vercel deployment.
```

Also disable or disconnect Tally webhook during rollback if webhook behavior is uncertain.

## Deployment lockdown

After testing:

1. Turn off any temporary deployment behavior you enabled.
2. Rotate temporary tokens.
3. Confirm production env vars are intentional.
4. Archive test result JSON.
5. Document release decision.
