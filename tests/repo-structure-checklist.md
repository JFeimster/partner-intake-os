# Repo Structure Checklist — Partner Intake OS

## Purpose

Use this checklist to confirm Partner Intake OS files are placed correctly in the Partner Command Center repo.

## Test metadata

| Field | Value |
|---|---|
| Batch | 13 |
| Test type | Manual repo structure validation |
| Tester |  |
| Date |  |
| Branch |  |
| PR |  |

## Expected root folders

Check all folders that exist after the relevant batches are added:

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
- [ ] `/site/`

For Batch 13 specifically, expected new/updated folders are only:

- [ ] `/github/`
- [ ] `/tests/`

## Expected site path

- [ ] Static dashboard path is `/site/partner-intake/`.
- [ ] Dashboard index is `/site/partner-intake/index.html`.
- [ ] Dashboard CSS is `/site/partner-intake/styles.css`.
- [ ] Dashboard JS is `/site/partner-intake/script.js`.
- [ ] Dashboard sample data is under `/site/partner-intake/data/`.
- [ ] No duplicate `/site/partner-intake/partner-intake/` folder exists.

## Expected API paths

Prior API scaffold should use:

- [ ] `/api/health.ts`
- [ ] `/api/tally/partner-intake-webhook.ts`
- [ ] `/api/partners/classify.ts`
- [ ] `/api/partners/recommend-resources.ts`
- [ ] `/api/partners/generate-onboarding-plan.ts`
- [ ] `/api/partners/generate-campaign-kit.ts`
- [ ] `/api/partners/log-event.ts`

Batch 13 should not create or modify these API files.

## Expected action files

Prior OpenAPI Action Pack should include safe GPT-facing files under `/actions/`.

- [ ] OpenAPI YAML exists.
- [ ] OpenAPI JSON exists.
- [ ] Action README/auth/test docs exist.
- [ ] Tally webhook endpoint is not exposed in GPT Actions.
- [ ] Bearer auth is documented.

Batch 13 should not create or modify Action Pack behavior.

## Expected setup packet files

Prior setup packets should exist if Batches 08–09 have been added:

- [ ] `/gpt-setup/`
- [ ] `/tally-setup/`

Batch 13 setup docs should exist:

- [ ] `/github/README.md`
- [ ] `/github/repo-integration-guide.md`
- [ ] `/github/file-placement-map.md`
- [ ] `/github/pr-checklist.md`
- [ ] `/github/branching-and-commit-guide.md`
- [ ] `/github/repo-audit-checklist.md`
- [ ] `/github/manual-add-instructions.md`
- [ ] `/github/release-notes-template.md`
- [ ] `/tests/repo-structure-checklist.md`

## Forbidden structure checks

Fail the check if any of these are present from the active build:

- [ ] `/modules/partner-intake-os/`
- [ ] `/modules/gpt/`
- [ ] `/partner-intake-os/gpt/`
- [ ] `/github/github/`
- [ ] `/site/partner-intake/partner-intake/`
- [ ] Project-name repeated in every filename

## Pass/fail checklist

| Check | Pass | Fail | Notes |
|---|---:|---:|---|
| Batch 13 files exist | [ ] | [ ] |  |
| Only Batch 13 files changed | [ ] | [ ] |  |
| Root-level folder convention preserved | [ ] | [ ] |  |
| No forbidden nested module path | [ ] | [ ] |  |
| No deployment files added early | [ ] | [ ] |  |
| No Notion/HubSpot/lead/tracking/admin files added early | [ ] | [ ] |  |
| No secrets committed | [ ] | [ ] |  |
| No real PII committed | [ ] | [ ] |  |
| No prohibited funding claims | [ ] | [ ] |  |
| PR checklist completed | [ ] | [ ] |  |

## Commands for verification

```powershell
git status
git diff --name-only
git diff --stat
git diff --check
Get-ChildItem -Directory
Get-ChildItem -Recurse -Directory | Where-Object { $_.FullName -match "modules|partner-intake-os|github\github|partner-intake\partner-intake" } | Select-Object FullName
```

## Final result

- [ ] Pass — ready for PR/merge
- [ ] Fail — fix structure before PR
- [ ] Needs review — conflict touches API, deployment, auth, or routing

## Notes

```text
Add reviewer notes here.
```
