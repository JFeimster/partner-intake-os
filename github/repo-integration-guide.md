# Repo Integration Guide

## Purpose

This guide explains how to integrate Partner Intake OS files into the Partner Command Center repo cleanly. The goal is simple: keep the operating system modular, reviewable, and deploy-safe.

## Recommended integration flow

1. Pull the latest default branch.
2. Create a new batch-specific branch.
3. Inspect the repo structure before copying files.
4. Add files into root-level functional folders.
5. Avoid duplicate nested folders.
6. Run structure and security checks.
7. Commit only the current batch files.
8. Push and open a PR.
9. Review using `/github/pr-checklist.md`.
10. Merge only after checks pass.

## Inspect repo structure

From the local repo root:

```powershell
Get-Location
Get-ChildItem -Force
Get-ChildItem -Directory
```

Optional deeper scan:

```powershell
Get-ChildItem -Recurse -Depth 2 | Select-Object FullName
```

Git state check:

```powershell
git status
git branch --show-current
git remote -v
```

## Add Partner Intake OS folders

Place files at the repo root using concise functional folders:

```text
/gpt/
/knowledge/
/schemas/
/tally/
/api/
/lib/
/storage/
/actions/
/gpt-setup/
/tally-setup/
/dashboard-contracts/
/workflows/
/github/
/tests/
/site/partner-intake/
```

Do not create:

```text
/modules/partner-intake-os/
/modules/
/partner-intake-os/
```

unless you intentionally choose a module wrapper for the whole repo. For the active build, the cleaner path is root-level functional folders.

## Avoid duplicate nested folders

Before copying, check for bad duplicates:

```powershell
Get-ChildItem -Recurse -Directory | Where-Object {
  $_.FullName -match "modules|partner-intake-os|partner-intake"
} | Select-Object FullName
```

Bad patterns:

```text
/modules/partner-intake-os/gpt/instructions.md
/partner-intake-os/gpt/instructions.md
/site/partner-intake/partner-intake/index.html
/github/github/pr-checklist.md
```

Good patterns:

```text
/gpt/instructions.md
/knowledge/partner-types.md
/schemas/intake.schema.json
/site/partner-intake/index.html
/github/pr-checklist.md
```

## Handle existing root folders

### Existing `/api/`

If the repo already has API routes, add Partner Intake OS routes under their intended path without breaking existing routes:

```text
/api/health.ts
/api/tally/partner-intake-webhook.ts
/api/partners/classify.ts
```

If `/api/health.ts` already exists, do not overwrite blindly. Compare behavior first. Options:

- keep existing global health endpoint and add Partner Intake OS details
- create `/api/partner-intake/health.ts` only if the repo architecture requires namespacing
- document the conflict in the PR

### Existing `/site/`

Keep static dashboard files under:

```text
/site/partner-intake/
```

Do not move unrelated site pages.

### Existing `/actions/`

Add OpenAPI Action Pack files directly into `/actions/`. If older action files exist, keep names explicit but concise.

### Existing `/schemas/`

Add Partner Intake OS schemas at `/schemas/`. If there is already a generic `profile.schema.json`, avoid overwriting. Use the active batch filenames from prior batches.

### Existing `/workflows/`

Add workflow Markdown specs into `/workflows/`. These are docs/specs, not automation runtime files.

### Existing `/storage/`

Use `/storage/` for docs and setup notes. Use `/lib/storage/` for TypeScript connector stubs.

## Verify root-level folder convention

Run this from repo root:

```powershell
Get-ChildItem -Directory | Select-Object Name
```

Expected folders include some or all of:

```text
gpt
knowledge
schemas
tally
api
lib
storage
actions
gpt-setup
tally-setup
dashboard-contracts
workflows
github
tests
site
```

Scan for forbidden paths:

```powershell
Get-ChildItem -Recurse | Where-Object {
  $_.FullName -match "modules\partner-intake-os|modules/partner-intake-os|partner-intake-os"
} | Select-Object FullName
```

If any files appear only because old source docs mentioned historical paths, inspect before deleting. Do not carpet-bomb the repo like a caffeine-loaded intern.

## Prepare for PR review

Before opening a PR:

```powershell
git status
git diff --stat
git diff --check
```

Review changed files manually:

```powershell
git diff --name-only
```

Confirm:

- [ ] only intended files are changed
- [ ] no secrets were added
- [ ] no real PII was added
- [ ] file paths follow the root-level convention
- [ ] static site files still sit under `/site/partner-intake/`
- [ ] Tally webhook is not exposed in GPT Actions
- [ ] docs are clear enough for future Jason to understand without archaeology gear

## PR review posture

Use the PR as a gate, not a ceremonial speed bump. If a file path is messy now, it becomes repo mold later.

Merge only when the file tree, naming, security posture, and future batch boundaries are clean.
