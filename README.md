# Partner Intake OS

Partner Intake OS is the partner operations layer for the Moonshine Capital / Partner Command Center ecosystem. It turns partner signups, referral partner notes, affiliate inquiries, broker applications, center-of-influence profiles, and partner-sourced leads into structured operating intelligence.

It is designed to classify partners, score and tier them, recommend onboarding paths, generate CRM-ready fields, recommend resources and campaign kits, support tracking/lead intake modules, and prepare dashboard-ready records without pretending to be a lender, approval engine, or live CRM.

## System architecture

```text
Tally intake form
→ Vercel API webhook receiver
→ normalization and scoring logic
→ storage layer / audit log
→ Notion / HubSpot / Google Sheets / future database
→ Custom GPT Actions
→ Partner Dashboard / Admin Review Queue
```

GitHub is the source-code and documentation vault. It is not the live partner database.

## Folder map

```text
/
├── README.md
├── STATUS.md
├── actions/                 # OpenAPI specs and GPT Action docs
├── admin-auth/              # Admin auth docs and auth helper context
├── admin-dashboard/          # Admin dashboard planning/contracts from later roadmap work
├── api/                     # Vercel serverless API routes
├── auth/                    # Auth/session planning docs from later roadmap work
├── dashboard-contracts/      # Dashboard data contracts
├── database/                # Future datastore docs from later roadmap work; not production DB code in this sprint
├── docs/                    # Source-of-truth maps and hardening notes
├── examples/                # Sample payloads and fixtures
├── gpt/                     # Custom GPT instructions, profile, output formats, starters
├── hubspot/                 # HubSpot setup docs
├── knowledge/               # GPT knowledge files
├── lead-submission/          # Partner lead submission docs/contracts
├── lib/                     # Shared API logic and validation helpers
├── notion/                  # Notion setup docs
├── partner-portal/           # Future partner portal docs/contracts from later roadmap work
├── schemas/                 # JSON schemas
├── scripts/                 # Validation scripts
├── site/partner-intake/      # Static dashboard/demo shell
├── tally/                   # Tally field maps and sample webhook payloads
├── tally-setup/             # Tally implementation packet
├── tests/                   # QA and validation checklists
├── tracking/                # Tracking link docs/contracts
└── workflows/               # Automation workflow specs
```

## Completed areas

- GPT foundation and knowledge docs exist.
- JSON schemas and dashboard contracts exist.
- Tally mapping and webhook setup docs exist.
- Vercel API routes exist for health, classification, onboarding, GPT event logging, lead submission, tracking link creation, tracking event logging, and sample admin review queue.
- Static Partner Intake dashboard MVP exists at `/site/partner-intake/`.
- Admin review queue routes/pages exist, but they remain sample/demo unless backed by approved production storage and auth.
- OpenAPI variants exist under `/actions/`.

## Live vs stub vs planned warning

This repo contains a mix of live routes, stubs, docs-only files, demo-only dashboard files, and future roadmap scaffolding. Do not assume every file is production-ready because it exists.

Use `STATUS.md` and `docs/live-vs-planned-routes.md` before wiring GPT Actions, Tally, Vercel, Notion, HubSpot, or dashboard modules.

Key truth:

- `/api/health` is a lightweight live health route.
- `/api/partners/classify` is a live GPT-facing classification route requiring Bearer auth.
- `/api/partners/log-event` is implemented but returns stub/non-persistent logging.
- `/api/leads/submit` is implemented as a review-based intake endpoint, not an approval or funding engine.
- `/api/tracking/create-link` and `/api/tracking/log-event` are implemented stubs and do not persist attribution records yet.
- `/api/admin/review-queue` is protected and sample/demo data only unless connected to approved storage.
- `/api/tally/partner-intake-webhook` is public inbound infrastructure for Tally only. Do not import it into GPT Actions.

## Safe GPT Action route policy

Production Custom GPT Actions must expose only safe GPT-facing routes:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

Do not expose these through the production GPT Action spec unless separately confirmed as safe, implemented, and intentionally GPT-facing:

```text
/api/tally/partner-intake-webhook
/api/admin/*
/api/leads/submit
/api/tracking/*
/api/sync/*
/api/security/*
```

## OpenAPI import guidance

Use this file for the production Custom GPT Action import:

```text
actions/openapi.production.yaml
```

The root file is intentionally production-safe too:

```text
actions/openapi.yaml
```

Still, the boring rule wins: verify server URL, token setup, route implementation, and `docs/openapi-import-guide.md` before importing anything into a live GPT.

## Local setup

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center\partner-intake-os"

npm install
npm run validate
```

Static dashboard local preview:

```powershell
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/site/partner-intake/
```

## Validation commands

```powershell
npm run validate:json
npm run validate:openapi
npm run validate
npm run validate:structure
```

`validate:structure` uses PowerShell and may report planned-folder warnings depending on how much of the later roadmap has been merged.

## Deployment notes

- Vercel is the API/runtime layer.
- `vercel.json` currently has `git.deploymentEnabled` set to `false`; do not turn automatic deployments on during hardening.
- Replace placeholder server URLs in OpenAPI specs before live use.
- Configure required environment variables before testing protected routes.
- Keep API/admin responses no-store.
- Use a controlled deploy window for any production endpoint test.

## Required environment variables

```text
PARTNER_INTAKE_ACTION_TOKEN
TALLY_SIGNING_SECRET
PARTNER_INTAKE_ENV
PARTNER_INTAKE_STORAGE_MODE
PARTNER_ADMIN_TOKEN
PARTNER_ADMIN_SESSION_SECRET
PARTNER_TRACKING_API_TOKEN
TRACKING_BASE_URL
PARTNER_BASE_URL
NOTION_API_KEY
NOTION_PARTNER_DATABASE_ID
HUBSPOT_ACCESS_TOKEN
HUBSPOT_PARTNER_PIPELINE_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
```

Only configure the variables needed for the route being tested. Never commit secrets.

## Compliance guardrails

Do not create, store, or publish copy that implies:

- guaranteed approval
- everyone qualifies
- guaranteed funding
- guaranteed commissions
- instant approval
- guaranteed lender review
- no documents needed
- risk-free funding
- guaranteed income

Use review-safe language:

```text
received for review
manual review required
readiness-based
funding options may vary
no approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed
```

Do not store API keys, tokens, admin sessions, partner PII, borrower PII, lead PII, contact records, private notes, audit logs, approval decisions, or commission data in `localStorage` or static JSON.

## Roadmap pointer

This hardening sprint is not Batch 31. Batch 31 in the numbered production roadmap is reserved for Production Data Store + Audit Log Foundation. Do not use this sprint name for Batch 31 work and do not treat this cleanup as production datastore implementation.

For the current repo truth, start with:

- `STATUS.md`
- `docs/live-vs-planned-routes.md`
- `docs/source-of-truth-map.md`
- `docs/openapi-import-guide.md`
