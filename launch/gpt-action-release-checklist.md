# GPT Action Release Checklist

Use this before enabling Partner Intake OS Actions for internal GPT use.

## OpenAPI import

| Check | Status | Notes |
| --- | --- | --- |
| `/actions/openapi.yaml` imports successfully. |  |  |
| `/actions/openapi.json` is valid JSON. |  |  |
| Server URL uses live Vercel domain. |  |  |
| No localhost URL remains. |  |  |
| Schema descriptions are clear enough for GPT Action selection. |  |  |

## Authentication

| Check | Status | Notes |
| --- | --- | --- |
| Auth type is API key / Bearer. |  |  |
| GPT Action token matches Vercel env var. |  |  |
| Bad token test fails with 401. |  |  |
| Token is not exposed in prompt, docs, screenshots, or logs. |  |  |

## Required operation IDs

| Operation ID | Expected route | Status |
| --- | --- | --- |
| `checkHealth` | `GET /api/health` |  |
| `classifyPartnerIntake` | `POST /api/partners/classify` |  |
| `recommendPartnerResources` | `POST /api/partners/recommend-resources` |  |
| `generatePartnerOnboardingPlan` | `POST /api/partners/generate-onboarding-plan` |  |
| `generatePartnerCampaignKit` | `POST /api/partners/generate-campaign-kit` |  |
| `logPartnerEvent` | `POST /api/partners/log-event` |  |

## Live endpoint tests

Test these in GPT Builder Preview:

1. “Check API health.”
2. “Classify this CPA referral partner using the API.”
3. “Recommend resources for this broker using the API.”
4. “Generate an onboarding plan for this content affiliate using the API.”
5. “Generate a campaign kit for a veteran community connector using the API.”
6. “Log this partner review event.”

## Failed action troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Import fails | YAML/JSON syntax issue. | Validate OpenAPI file. |
| Action shows wrong server | Placeholder domain not replaced. | Update server URL. |
| 401 Unauthorized | Token mismatch. | Match GPT token to Vercel env var. |
| 404 Not Found | Vercel route missing or not deployed. | Confirm route exists and redeploy. |
| 500 Server Error | Runtime/env issue. | Check Vercel logs and env vars. |
| GPT calls wrong action | Operation descriptions too vague. | Tighten action summaries/descriptions. |

## Exposure rules

The GPT Action Pack must **not** expose:

```text
/api/tally/partner-intake-webhook
/api/admin/*
/api/storage/*
/api/sync/*
/api/leads/*
/api/tracking/*
```

Use separate internal/admin tooling for non-GPT routes.

## Release gate

Do not release Actions internally until:

- Health check passes.
- Good-token test passes.
- Bad-token test fails.
- All six operation IDs are available.
- Tally webhook is not exposed.
- Admin endpoints are not exposed.
- GPT output avoids guarantees and fake certainty.
