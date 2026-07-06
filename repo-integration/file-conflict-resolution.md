# File Conflict Resolution

## Rule zero

Do not overwrite an existing file unless you understand why it exists. Static repos are peaceful until someone nukes `index.html` at 11:47 PM.

## Conflict decision matrix

| Situation | Action |
|---|---|
| Existing file is unrelated and stable | Keep existing file |
| Incoming file is new docs/checklist | Add incoming file |
| Existing file is older Partner Intake OS doc | Merge sections |
| Existing file is static production page | Do not overwrite without visual review |
| Existing file is sample/demo data | Prefer merge; preserve old data under dated note |
| Existing file contains secrets/PII | Do not commit; sanitize immediately |
| Existing file is `vercel.json` | Merge carefully; never blindly replace |

## Existing `vercel.json`

If `vercel.json` exists:

1. Fetch existing file.
2. Compare the incoming deployment settings.
3. Preserve any known deployment-lockdown behavior.
4. Do not enable automatic deployments accidentally.
5. Do not remove existing rewrites/headers unless they are broken.
6. Add comments in docs, not JSON. JSON does not support comments.

Suggested check:

```powershell
if (Test-Path .\vercel.json) {
  Get-Content .\vercel.json
} else {
  Write-Host "No vercel.json found in local checkout."
}
```

If merging manually, use:

```powershell
git diff -- vercel.json
```

## Compare incoming and existing files

PowerShell:

```powershell
Compare-Object `
  (Get-Content ".\path\existing-file.md") `
  (Get-Content ".\path\incoming-file.md")
```

Git:

```powershell
git diff -- path/to/file
git diff --word-diff -- path/to/file
```

VS Code:

```powershell
code --diff .\path\existing-file.md .\path\incoming-file.md
```

## Replace vs merge vs skip

### Replace only when

- The existing file is empty/stub-only.
- The incoming file is the obvious completed version.
- The file is not a public route or live config.
- The file has no secrets, real PII, or production-only assumptions.

### Merge when

- Both files contain useful docs.
- Existing file has repo-specific instructions.
- Incoming file has Partner Intake OS-specific instructions.
- Static page includes shared header/nav/footer from the existing site.

### Skip when

- Incoming file is redundant.
- Incoming file duplicates an existing file with worse naming.
- Incoming file uses `/modules/partner-intake-os/`.
- Incoming file hardcodes secrets, real PII, or guaranteed funding claims.

## Static page conflicts

For static files under `/site/partner-intake/`:

- Preserve route names required by the current phase.
- Keep plain HTML/CSS/JS.
- Keep relative links.
- Do not introduce build tools.
- Preserve existing shared nav/footer if the repo has a standard pattern.
- Test mobile layout after merging.

Required Phase 21 static routes to validate:

```text
/site/partner-intake/
/site/partner-intake/submit-lead.html
/site/partner-intake/tracking-link-builder.html
/site/partner-intake/admin/
```

## Test/checklist conflicts

For `/tests/`:

- Prefer appending a new checklist rather than overwriting old QA files.
- Use specific names.
- Keep pass/fail boxes.
- Include date, branch, reviewer, and notes fields.

## Docs conflicts

For docs:

- Keep one `README.md` per functional folder.
- Do not create multiple “final-final-really-final.md” files. That’s not documentation; that’s a cry for help.
- If two docs overlap, create one canonical file and add a “Related docs” section.

## Conflict examples

### Example 1 — Existing `api/README.md`

Existing repo has a general API examples README. Incoming Partner Intake docs should not replace it unless explicitly intended.

Recommended action:

- Keep `api/README.md`.
- Add Partner Intake-specific docs under `/api/` only in Phase 23.
- For Phase 21, document the future check in `/repo-integration/root-folder-audit.md`.

### Example 2 — Existing `/admin/`

Existing repo has a static admin prototype. Do not overwrite it with Partner Intake admin route files.

Recommended action:

- Keep existing `/admin/`.
- Use `/site/partner-intake/admin/` for the Partner Intake OS module.
- Phase 26 can later harden admin auth.

### Example 3 — Existing `/integrations/openapi.json`

Existing repo may already contain a broad integration OpenAPI example.

Recommended action:

- Keep it.
- Use `/actions/openapi.yaml` and `/actions/openapi.json` for GPT-facing Partner Intake OS Action specs.
