# Partner Intake OS Action Pack

## Purpose

This Action Pack lets the **Partner Intake OS** Custom GPT safely call the Partner Intake API hosted on Vercel.

It exposes only GPT-facing endpoints for partner classification, resource recommendations, onboarding plans, campaign kit recommendations, health checks, and CRM-ready event logging.

It does **not** expose the Tally webhook endpoint. Tally sends form submissions into the system through `/api/tally/partner-intake-webhook`; the GPT should not be able to call that route. Keep the intake front door and GPT command surface separate. That is how you avoid spaghetti ops with a badge and a clipboard.

## Files in this Action Pack

```txt
/actions/openapi.yaml
/actions/openapi.json
/actions/action-readme.md
/actions/auth.md
/actions/test-cases.md
```

## Endpoints exposed

| Method | Endpoint | operationId | Purpose |
|---|---|---|---|
| GET | `/api/health` | `checkHealth` | Check API health and environment status. |
| POST | `/api/partners/classify` | `classifyPartnerIntake` | Classify a partner intake and return score/tier/path/risk. |
| POST | `/api/partners/recommend-resources` | `recommendPartnerResources` | Recommend resources based on partner profile/context. |
| POST | `/api/partners/generate-onboarding-plan` | `generatePartnerOnboardingPlan` | Generate first 24 hours / 7 days / 30 days onboarding plan. |
| POST | `/api/partners/generate-campaign-kit` | `generatePartnerCampaignKit` | Generate campaign kit recommendation and guardrails. |
| POST | `/api/partners/log-event` | `logPartnerEvent` | Log a CRM-ready partner event. |

## What not to expose

Do **not** add this endpoint to the Action schema:

```txt
POST /api/tally/partner-intake-webhook
```

That endpoint is for Tally only. It should be protected separately with a signing secret and should never be offered as a GPT Action.

## Authentication

Use Bearer token authentication:

```txt
Authorization: Bearer YOUR_PARTNER_INTAKE_OS_ACTION_TOKEN
```

The API should compare this token against the Vercel environment variable:

```txt
PARTNER_INTAKE_ACTION_TOKEN=your_long_random_token
```

Do not reuse your Tally signing secret as the GPT Action token. Different doors, different keys.

## Exact GPT Action setup steps

1. Deploy Batch 05 and Batch 06 files to your Vercel project.
2. Set `PARTNER_INTAKE_ACTION_TOKEN` in Vercel.
3. Open `actions/openapi.yaml`.
4. Replace this placeholder:

```txt
https://YOUR_VERCEL_DOMAIN.vercel.app
```

with your actual Vercel domain.

5. In ChatGPT, open the Partner Intake OS Custom GPT editor.
6. Go to **Configure → Actions**.
7. Add a new Action.
8. Import or paste `actions/openapi.yaml`.
9. Set authentication to **API Key**.
10. Choose **Bearer** as the auth type.
11. Paste the same token used in `PARTNER_INTAKE_ACTION_TOKEN`.
12. Test `checkHealth` first.
13. Test `classifyPartnerIntake` with a low-risk sample partner.
14. Test bad auth outside GPT with curl before trusting the Action in production.
15. Confirm the Action list does **not** include the Tally webhook.

## Recommended first tests

1. `checkHealth`
2. `classifyPartnerIntake`
3. `recommendPartnerResources`
4. `generatePartnerOnboardingPlan`
5. `generatePartnerCampaignKit`
6. `logPartnerEvent`

## Notes

- The OpenAPI spec uses `operationId` values designed for GPT Actions.
- Schemas are inline under `components.schemas` so the Action Pack can stand alone.
- Response shapes are aligned with the Batch 05 API scaffold.
- Event logging remains safe with mock/json/storage routing from Batch 06.
- Keep funding copy readiness-based and educational. No approval promises, no guaranteed amounts, no credit repair framing, no fake lender certainty.
