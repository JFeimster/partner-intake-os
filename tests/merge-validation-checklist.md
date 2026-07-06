# Merge Validation Checklist

## Phase

```text
Phase 21 — Repo Integration + Merge Validation
```

## Reviewer fields

| Field | Value |
|---|---|
| Reviewer |  |
| Branch |  |
| PR URL |  |
| Review date |  |
| Local repo path |  |
| Notes |  |

## Manual pass/fail checklist

### Repo and branch

- [ ] PASS / [ ] FAIL — Local repo path confirmed.
- [ ] PASS / [ ] FAIL — Latest `main` pulled before branching.
- [ ] PASS / [ ] FAIL — Work performed on a non-main branch.
- [ ] PASS / [ ] FAIL — PR contains only intended Phase 21/integration files.

Notes:

```text
```

### Folder placement

- [ ] PASS / [ ] FAIL — Root-level functional folders used.
- [ ] PASS / [ ] FAIL — No `/modules/partner-intake-os/`.
- [ ] PASS / [ ] FAIL — No nested batch package folders.
- [ ] PASS / [ ] FAIL — No repeated project-name prefixes in filenames.
- [ ] PASS / [ ] FAIL — `/site/partner-intake/` used for static module paths.

Notes:

```text
```

### Required Phase 21 files

- [ ] PASS / [ ] FAIL — `/repo-integration/README.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/batches-13-20-merge-plan.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/file-conflict-resolution.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/root-folder-audit.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/static-path-validation.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/pre-merge-checklist.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/post-merge-checklist.md`
- [ ] PASS / [ ] FAIL — `/repo-integration/pr-description.md`
- [ ] PASS / [ ] FAIL — `/scripts/validate-partner-intake-structure.ps1`
- [ ] PASS / [ ] FAIL — `/tests/merge-validation-checklist.md`

Notes:

```text
```

### Static route validation

- [ ] PASS / [ ] FAIL — `/site/partner-intake/` loads if present.
- [ ] PASS / [ ] FAIL — `/site/partner-intake/submit-lead.html` loads if present.
- [ ] PASS / [ ] FAIL — `/site/partner-intake/tracking-link-builder.html` loads if present.
- [ ] PASS / [ ] FAIL — `/site/partner-intake/admin/` loads if present.
- [ ] PASS / [ ] FAIL — Console is clean.
- [ ] PASS / [ ] FAIL — Mobile layout is acceptable.

Notes:

```text
```

### Script validation

Run:

```powershell
.\scripts\validate-partner-intake-structure.ps1
```

- [ ] PASS / [ ] FAIL — Script executes.
- [ ] PASS / [ ] FAIL — Output is readable.
- [ ] PASS / [ ] FAIL — Missing path warnings are understood.
- [ ] PASS / [ ] FAIL — No destructive behavior.

Notes:

```text
```

### Secrets and PII

- [ ] PASS / [ ] FAIL — No real API tokens.
- [ ] PASS / [ ] FAIL — No private keys.
- [ ] PASS / [ ] FAIL — No real Tally signing secrets.
- [ ] PASS / [ ] FAIL — No real Notion/HubSpot credentials.
- [ ] PASS / [ ] FAIL — No real partner or lead PII.
- [ ] PASS / [ ] FAIL — Sample data is clearly fake/demo.

Notes:

```text
```

### Compliance copy

- [ ] PASS / [ ] FAIL — No guaranteed approval language.
- [ ] PASS / [ ] FAIL — No guaranteed funding language.
- [ ] PASS / [ ] FAIL — No fake lender certainty.
- [ ] PASS / [ ] FAIL — No credit repair framing.
- [ ] PASS / [ ] FAIL — No invented testimonials.
- [ ] PASS / [ ] FAIL — No “everyone qualifies” claims.

Notes:

```text
```

### GPT Action safety

- [ ] PASS / [ ] FAIL — Tally webhook is not exposed in GPT Action schema.
- [ ] PASS / [ ] FAIL — Admin endpoints are not exposed in GPT Action schema.
- [ ] PASS / [ ] FAIL — Bearer auth placeholders are used.
- [ ] PASS / [ ] FAIL — Operation IDs are clear and stable.

Notes:

```text
```

## Final decision

- [ ] Approve merge
- [ ] Request changes
- [ ] Block merge

Reason:

```text
```
