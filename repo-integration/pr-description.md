# PR Description — Phase 21 Repo Integration + Merge Validation

## Summary

Adds the Phase 21 repo integration and merge validation packet for Partner Intake OS inside the Moonshine Partner Command Center repo.

This PR prepares the repo for the next controlled phases by documenting folder placement, conflict handling, static route validation, pre/post-merge checks, and a local structure validation script.

## Files added

```text
/repo-integration/README.md
/repo-integration/batches-13-20-merge-plan.md
/repo-integration/file-conflict-resolution.md
/repo-integration/root-folder-audit.md
/repo-integration/static-path-validation.md
/repo-integration/pre-merge-checklist.md
/repo-integration/post-merge-checklist.md
/repo-integration/pr-description.md
/scripts/validate-partner-intake-structure.ps1
/tests/merge-validation-checklist.md
```

## What changed

- Added merge guidance for completed Partner Intake OS Batches 13–20.
- Added root-folder audit checklist for the expected functional folders.
- Added static path validation for `/site/partner-intake/`.
- Added pre-merge and post-merge checklists.
- Added conflict-resolution rules for docs, static pages, tests, and `vercel.json`.
- Added a non-destructive PowerShell structure validation script.
- Added a manual pass/fail merge validation checklist.

## What did not change

- No production API implementation was added.
- No production storage sync was added.
- No admin auth was added.
- No real Tally webhook connection was configured.
- No Vercel environment variables were added.
- No secrets or private keys were added.
- No real partner or lead PII was added.

## Validation performed

- [ ] Repo branch checked.
- [ ] Expected files reviewed.
- [ ] Structure validator executed.
- [ ] Static routes reviewed locally.
- [ ] No-secrets check performed.
- [ ] Compliance copy check performed.
- [ ] No Tally webhook exposure in GPT Actions confirmed.

## Screenshots to attach

Attach screenshots for:

- Local `/site/partner-intake/`
- Local `/site/partner-intake/submit-lead.html`
- Local `/site/partner-intake/tracking-link-builder.html`
- Local `/site/partner-intake/admin/`
- PowerShell validation script output
- `git diff --stat`

## Deployment notes

This PR should not require a production deployment to validate its docs/checklist files.

If deployed:

- Confirm Vercel auto-deploy behavior first.
- Confirm no API routes were changed.
- Confirm existing static routes still load.
- Confirm Partner Intake routes load only if corresponding static files were already merged from prior batches.

## Risk notes

Main risks:

- Accidentally nesting prior batch folders instead of flattening into root-level functional folders.
- Overwriting existing static app files.
- Accidentally introducing real secrets or PII.
- Treating example-only API files as production endpoints.
- Exposing the Tally webhook in GPT Actions.

Mitigation:

- Run `/scripts/validate-partner-intake-structure.ps1`.
- Review `/repo-integration/pre-merge-checklist.md`.
- Review `/repo-integration/file-conflict-resolution.md`.

## Rollback notes

If this PR causes issues, it can be reverted safely because it is documentation/checklist/script focused.

Rollback command:

```powershell
git revert <merge_commit_sha>
git push origin main
```

## Next phase

After this PR is merged and validated:

```text
Continue Phase 22
```

Next phase: Vercel Deployment Test Window.
