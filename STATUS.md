# Partner Intake OS Status

## Current State

Partner Intake OS is a mixed-stage repo. It contains production-shaped API routes, GPT files, OpenAPI specs, schemas, setup packets, static dashboard shells, future partner/admin docs, and sample fixtures. Treat the repo as the source-of-truth for code/docs/specs, not as the live system of record.

Status labels used below:

- `live` — implemented route/file with usable runtime behavior.
- `stub` — implemented compatibility/scaffold behavior, but not persisted or production-backed.
- `planned` — roadmap/spec exists, but production implementation is not complete.
- `docs-only` — operator instructions, contracts, setup guides, or planning docs.
- `demo-only` — static/sample data or UI-only shell.
- `deprecated` — legacy alias or prior naming that should not be canonical going forward.

## Live Components

| Area | Status | Notes |
|---|---|---|
| `/api/health` | live | Public GET health check. |
| `/api/partners/classify` | live | Bearer-auth GPT-facing classification endpoint. Uses validation/classification logic and returns storage as non-written/mock. |
| `/api/partners/generate-onboarding-plan` | live | Bearer-auth GPT-facing onboarding plan endpoint. |
| `/api/partners/log-event` | stub | Bearer-auth GPT-facing event logger; returns accepted/logged event but does not persist. |
| `/api/leads/submit` | live | Review-based lead intake endpoint. This is not a funding/approval endpoint and is not production GPT-import safe by default. |
| `/api/admin/review-queue` | demo-only | Protected route returning sample/internal review records only. |

## Stubbed Components

| Area | Status | Notes |
|---|---|---|
| `/api/partners/recommend-resources` | stub | Implemented response path, but uses scaffolded logic and should be auth-normalized before production. |
| `/api/partners/generate-campaign-kit` | stub | Implemented response path, but uses scaffolded logic and should be auth-normalized before production. |
| `/api/tracking/create-link` | stub | Generates deterministic tracking URL output but does not persist. |
| `/api/tracking/log-event` | stub | Accepts tracking events but does not persist. |
| Storage connectors | stub/docs-only | Notion, HubSpot, Google Sheets, and future database storage require real configuration and QA. |

## Planned Components

| Area | Status | Notes |
|---|---|---|
| Production datastore | planned | Belongs to Batch 31. Not created or repaired in this sprint. |
| Audit log foundation | planned | Belongs to Batch 31. Not created or repaired in this sprint. |
| Partner portal | planned | Existing docs/static shell are future-facing, not production portal auth. |
| Admin dashboard v2 | planned/demo-only | Static shell and contracts exist. Needs protected production storage and auth. |
| Sync routes | planned | Do not expose to GPT Actions until built, protected, tested, and intentionally documented. |

## Docs-Only Components

| Area | Status | Notes |
|---|---|---|
| `/knowledge/` | docs-only | GPT Knowledge source material. |
| `/schemas/` | docs-only | JSON schemas for validation/data contracts. |
| `/dashboard-contracts/` | docs-only | Dashboard-ready contracts. |
| `/tally/` and `/tally-setup/` | docs-only | Tally field maps, setup packet, and samples. |
| `/notion/`, `/hubspot/`, `/workflows/` | docs-only | Setup and workflow specs. |

## Validation Status

- `package.json`, `tsconfig.json`, `scripts/validate-json.mjs`, and `scripts/validate-openapi.mjs` are part of the hardening baseline.
- JSON validation is lightweight and parses all repo `.json` files outside `.git`, `.vercel`, and `node_modules`.
- OpenAPI validation is lightweight and focused on production import safety.
- Full TypeScript compilation/runtime tests are not claimed by this sprint.

## Deployment Status

- `vercel.json` has `git.deploymentEnabled` set to `false`.
- Automatic deployments should stay off until an explicit controlled deploy window.
- The repo contains deployable Vercel API route files, but production readiness depends on environment variables, auth checks, storage decisions, and live route QA.

## OpenAPI Action Safety

Production Custom GPT Action import should use:

```text
actions/openapi.production.yaml
```

The production-safe route set is:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

Do not import these into the production GPT Action spec:

```text
/api/tally/partner-intake-webhook
/api/admin/*
/api/leads/submit
/api/tracking/*
/api/sync/*
/api/security/*
```

Root `actions/openapi.yaml` is now intended to mirror the production-safe import spec. Dev/admin/partner variants are for explicit non-production/internal planning only.

## Known Risks

- Some API files are mixed-generation scaffolds and do not all share the same auth helper style.
- Tracking link and event routes are deterministic stubs, not persistent attribution infrastructure.
- Admin review queue returns sample records and must not be treated as live production data.
- Static dashboard files include demo fixtures and should not receive user-provided production PII.
- `readRawBody` can fall back to `JSON.stringify(req.body)` if the body was already parsed; this is documented as a limitation for webhook signature verification.
- Existing future-roadmap folders such as `/database/`, `/auth/`, `/partner-portal/`, and `/admin-dashboard/` may already exist from later roadmap work; this sprint does not expand them.

## Recommended Next Step

Review and merge this hardening PR, then run local validation:

```powershell
npm install
npm run validate
```

After merge, update Custom GPT Actions from `actions/openapi.production.yaml` only after replacing placeholder server URLs and confirming Bearer auth.

## Relationship to Batches 31–45

This sprint is not Batch 31 and does not create the Batch 31 production datastore or audit log foundation. It repairs source-of-truth drift so the numbered production roadmap can resume cleanly.
