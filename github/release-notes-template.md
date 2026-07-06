# Release Notes Template — Partner Intake OS

Use this template for PR summaries, GitHub releases, internal changelogs, or batch handoff notes.

## Release title

```text
Batch XX: [Short release name]
```

Example:

```text
Batch 13: GitHub Repo Integration Packet
```

## Summary

Describe what changed in 2–5 bullets.

```markdown
- Added GitHub repo integration guidance.
- Added file placement map for Partner Intake OS root folders.
- Added PR, branching, audit, and manual add checklists.
- Added repo structure validation checklist.
```

## Files changed

```text
/path/file-1.md
/path/file-2.md
/path/file-3.json
```

## New capabilities

List what this batch now enables.

```markdown
- Cleaner manual import into the Partner Command Center repo.
- Safer PR review before merge.
- Standard branch and commit naming for future batches.
- Clear repo structure validation before deployment work begins.
```

## Setup required

```markdown
- Copy files into the repo root.
- Create a batch-specific branch.
- Open a PR using the provided checklist.
- Confirm no secrets, PII, or future-batch files were included.
```

## Validation performed

```markdown
- [ ] File tree reviewed
- [ ] Markdown reviewed
- [ ] No secrets committed
- [ ] No real PII committed
- [ ] No prohibited claims
- [ ] No future-batch files created
```

## Known limitations

```markdown
- This batch is documentation/checklist only.
- It does not change Vercel deployment behavior.
- It does not validate live API endpoints.
- It does not create Notion, HubSpot, lead submission, tracking, or admin dashboard files.
```

## Security notes

```markdown
- No real tokens or secrets should be present.
- No live partner or lead records should be committed.
- GitHub remains source control only, not live CRM/storage.
```

## Compliance notes

```markdown
- Funding language remains educational and readiness-based.
- No approvals, funding amounts, lender outcomes, or credit results are guaranteed.
- Human review remains required for risky, incomplete, or high-impact partner decisions.
```

## Next batch

```text
Stop here. Say “Continue Batch YY” when ready.
```

Example:

```text
Stop here. Say “Continue Batch 14” when ready.
```

## Copy/paste release note

```markdown
# Batch XX: [Release name]

## Summary
[Short summary]

## Files changed
- [file]

## New capabilities
- [capability]

## Setup required
- [setup]

## Validation performed
- [validation]

## Known limitations
- [limitation]

## Next batch
Stop here. Say “Continue Batch YY” when ready.
```
