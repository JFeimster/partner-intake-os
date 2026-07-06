# Branching and Commit Guide

## Purpose

This guide keeps Partner Intake OS build batches isolated, reviewable, and easy to roll back. Clean branches beat mystery commits. Mystery commits are how repos develop haunted basement energy.

## Branch naming

Use one branch per batch.

Recommended format:

```text
batch-13-github-integration
batch-14-vercel-deployment-config
batch-15-openapi-validation-repair
batch-16-notion-setup-packet
batch-17-hubspot-setup-packet
batch-18-lead-submission-module
batch-19-tracking-link-builder
batch-20-admin-review-dashboard
```

Alternative format if using issue numbers:

```text
issue-123-batch-13-github-integration
```

## Create a branch

```powershell
git checkout main
git pull origin main
git checkout -b batch-13-github-integration
```

If the default branch is not `main`, replace it with the actual default branch.

## Commit naming examples

Use clear commits that explain what changed.

Good:

```text
Add Batch 13 GitHub integration packet
Add repo audit and PR checklist docs
Add manual repo add instructions
```

Better if using Conventional Commits:

```text
docs: add Batch 13 GitHub integration packet
docs: add repo audit checklist for Partner Intake OS
test: add repo structure checklist
```

Bad:

```text
update stuff
more files
fixed things
partner intake os final final REAL final
```

## PR title examples

```text
Batch 13: Add GitHub repo integration packet
Batch 14: Add Vercel deployment configuration packet
Batch 15: Add OpenAPI validation and GPT Action repair packet
```

## PR description template

```markdown
## Summary
Adds Batch XX for Partner Intake OS.

## Scope
- Created only the files listed for this batch
- Preserved root-level functional folders
- Did not modify completed batches unless explicitly required

## Files added
- /path/file.md
- /path/file.json

## Validation performed
- [ ] File tree reviewed
- [ ] Markdown/docs reviewed
- [ ] No secrets committed
- [ ] No real PII committed
- [ ] No prohibited funding/credit claims
- [ ] No future batch files added

## Setup notes
Any manual setup required after merge:
- None / describe here

## Next step
Stop here. Next continuation phrase: Continue Batch YY.
```

## Conventional commit options

Recommended types for this project:

| Type | Use for |
|---|---|
| `docs` | Markdown setup guides, packet docs, release notes |
| `feat` | New user-facing module, dashboard page, API endpoint |
| `test` | Test checklists, test payloads, test fixtures |
| `chore` | Repo organization, config-only maintenance |
| `fix` | Bug fixes, broken links, broken API behavior |
| `security` | Secret handling, auth, webhook protection |

Examples:

```text
docs: add Batch 13 GitHub integration packet
test: add repo structure validation checklist
feat: add partner lead submission static module
security: document action token rotation workflow
```

## Keep batches isolated

One branch equals one batch. Do not stack Batch 14 on Batch 13 unless Batch 13 has merged or the user explicitly wants a stacked branch.

Rules:

- Batch 13 branch should only include `/github/` and `/tests/repo-structure-checklist.md`.
- Batch 14 should create `/deployment/`, `/vercel.json`, and Vercel tests only.
- Batch 15 should modify/create `/actions/` validation files and relevant `/tests/` files only.
- Batch 18–20 static dashboard modules should not sneak into earlier branches.

## Rollback notes

If a PR was merged by mistake:

```powershell
git checkout main
git pull origin main
git log --oneline
```

Revert the merge commit:

```powershell
git revert -m 1 <merge_commit_sha>
git push origin main
```

If it was squash-merged:

```powershell
git revert <squash_commit_sha>
git push origin main
```

If the PR has not merged yet, close it or force-push a corrected branch.

## Review before push

```powershell
git status
git diff --name-only
git diff --stat
git diff --check
```

Then commit:

```powershell
git add github tests/repo-structure-checklist.md
git commit -m "docs: add Batch 13 GitHub integration packet"
git push -u origin batch-13-github-integration
```

## Merge strategy

Recommended for batch docs:

- Squash merge if the PR has several tiny commits.
- Merge commit if preserving batch branch history matters.
- Rebase merge only if the repo already uses that style.

Pick one, document the norm, and keep it boring. Boring Git is profitable Git.
