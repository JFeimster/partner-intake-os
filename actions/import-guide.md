# GPT Action Import Guide

## Purpose

This guide imports the Partner Intake OS Action Pack into the Custom GPT builder and validates that only safe GPT-facing routes are exposed.

This is Phase 24. It assumes Phase 23 API endpoint repair has been copied into the repo and deployed to a Vercel test URL.

## Source files

```text
/actions/openapi.yaml
/actions/openapi.json
/actions/action-auth-setup.md
/actions/live-action-test-plan.md
/actions/live-test-payloads.json
/actions/live-response-fixtures.json
```

Use `/actions/openapi.yaml` first. Keep `/actions/openapi.json` as the strict machine-readable fallback.

## Server placeholder

Replace this placeholder before import:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app
```

With the active deployment domain, for example:

```text
https://partner-command-center.vercel.app
```

Do not use a local URL in the ChatGPT Builder import screen.

## Endpoints included

The Action Pack exposes only:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

## Endpoints intentionally excluded

Do not add these to the Action schema:

```text
POST /api/tally/partner-intake-webhook
/api/admin/*
/api/storage/*
/api/sync/*
```

The Tally webhook belongs to Tally only. Admin routes belong to a protected dashboard path. Storage and sync routes belong behind server-side workflow controls.

## Import steps

1. Open the Partner Intake OS Custom GPT in the GPT Builder.
2. Go to Configure.
3. Open Actions.
4. Create or edit the Partner Intake OS Action.
5. Import or paste `/actions/openapi.yaml`.
6. Confirm the server URL is the live Vercel deployment URL.
7. Configure authentication as API key/Bearer token.
8. Paste the private token value that matches Vercel `PARTNER_INTAKE_ACTION_TOKEN`.
9. Save.
10. Test `checkHealth` first.
11. Test `classifyPartnerIntake` with the low-info and high-risk test payloads.
12. Confirm the Tally webhook is not listed as an available Action.

## Required operation IDs

```text
checkHealth
classifyPartnerIntake
recommendPartnerResources
generatePartnerOnboardingPlan
generatePartnerCampaignKit
logPartnerEvent
```

If these names change, stop and repair the schema. Do not let ChatGPT import random operation IDs like a raccoon rearranging your dashboard.

## Validation target

A clean import means:

- no schema parser errors
- all six operation IDs appear
- Bearer auth is configured
- bad-token test returns 401
- low-info intake returns manual review
- high-risk lead seller returns risk flags
- no Tally webhook endpoint appears in the Action list
- no admin endpoint appears in the Action list
