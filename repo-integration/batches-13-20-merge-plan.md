# Batches 13–20 Merge Plan

## Recommended branch

```powershell
git checkout main
git pull origin main
git checkout -b phase-21/repo-integration-merge-validation
```

## Recommended PR strategy

Use **one PR for Phase 21** if Batches 13–20 are already complete and packaged.

Why one PR:

- These batches are logically connected.
- Phase 21 is integration/documentation/checklist work.
- Review is easier if the PR is framed as “merge validation packet + placement audit.”
- No live backend writes should be introduced in this PR.

Use separate PRs only if the repo already has heavy conflicts in:

- `/api/`
- `/site/partner-intake/`
- `/admin/`
- `/integrations/`
- `/actions/`

## Recommended commit grouping

Use clean commits by functional area:

```text
docs(repo-integration): add phase 21 merge validation packet
chore(scripts): add partner intake structure validator
test(checklists): add merge validation checklist
```

If importing Batches 13–20 from a local package, use:

```text
docs(partner-intake): merge batches 13-20 packets
```

## Placement rules

### Preferred root folders

```text
/github/
/deployment/
/actions/
/notion/
/hubspot/
/lead-submission/
/tracking/
/admin-review/
/site/partner-intake/
/tests/
/scripts/
```

### Avoid nested batch folders

Bad:

```text
partner-intake-os-batches-13-20/batch-18/lead-submission/
```

Good:

```text
lead-submission/
site/partner-intake/submit-lead.html
tests/lead-submission-checklist.md
```

Flatten by function, not by batch number.

## Existing folder handling

If the destination folder exists:

1. Compare file-by-file.
2. Preserve existing production/static site files.
3. Merge documentation rather than replacing it blindly.
4. Move Partner Intake OS-specific files into a clean functional folder.
5. Use `README.md` files to explain scope.

## PowerShell copy commands

Assumption:

- Repo local path: `C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center`
- Batch package extracted to: `C:\Users\jason\Downloads\partner-intake-os-batches-13-20`

Revise paths as needed.

```powershell
$Repo = "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"
$Source = "C:\Users\jason\Downloads\partner-intake-os-batches-13-20"

Set-Location $Repo

# Create expected root folders.
$Folders = @(
  "github",
  "deployment",
  "actions",
  "notion",
  "hubspot",
  "lead-submission",
  "tracking",
  "admin-review",
  "site\partner-intake",
  "site\partner-intake\admin",
  "tests",
  "scripts",
  "repo-integration"
)

foreach ($Folder in $Folders) {
  New-Item -ItemType Directory -Force -Path $Folder | Out-Null
}

# Copy functional folders if present.
$FolderMap = @{
  "github" = "github"
  "deployment" = "deployment"
  "actions" = "actions"
  "notion" = "notion"
  "hubspot" = "hubspot"
  "lead-submission" = "lead-submission"
  "tracking" = "tracking"
  "admin-review" = "admin-review"
  "tests" = "tests"
  "site\partner-intake" = "site\partner-intake"
}

foreach ($Key in $FolderMap.Keys) {
  $From = Join-Path $Source $Key
  $To = Join-Path $Repo $FolderMap[$Key]

  if (Test-Path $From) {
    Copy-Item -Path (Join-Path $From "*") -Destination $To -Recurse -Force
    Write-Host "Copied $From -> $To"
  } else {
    Write-Host "Skipped missing source: $From" -ForegroundColor Yellow
  }
}
```

## Git commands

```powershell
git status
git add repo-integration scripts tests github deployment actions notion hubspot lead-submission tracking admin-review site/partner-intake
git status
git diff --cached --stat
git commit -m "docs(repo-integration): add phase 21 merge validation packet"
git push -u origin phase-21/repo-integration-merge-validation
```

Then open a PR into `main`.

## PR order

1. Phase 21 merge validation packet.
2. Phase 22 Vercel deployment test-window packet.
3. Phase 23 API endpoint repair against live Vercel behavior.
4. Phase 24 GPT Action import/test/repair.
5. Phase 25 Notion + HubSpot sandbox sync.
6. Continue sequentially.

## Conflict prevention

Before opening the PR:

```powershell
git fetch origin
git status
git diff --name-only origin/main...HEAD
git diff --stat origin/main...HEAD
```

Then run:

```powershell
.\scripts\validate-partner-intake-structure.ps1
```
