# OpenAPI Import Guide

## Production Custom GPT import file

Use this file for the production Partner Intake OS Custom GPT Action import:

```text
actions/openapi.production.yaml
```

The root spec is also production-safe:

```text
actions/openapi.yaml
```

Both files should expose only the approved GPT-facing route set:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

## Do not import these into the production GPT

Do not expose these routes in the production Custom GPT Action import:

```text
/api/tally/partner-intake-webhook
/api/admin/*
/api/leads/submit
/api/tracking/*
/api/sync/*
/api/security/*
```

Reason: those routes are public inbound infrastructure, internal/admin, review-based partner lead intake, stub attribution, or future/internal operations. They need explicit production safety review before GPT exposure.

## Spec roles

| File | Role | Production GPT import safe? |
|---|---:|---:|
| `actions/openapi.yaml` | Root production-safe mirror | yes |
| `actions/openapi.production.yaml` | Preferred production Custom GPT import | yes |
| `actions/openapi.dev.yaml` | Dev/test/planned route testing | no |
| `actions/openapi.admin.yaml` | Internal/admin planning and testing | no |
| `actions/openapi.partner.yaml` | Future partner-facing planning | no |

## Pre-import checklist

1. Replace placeholder server URL with the deployed Vercel domain.
2. Confirm `PARTNER_INTAKE_ACTION_TOKEN` is set in Vercel.
3. Configure Custom GPT Action auth as Bearer token.
4. Confirm the production spec does not contain `/api/admin/`, `/api/tally/`, `/api/leads/`, `/api/tracking/`, `/api/sync/`, or `/api/security/`.
5. Confirm the operation IDs are:
   - `checkHealth`
   - `classifyPartnerIntake`
   - `recommendPartnerResources`
   - `generatePartnerOnboardingPlan`
   - `generatePartnerCampaignKit`
   - `logPartnerEvent`
6. Test the health route first.
7. Test one low-info partner intake and one high-risk partner intake.
8. Confirm responses use review-safe language and do not imply guaranteed outcomes.

## Production safety notes

- The Tally webhook is not a GPT Action.
- Admin routes are not partner-facing GPT Actions.
- Lead submission and tracking routes are review/stub routes and are not production GPT import safe by default.
- Planned routes are not import-safe until implemented, protected, tested, and documented.
- Placeholder server URLs should trigger a warning during validation.

## Local validation

```powershell
npm run validate:openapi
```

The validation script performs lightweight import-safety checks against `actions/openapi.production.yaml`.
