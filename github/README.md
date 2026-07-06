# GitHub Packet — Partner Intake OS Batch 13

## Purpose

This packet explains how to add the completed Partner Intake OS files to the Partner Command Center GitHub repo without turning the repo into a junk drawer with a deploy button.

Batch 13 is an integration and review layer. It does not create new API routes, dashboard UI, schemas, storage code, or deployment config. It helps you place, review, branch, commit, open a PR, validate, and merge the files already created in Batches 01–12.

## Where this fits after Batches 01–12

Batches 01–12 created the core Partner Intake OS operating system:

1. GPT foundation files
2. Knowledge base files
3. JSON schemas
4. Tally mapping
5. Vercel API scaffold
6. Storage connector stubs
7. OpenAPI Action Pack
8. Custom GPT setup packet
9. Tally webhook setup packet
10. Dashboard data contracts
11. Static dashboard MVP
12. Automation workflow docs

This packet is the repo control layer that makes those files GitHub-ready.

## Recommended repo destination

Use the existing Partner Command Center repository as the destination. Preserve the active root-level folder convention:

```text
/
├── gpt/
├── knowledge/
├── schemas/
├── tally/
├── api/
├── lib/
├── storage/
├── actions/
├── gpt-setup/
├── tally-setup/
├── dashboard-contracts/
├── workflows/
├── github/
├── tests/
└── site/partner-intake/
```

Do not wrap the files in `/modules/`, `/modules/partner-intake-os/`, or another repeated project-name folder unless the repo already has a hard architectural reason to do so.

## What should be committed

Commit source files, docs, schemas, static site files, sample JSON, OpenAPI specs, workflow specs, setup packets, and tests/checklists.

Recommended commit scope for Batch 13:

```text
/github/README.md
/github/repo-integration-guide.md
/github/file-placement-map.md
/github/pr-checklist.md
/github/branching-and-commit-guide.md
/github/repo-audit-checklist.md
/github/manual-add-instructions.md
/github/release-notes-template.md
/tests/repo-structure-checklist.md
```

## What should not be committed

Do not commit:

- `.env`, `.env.local`, `.env.production`, or any real environment file
- API tokens, signing secrets, service account keys, private keys, or webhook secrets
- Real partner submissions, real lead records, phone numbers, emails, SSNs, tax IDs, bank data, credit reports, or underwriting documents
- Live HubSpot/Notion export dumps containing partner or customer PII
- Generated build folders unless the repo intentionally tracks them
- Local system files such as `.DS_Store`, `Thumbs.db`, or editor cache folders

## PII and secret-handling warning

Partner Intake OS will eventually touch partner submissions, referral lead details, business contact data, and CRM records. GitHub is for source code and sample/demo data only. It is not the live partner database, not a webhook log bucket, and definitely not a place to park secrets like a raccoon hiding sandwiches.

Use Notion, HubSpot, Google Sheets, Supabase, or another controlled storage layer for live records. Use Vercel environment variables for secrets.

## Quick start checklist

- [ ] Create a new branch for this batch.
- [ ] Confirm repo root and current folder structure.
- [ ] Copy Batch 13 files into root-level `/github/` and `/tests/` folders.
- [ ] Confirm no `/modules/partner-intake-os/` duplicate nesting was introduced.
- [ ] Run `git status` and inspect every changed file.
- [ ] Validate Markdown readability.
- [ ] Confirm no secrets or real PII were added.
- [ ] Commit with a batch-specific message.
- [ ] Push branch and open PR.
- [ ] Use `/github/pr-checklist.md` before merge.

## Recommended PR title

```text
Batch 13: Add GitHub repo integration packet
```

## Stop rule

After this packet is merged or staged, stop. Batch 14 is Vercel deployment configuration and should not be created until explicitly requested.
