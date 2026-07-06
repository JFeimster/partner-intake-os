# File Placement Map

## Purpose

This map defines where Partner Intake OS folders belong inside the Partner Command Center repo. Use it before copying files, during PR review, and when resolving conflicts.

## Placement table

| Source/root folder | Intended repo location | Purpose | Conflict notes | Merge decision |
|---|---|---|---|---|
| `/gpt/` | `/gpt/` | Custom GPT instructions, profile, starters, output formats, tests | If the repo has a global GPT folder, keep Partner Intake files clear by filename but do not add project-name spam | Add or update only Partner Intake OS GPT files |
| `/knowledge/` | `/knowledge/` | Knowledge files uploaded to Custom GPT | Avoid duplicate names like `partner-tiering-rules.md` vs `tiering-rules.md`; keep active shorter names | Keep current active convention from completed batches |
| `/schemas/` | `/schemas/` | JSON schemas for intake, profile, scoring, onboarding, resources, campaigns, events, errors | Do not overwrite unrelated schemas | Add Partner Intake OS schemas; resolve name conflicts manually |
| `/tally/` | `/tally/` | Tally form fields, field map, webhook setup, samples | Keep sample data fictional | Add directly |
| `/api/` | `/api/` | Vercel API route scaffold | Check existing routes before overwrite, especially `/api/health.ts` | Merge route-by-route; do not break existing app |
| `/lib/` | `/lib/` | Auth, env, normalizers, scoring, recommendations, storage helpers | Existing shared libs may already exist | Prefer additive files; import carefully |
| `/storage/` | `/storage/` | Storage docs and sample partner record | Do not store live data | Add docs/sample only |
| `/actions/` | `/actions/` | OpenAPI Action Pack, auth notes, test cases | Do not expose Tally webhook endpoint | Add GPT-facing only |
| `/gpt-setup/` | `/gpt-setup/` | Custom GPT setup packet | No major conflicts expected | Add directly |
| `/tally-setup/` | `/tally-setup/` | Tally webhook implementation setup packet | Avoid duplicating `/tally/` mapping docs | Add directly |
| `/dashboard-contracts/` | `/dashboard-contracts/` | Dashboard data schemas and sample payload | Keep schemas aligned with `/schemas/` | Add directly |
| `/workflows/` | `/workflows/` | n8n/Activepieces/HubSpot/Notion workflow specs | If existing workflow docs exist, keep Partner Intake names distinct | Add directly |
| `/site/partner-intake/` | `/site/partner-intake/` | Static Partner Intake dashboard MVP | Do not move to root site unless routing requires it | Add under exact path |
| `/github/` | `/github/` | Repo integration, PR, branching, audit, release docs | If repo already has `.github/`, do not confuse the two | `/github/` is docs; `.github/` is automation |
| `/deployment/` | `/deployment/` | Vercel deployment docs for Batch 14 | Do not create in Batch 13 unless already exists from another workflow | Future Batch 14 location |
| `/notion/` | `/notion/` | Notion database setup packet for Batch 16 | Do not create in Batch 13 | Future Batch 16 location |
| `/hubspot/` | `/hubspot/` | HubSpot property/pipeline setup packet for Batch 17 | Do not create in Batch 13 | Future Batch 17 location |
| `/lead-submission/` | `/lead-submission/` | Lead submission specs for Batch 18 | Do not create in Batch 13 | Future Batch 18 location |
| `/tracking/` | `/tracking/` | Partner tracking link specs for Batch 19 | Do not create in Batch 13 | Future Batch 19 location |
| `/tests/` | `/tests/` | Manual validation checklists and test logs | Existing tests may be automated; keep Markdown checklists clear | Add or update docs-only checklists |

## Folder conflict rules

### Rule 1: Do not duplicate the project name in paths

Bad:

```text
/modules/partner-intake-os/github/pr-checklist.md
/partner-intake-os/github/pr-checklist.md
/github/partner-intake-os-pr-checklist.md
```

Good:

```text
/github/pr-checklist.md
```

### Rule 2: Do not overwrite existing app-critical files without comparison

High-risk files:

```text
/vercel.json
/api/health.ts
/site/index.html
/package.json
/tsconfig.json
```

Batch 13 should not modify these files.

### Rule 3: Preserve static dashboard path

Correct:

```text
/site/partner-intake/index.html
/site/partner-intake/styles.css
/site/partner-intake/script.js
```

Wrong:

```text
/site/index.html
/partner-intake/index.html
/dashboard/partner-intake/index.html
```

### Rule 4: GitHub is source control, not live storage

Use GitHub for source files, schemas, docs, OpenAPI specs, samples, and static UI. Do not use GitHub for live partner records, lead submissions, webhook payload logs, or CRM activity history.

## Merge decision notes

When two files overlap, choose one of these decisions in the PR:

| Decision | Use when | Example |
|---|---|---|
| Keep existing | Existing file is broader and already supports the needed behavior | Existing `/api/health.ts` is used by the whole site |
| Replace with batch file | Existing file is stale, unused, or wrong | Old placeholder checklist lacks current batch rules |
| Merge both | Existing file has useful repo-specific details and batch file has better structure | Combine repo-specific local path with new checklist |
| Rename new file | Existing filename is occupied by unrelated feature | Rename only if needed and document why |
| Stop and review | Conflict touches deployment, auth, secrets, or route behavior | `vercel.json`, auth middleware, webhook paths |

## Final placement sanity check

From repo root:

```powershell
git diff --name-only
```

Expected Batch 13 output should only include:

```text
github/README.md
github/repo-integration-guide.md
github/file-placement-map.md
github/pr-checklist.md
github/branching-and-commit-guide.md
github/repo-audit-checklist.md
github/manual-add-instructions.md
github/release-notes-template.md
tests/repo-structure-checklist.md
```
