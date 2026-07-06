# Repo Audit Checklist

## Purpose

Use this checklist before opening or merging a Partner Intake OS PR. It catches repo mess before it becomes production archaeology.

## Top-level folder audit

Expected top-level folders across the full Partner Intake OS build:

- [ ] `/gpt/`
- [ ] `/knowledge/`
- [ ] `/schemas/`
- [ ] `/tally/`
- [ ] `/api/`
- [ ] `/lib/`
- [ ] `/storage/`
- [ ] `/actions/`
- [ ] `/gpt-setup/`
- [ ] `/tally-setup/`
- [ ] `/dashboard-contracts/`
- [ ] `/workflows/`
- [ ] `/github/`
- [ ] `/tests/`
- [ ] `/site/partner-intake/`

Run:

```powershell
Get-ChildItem -Directory | Sort-Object Name | Select-Object Name
```

Flag:

- [ ] Unexpected `/modules/`
- [ ] Unexpected `/partner-intake-os/`
- [ ] Duplicate nested `/site/partner-intake/partner-intake/`
- [ ] Duplicate `/github/github/`

## Duplicate file audit

Run:

```powershell
Get-ChildItem -Recurse -File | Group-Object Name | Where-Object Count -gt 1 | Select-Object Name, Count
```

Review duplicates manually. Some duplicates are acceptable, such as `README.md` in separate folders. Risky duplicates include:

- [ ] `instructions.md`
- [ ] `openapi.yaml`
- [ ] `openapi.json`
- [ ] `sample-partner-profile.json`
- [ ] `vercel.json`
- [ ] `health.ts`

## Naming convention audit

Confirm:

- [ ] Filenames are concise.
- [ ] Files do not repeat `partner-intake-os` unless needed for clarity in exported artifacts.
- [ ] Markdown files use kebab-case.
- [ ] JSON schemas end with `.schema.json`.
- [ ] Static files use standard names: `index.html`, `styles.css`, `script.js`.
- [ ] Test checklist files clearly describe what they test.

Bad patterns:

```text
partner-intake-os-partner-intake-github-guide.md
Partner Intake OS Final v2.md
copy of openapi.json
```

Good patterns:

```text
repo-integration-guide.md
file-placement-map.md
repo-structure-checklist.md
```

## Dead file audit

Look for files that should not be in the repo:

```powershell
Get-ChildItem -Recurse -File | Where-Object {
  $_.Name -match "copy|final|backup|old|temp|tmp|draft"
} | Select-Object FullName
```

Check:

- [ ] No duplicate drafts.
- [ ] No abandoned generated files.
- [ ] No unused screenshot dumps.
- [ ] No old OpenAPI files that could confuse GPT Action setup.
- [ ] No stale sample data with outdated field names.

## Secrets audit

Run:

```powershell
Select-String -Path .\* -Pattern "sk-|api_key|secret|token|private_key|BEGIN PRIVATE KEY|Bearer " -Recurse -ErrorAction SilentlyContinue
```

Flag:

- [ ] Real API keys
- [ ] Real bearer tokens
- [ ] Tally signing secrets
- [ ] Notion API keys
- [ ] HubSpot private app tokens
- [ ] Google private keys
- [ ] Vercel tokens
- [ ] Hardcoded auth headers

Placeholders are acceptable when obvious:

```text
YOUR_PARTNER_INTAKE_ACTION_TOKEN
YOUR_VERCEL_DOMAIN
YOUR_TALLY_SIGNING_SECRET
```

## Generated artifact audit

Do not commit unless intentionally needed:

- [ ] `node_modules/`
- [ ] `.next/`
- [ ] `dist/`
- [ ] `build/`
- [ ] `.vercel/`
- [ ] `coverage/`
- [ ] `.DS_Store`
- [ ] `Thumbs.db`
- [ ] local ZIP exports

Recommended `.gitignore` coverage:

```gitignore
.env
.env.*
!.env.example
node_modules/
.vercel/
.next/
dist/
build/
coverage/
.DS_Store
Thumbs.db
*.zip
```

## Static site audit

Confirm:

- [ ] Static dashboard remains under `/site/partner-intake/`.
- [ ] HTML does not reference missing CSS or JS.
- [ ] JS fetches local sample data from correct `/data/` path.
- [ ] Demo controls are labeled as demo/static.
- [ ] No real partner PII is displayed.
- [ ] No approval or funding guarantees in UI copy.

## API route audit

Confirm:

- [ ] GPT-facing endpoints require bearer auth except health if intentionally public.
- [ ] Tally webhook endpoint is not listed in GPT Actions.
- [ ] Webhook verifies signing secret when configured.
- [ ] API responses do not leak secrets.
- [ ] Error messages are useful but not overly revealing.
- [ ] Storage connector code does not hardcode credentials.

## OpenAPI alignment audit

Confirm OpenAPI paths match deployed API routes:

- [ ] `GET /api/health`
- [ ] `POST /api/partners/classify`
- [ ] `POST /api/partners/recommend-resources`
- [ ] `POST /api/partners/generate-onboarding-plan`
- [ ] `POST /api/partners/generate-campaign-kit`
- [ ] `POST /api/partners/log-event`

Confirm operation IDs:

- [ ] `checkHealth`
- [ ] `classifyPartnerIntake`
- [ ] `recommendPartnerResources`
- [ ] `generatePartnerOnboardingPlan`
- [ ] `generatePartnerCampaignKit`
- [ ] `logPartnerEvent`

Confirm exclusions:

- [ ] `POST /api/tally/partner-intake-webhook` is not exposed in OpenAPI Action Pack.

## Final audit result

| Area | Pass/fail | Notes |
|---|---|---|
| Top-level folders |  |  |
| Duplicate files |  |  |
| Naming convention |  |  |
| Dead files |  |  |
| Secrets |  |  |
| Generated artifacts |  |  |
| Static site |  |  |
| API routes |  |  |
| OpenAPI alignment |  |  |
| Compliance |  |  |

## Decision

- [ ] Ready to open PR
- [ ] Ready to merge
- [ ] Needs cleanup before PR
- [ ] Needs technical review
- [ ] Needs security review
