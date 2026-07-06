# Actions README

This folder contains the OpenAPI Action specs and reusable components for Partner Intake OS.

The Action layer lets the Custom GPT call the Partner Intake OS Vercel API through safe, authenticated endpoints. The GPT should not connect directly to Tally, HubSpot, Notion, Google Sheets, n8n, or Activepieces like spaghetti with a badge. Route calls through the API layer.

## Files

| File | Purpose |
|---|---|
| `openapi.yaml` | Canonical OpenAPI source spec. Use this as the editable source of truth. |
| `openapi.json` | JSON mirror of the canonical spec for validators, tooling, CI, and scripts. |
| `openapi.bundle.yaml` | Self-contained import-ready spec for Custom GPT Actions. Recommended GPT import file. |
| `openapi.bundle.json` | JSON mirror of the bundled import-ready spec. |
| `openapi.admin.yaml` | Internal/admin Action spec. Includes review, status, lead, tracking, attribution, and admin queue endpoints. |
| `openapi.partner.yaml` | Future partner-facing spec. Narrower and safer. Excludes admin queue, internal review, and raw risk details. |
| `openapi.dev.yaml` | Development/testing spec for localhost and preview Vercel routes. |
| `openapi.production.yaml` | Production core spec for live GPT Actions. Includes only core GPT-facing endpoints. |
| `components/schemas.yaml` | Reusable OpenAPI schema components. |
| `components/security.yaml` | Bearer auth security scheme and token notes. |
| `components/examples.yaml` | Reusable example payloads. |
| `openapi-validation-guide.md` | Validation and GPT Action import checklist. |

## Which file to import into the Custom GPT

Use this file first:

```txt
/actions/openapi.bundle.yaml
```

Why:

- it is self-contained
- it has inline `components.schemas`
- it does not rely on external file references
- it includes Bearer auth
- it excludes the Tally webhook endpoint
- it is built for Custom GPT Action import/testing

For a tighter production import, use:

```txt
/actions/openapi.production.yaml
```

Only use the production variant after the Vercel routes and token are tested.

## Auth setup

Use Bearer API key authentication.

Header format:

```http
Authorization: Bearer YOUR_PARTNER_INTAKE_ACTION_TOKEN
```

Vercel environment variable:

```txt
PARTNER_INTAKE_ACTION_TOKEN
```

Custom GPT Action auth settings:

```txt
Authentication type: API key
Auth type: Bearer
Header: Authorization
Token: value of PARTNER_INTAKE_ACTION_TOKEN
```

Do not commit real tokens. Do not paste real tokens into docs. Do not screenshot real tokens. Obvious, but the internet has made “obvious” a crime scene.

## Endpoint list

### Core GPT-facing endpoints

| Method | Path | operationId | Status |
|---|---|---|---|
| GET | `/api/health` | `checkHealth` | core |
| POST | `/api/partners/classify` | `classifyPartnerIntake` | core |
| POST | `/api/partners/recommend-resources` | `recommendPartnerResources` | core |
| POST | `/api/partners/generate-onboarding-plan` | `generatePartnerOnboardingPlan` | core |
| POST | `/api/partners/generate-campaign-kit` | `generatePartnerCampaignKit` | core |
| POST | `/api/partners/log-event` | `logPartnerEvent` | core |

### Planned expansion endpoints

| Method | Path | operationId | Scope |
|---|---|---|---|
| POST | `/api/partners/submit-lead` | `submitPartnerLead` | planned partner/admin |
| POST | `/api/partners/create-tracking-link` | `createPartnerTrackingLink` | planned partner/admin |
| POST | `/api/partners/log-attribution-event` | `logPartnerAttributionEvent` | planned partner/admin |
| POST | `/api/admin/review-partner` | `reviewPartner` | planned admin only |
| POST | `/api/admin/update-partner-status` | `updatePartnerStatus` | planned admin only |
| GET | `/api/admin/review-queue` | `getPartnerReviewQueue` | planned admin only |

Do not present planned endpoints as live until the backend route exists and has passed API tests.

## What not to expose

Never expose this endpoint through GPT Actions:

```txt
POST /api/tally/partner-intake-webhook
```

That endpoint is for Tally only. It should be protected with webhook signing logic and separated from GPT-facing Action auth.

Also do not expose:

- raw webhook receipt payloads
- raw audit logs
- raw integration secrets
- CRM tokens
- Notion API keys
- HubSpot access tokens
- Google service account credentials
- Tally signing secrets
- internal-only review queue data in partner-facing specs

## Token handling notes

Use separate tokens for:

- development
- preview testing
- production
- admin/internal GPT
- future partner-facing GPT or dashboard flows

Rotate the token when:

- it appears in a screenshot
- it is pasted into chat
- it is committed to GitHub
- a contractor or tool no longer needs access
- you move from dev to production
- the GPT Action import was tested in an untrusted workspace

## Recommended import order

1. Start with `openapi.bundle.yaml`.
2. Test `checkHealth`.
3. Test `classifyPartnerIntake`.
4. Test recommendation and onboarding endpoints.
5. Test `logPartnerEvent`.
6. Ignore planned endpoints until API routes exist.
7. Move to `openapi.production.yaml` after live route validation.

## Production rule

If the backend route does not exist, the GPT Action spec should either exclude it or clearly mark it as planned. Fake-live endpoints are how automation systems become haunted houses.
