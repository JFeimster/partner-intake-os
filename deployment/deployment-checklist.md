# Deployment Checklist

Use this before deploying Partner Intake OS through Vercel.

## Pre-deploy checklist

- [ ] Batch 13 GitHub integration packet committed or available.
- [ ] Batch 14 branch created separately.
- [ ] Existing `vercel.json` backed up or reviewed.
- [ ] No future-batch files included in this PR.
- [ ] `/api/` files exist from Batch 05.
- [ ] `/actions/` OpenAPI files exist from Batch 07.
- [ ] `/site/partner-intake/` exists from Batch 11.
- [ ] No real secrets are committed.
- [ ] `.env`, `.env.local`, `.env.production`, and service account files are ignored.

## Environment variable checklist

Required:

- [ ] `PARTNER_INTAKE_ACTION_TOKEN`
- [ ] `TALLY_SIGNING_SECRET`
- [ ] `PARTNER_INTAKE_ENV`
- [ ] `PARTNER_INTAKE_STORAGE_MODE`

Storage, only when enabled:

- [ ] `NOTION_API_KEY`
- [ ] `NOTION_PARTNER_DATABASE_ID`
- [ ] `HUBSPOT_ACCESS_TOKEN`
- [ ] `HUBSPOT_PARTNER_PIPELINE_ID`
- [ ] `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- [ ] `GOOGLE_PRIVATE_KEY`
- [ ] `GOOGLE_SHEET_ID`

Dashboard/tracking placeholders:

- [ ] `PARTNER_BASE_URL`
- [ ] `PARTNER_SIGNUP_URL`
- [ ] `PARTNER_LEAD_SUBMISSION_URL`
- [ ] `TRACKING_BASE_URL`

## API endpoint checklist

- [ ] `GET /api/health` returns 200.
- [ ] `POST /api/partners/classify` rejects missing auth.
- [ ] `POST /api/partners/classify` accepts valid Bearer token.
- [ ] `POST /api/partners/recommend-resources` accepts valid Bearer token.
- [ ] `POST /api/partners/generate-onboarding-plan` accepts valid Bearer token.
- [ ] `POST /api/partners/generate-campaign-kit` accepts valid Bearer token.
- [ ] `POST /api/partners/log-event` accepts valid Bearer token.
- [ ] `POST /api/tally/partner-intake-webhook` is not protected by the GPT Action token.
- [ ] Tally webhook validation uses `TALLY_SIGNING_SECRET` when configured.

## Tally webhook checklist

- [ ] Webhook URL uses deployed domain.
- [ ] Webhook path is `/api/tally/partner-intake-webhook`.
- [ ] Tally signing secret is enabled.
- [ ] Tally signing secret matches Vercel env var.
- [ ] Test submission returns 2XX.
- [ ] Payload normalizes into expected intake shape.
- [ ] High-risk/low-info test submissions trigger review behavior.
- [ ] Webhook endpoint is not included in GPT Actions.

## GPT Action checklist

- [ ] OpenAPI server URL matches deployed Vercel domain.
- [ ] Auth type is API key / Bearer.
- [ ] GPT Action token matches `PARTNER_INTAKE_ACTION_TOKEN`.
- [ ] Operation IDs remain:
  - `checkHealth`
  - `classifyPartnerIntake`
  - `recommendPartnerResources`
  - `generatePartnerOnboardingPlan`
  - `generatePartnerCampaignKit`
  - `logPartnerEvent`
- [ ] Tally webhook endpoint is not exposed.
- [ ] Test calls work in GPT Builder preview.

## Static dashboard checklist

- [ ] `/site/partner-intake/` loads locally.
- [ ] `/site/partner-intake/` loads on deployed domain.
- [ ] Local JSON sample data loads.
- [ ] No live PII appears in static files.
- [ ] Compliance-safe language remains intact.
- [ ] Lead submission and tracking placeholders are clearly marked as future/demo if not live.

## Post-deploy smoke test checklist

- [ ] Root site still loads.
- [ ] Partner Intake dashboard loads.
- [ ] API health works.
- [ ] Protected endpoints reject bad auth.
- [ ] Protected endpoints accept good auth.
- [ ] Tally webhook returns expected test response.
- [ ] Vercel logs do not expose secrets.
- [ ] GPT Action schema still imports after server URL update.
- [ ] Rollback target is known.
