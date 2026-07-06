# Manual Add Instructions

## Purpose

Use this guide to manually add Partner Intake OS files to the local Partner Command Center repo, then push them to GitHub.

These commands assume Windows PowerShell.

## Example local repo path

```powershell
C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center
```

## Open the repo locally

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"
```

Confirm you are in the repo:

```powershell
Get-Location
git status
git remote -v
```

## Pull latest default branch

```powershell
git checkout main
git pull origin main
```

If the repo uses a different default branch, replace `main` with that branch.

## Create the Batch 13 branch

```powershell
git checkout -b batch-13-github-integration
```

## Copy files into the repo

Assume the generated Batch 13 folder is somewhere like:

```powershell
$Source = "C:\Users\jason\Downloads\partner-intake-os-batch-13"
$Repo = "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"
```

Copy the folders:

```powershell
$Source = "C:\Users\jason\Downloads\partner-intake-os-batch-13"
$Repo = "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"

New-Item -ItemType Directory -Force -Path "$Repo\github" | Out-Null
New-Item -ItemType Directory -Force -Path "$Repo\tests" | Out-Null

Copy-Item -Path "$Source\github\*" -Destination "$Repo\github" -Recurse -Force
Copy-Item -Path "$Source\tests\repo-structure-checklist.md" -Destination "$Repo\tests\repo-structure-checklist.md" -Force
```

## Verify files before pushing

```powershell
git status
git diff --name-only
git diff --stat
git diff --check
```

Expected changed files:

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

## Inspect the created file tree

```powershell
Get-ChildItem .\github
Get-ChildItem .\tests\repo-structure-checklist.md
```

Scan for accidental nested folders:

```powershell
Get-ChildItem -Recurse -Directory | Where-Object {
  $_.FullName -match "modules|partner-intake-os|github\\github|partner-intake\\partner-intake"
} | Select-Object FullName
```

## Add and commit

```powershell
git add github tests/repo-structure-checklist.md
git commit -m "docs: add Batch 13 GitHub integration packet"
```

## Push branch

```powershell
git push -u origin batch-13-github-integration
```

## Open a PR manually

After pushing, GitHub usually prints a PR link in the terminal.

If not:

1. Open the repo on GitHub.
2. Click **Compare & pull request**.
3. Confirm base branch is `main` or the repo default branch.
4. Confirm compare branch is `batch-13-github-integration`.
5. Use this title:

```text
Batch 13: Add GitHub repo integration packet
```

Use this PR body:

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

## Next step
Stop here. Next continuation phrase: Continue Batch 14.
```

## Final pre-merge check

```powershell
git checkout main
git pull origin main
git checkout batch-13-github-integration
git merge main
```

Resolve any conflicts before merge. For docs-only Batch 13, conflicts should be rare unless `/github/` or `/tests/` already changed.

## After merge

Return to local default branch:

```powershell
git checkout main
git pull origin main
```

Optional cleanup:

```powershell
git branch -d batch-13-github-integration
```

## Do not do this in Batch 13

Do not create or modify:

```text
/deployment/
/vercel.json
/notion/
/hubspot/
/lead-submission/
/tracking/
/admin-review/
```

Those belong to later batches. Keep the batch line tight. Scope creep is just chaos wearing a fake badge.
