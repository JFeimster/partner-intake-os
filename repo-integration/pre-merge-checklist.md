# Pre-Merge Checklist

Use this before opening or merging the Phase 21 PR.

## Repo status

- [ ] Local repo path confirmed.
- [ ] `git status` reviewed.
- [ ] Working tree was clean before files were copied.
- [ ] Latest `main` pulled.
- [ ] New branch created for Phase 21.
- [ ] No unrelated changes included.

Commands:

```powershell
git checkout main
git pull origin main
git status
git checkout -b phase-21/repo-integration-merge-validation
```

## Branch check

- [ ] Current branch is not `main`.
- [ ] Branch name is clear.
- [ ] Branch only contains Phase 21/integration files.

Command:

```powershell
git branch --show-current
```

## File tree check

- [ ] Expected folders exist.
- [ ] No `/modules/partner-intake-os/`.
- [ ] No `/modules/`.
- [ ] No duplicated nested batch package folder.
- [ ] No project-name prefix spam in filenames.

Command:

```powershell
Get-ChildItem -Directory
```

## Duplicate folder check

Look for accidental copied package folders:

```powershell
Get-ChildItem -Recurse -Directory | Where-Object {
  $_.FullName -match "partner-intake-os-batches|batch-13|batch-14|batch-15|batch-16|batch-17|batch-18|batch-19|batch-20|modules"
}
```

Expected:

```text
No nested batch package folders.
No modules folder.
```

## Static page check

- [ ] `/site/partner-intake/` exists.
- [ ] `/site/partner-intake/submit-lead.html` exists.
- [ ] `/site/partner-intake/tracking-link-builder.html` exists.
- [ ] `/site/partner-intake/admin/index.html` exists if admin static MVP is included.
- [ ] Pages load locally.
- [ ] Console is clean.

## Docs check

- [ ] `README.md` files explain purpose.
- [ ] Docs use root-level path convention.
- [ ] Docs do not claim production readiness where only demo/stub behavior exists.
- [ ] Docs do not promise guaranteed funding, approval, income, or commissions.
- [ ] Docs do not expose Tally webhook through GPT Actions.

## Schema JSON validity check

Run if JSON files were added in Batches 13–20:

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  try {
    Get-Content $_.FullName -Raw | ConvertFrom-Json | Out-Null
    Write-Host "PASS JSON: $($_.FullName)"
  } catch {
    Write-Host "FAIL JSON: $($_.FullName)" -ForegroundColor Red
  }
}
```

## No API regression check

- [ ] No existing `/api/*.example.js` files were overwritten unless intentional.
- [ ] New real API files are not introduced in Phase 21.
- [ ] Tally webhook remains private and not GPT-facing.
- [ ] Existing static-first repo assumptions are preserved.

## No secret exposure check

Run:

```powershell
Select-String -Path .\* -Pattern "sk-|secret|token|api_key|private_key|TALLY_SIGNING_SECRET|HUBSPOT_ACCESS_TOKEN|NOTION_API_KEY|PARTNER_INTAKE_ACTION_TOKEN" -Recurse
```

Acceptable:

- Env var names in documentation.
- Placeholder values like `YOUR_TOKEN_HERE`.

Not acceptable:

- Real token values.
- Private keys.
- Real webhook signing secrets.
- Real partner or lead PII.

## Compliance copy check

Reject or revise any copy that says:

- guaranteed approval
- guaranteed funding
- pre-approved
- everyone qualifies
- no-risk
- instant approval
- credit repair
- lender certainty
- guaranteed commissions

Use safer alternatives:

- “Funding options may vary.”
- “Submission does not guarantee approval or funding.”
- “Reviewed by an operator.”
- “Readiness-based next steps.”
- “Educational and operational guidance only.”

## Final pre-merge command set

```powershell
.\scripts\validate-partner-intake-structure.ps1
git diff --cached --stat
git status
```
