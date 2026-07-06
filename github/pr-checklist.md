# Pull Request Checklist — Partner Intake OS

## PR metadata

- PR title: `Batch 13: Add GitHub repo integration packet`
- Branch: `batch-13-github-integration`
- Target: default repo branch, usually `main`
- Scope: GitHub integration docs and repo structure checklist only

## Pre-PR checklist

- [ ] Latest default branch pulled locally.
- [ ] New batch-specific branch created.
- [ ] Working tree was clean before changes.
- [ ] Only Batch 13 files were added.
- [ ] No future Batch 14–20 files were created.
- [ ] No completed Batch 01–12 files were rewritten unnecessarily.
- [ ] File paths use root-level functional folders.
- [ ] No `/modules/partner-intake-os/` folder was added.

## Files added checklist

Expected Batch 13 files:

- [ ] `/github/README.md`
- [ ] `/github/repo-integration-guide.md`
- [ ] `/github/file-placement-map.md`
- [ ] `/github/pr-checklist.md`
- [ ] `/github/branching-and-commit-guide.md`
- [ ] `/github/repo-audit-checklist.md`
- [ ] `/github/manual-add-instructions.md`
- [ ] `/github/release-notes-template.md`
- [ ] `/tests/repo-structure-checklist.md`

## Local validation checklist

Run:

```powershell
git status
git diff --stat
git diff --check
```

Confirm:

- [ ] No whitespace errors from `git diff --check`.
- [ ] Markdown renders cleanly.
- [ ] File tree is readable.
- [ ] No broken relative paths in docs.
- [ ] No accidental binary or cache files added.

## API validation checklist

Batch 13 does not create or modify API code. Still confirm prior API files were not accidentally changed:

- [ ] `/api/health.ts` unchanged unless intentionally reviewed.
- [ ] `/api/tally/partner-intake-webhook.ts` unchanged.
- [ ] `/api/partners/classify.ts` unchanged.
- [ ] `/api/partners/recommend-resources.ts` unchanged.
- [ ] `/api/partners/generate-onboarding-plan.ts` unchanged.
- [ ] `/api/partners/generate-campaign-kit.ts` unchanged.
- [ ] `/api/partners/log-event.ts` unchanged.

## OpenAPI validation checklist

Batch 13 does not modify the Action Pack. Confirm no accidental changes:

- [ ] OpenAPI YAML unchanged.
- [ ] OpenAPI JSON unchanged.
- [ ] Tally webhook endpoint is still not exposed to GPT Actions.
- [ ] Operation IDs remain stable:
  - [ ] `checkHealth`
  - [ ] `classifyPartnerIntake`
  - [ ] `recommendPartnerResources`
  - [ ] `generatePartnerOnboardingPlan`
  - [ ] `generatePartnerCampaignKit`
  - [ ] `logPartnerEvent`

## Static dashboard validation checklist

Batch 13 does not modify static dashboard UI. Confirm:

- [ ] `/site/partner-intake/index.html` unchanged.
- [ ] `/site/partner-intake/styles.css` unchanged.
- [ ] `/site/partner-intake/script.js` unchanged.
- [ ] Sample JSON under `/site/partner-intake/data/` unchanged.
- [ ] No static dashboard files moved to a different path.

## Security checklist

- [ ] No `.env` files committed.
- [ ] No Vercel token committed.
- [ ] No Tally signing secret committed.
- [ ] No GPT Action bearer token committed.
- [ ] No Notion API key committed.
- [ ] No HubSpot access token committed.
- [ ] No Google private key committed.
- [ ] No real partner/customer PII committed.
- [ ] No webhook payloads from real submissions committed.
- [ ] No logs with request headers or secrets committed.

## Compliance checklist

- [ ] No guaranteed approval language.
- [ ] No guaranteed funding amount language.
- [ ] No fake lender certainty.
- [ ] No credit repair positioning.
- [ ] No deceptive urgency.
- [ ] No invented testimonials.
- [ ] No “everyone qualifies” claims.
- [ ] Funding content stays educational, readiness-based, and operational.
- [ ] Human review remains required for risk flags and partner approval decisions.

## Reviewer checklist

- [ ] Reviewer confirms Batch 13 scope only.
- [ ] Reviewer checks file placement.
- [ ] Reviewer checks commands are safe and copy/paste-ready.
- [ ] Reviewer confirms repo guidance matches actual repo structure.
- [ ] Reviewer confirms no future deployment config was added.
- [ ] Reviewer confirms no real data/secrets were added.
- [ ] Reviewer confirms docs explain rollback/branch discipline enough for future batches.

## Merge readiness checklist

- [ ] Branch is up to date with default branch.
- [ ] All comments resolved.
- [ ] No unintended changed files.
- [ ] Manual validation complete.
- [ ] PR title and description are clear.
- [ ] Release notes template updated if needed.
- [ ] Merge method selected intentionally.

## Recommended PR description

```markdown
## Summary
Adds Batch 13 GitHub integration docs for Partner Intake OS.

## Files added
- /github/README.md
- /github/repo-integration-guide.md
- /github/file-placement-map.md
- /github/pr-checklist.md
- /github/branching-and-commit-guide.md
- /github/repo-audit-checklist.md
- /github/manual-add-instructions.md
- /github/release-notes-template.md
- /tests/repo-structure-checklist.md

## Validation
- [ ] Confirmed root-level folder convention
- [ ] Confirmed no secrets or PII
- [ ] Confirmed no Batch 14+ files
- [ ] Confirmed docs-only scope

## Notes
Batch 14 should only begin after explicit instruction: Continue Batch 14.
```
