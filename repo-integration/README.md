# Repo Integration — Phase 21

## Purpose

Phase 21 integrates the completed Partner Intake OS Batches 13–20 into the `partner-command-center` repo without turning the repo into a junk drawer with a login screen.

This phase does **not** create new API behavior, dashboard UI, storage sync, or automation logic. It creates the merge guardrails needed before the live Vercel/API/GPT Action repair phases begin.

## Why this exists after Batches 13–20

Batches 13–20 produced the packets and modules for:

- GitHub repo integration and PR process
- Vercel deployment configuration
- OpenAPI and GPT Action validation
- Notion setup packet
- HubSpot setup packet
- Partner lead submission module
- Partner tracking link builder
- Admin review dashboard

Phase 21 is the “make it land cleanly” phase. The goal is to verify where those files should live, avoid duplicate nested folders, avoid overwriting existing static app files, and prepare a clean pull request.

## Repo integration philosophy

Use root-level functional folders:

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

Do **not** use:

```text
/modules/
/modules/partner-intake-os/
```

Do **not** repeat the project name in every filename. The repo and folder context already tell us what this is.

## What should be merged now

Merge the completed Batches 13–20 files if they are:

- Documentation packets
- OpenAPI specs
- JSON examples
- Static dashboard/module files
- Checklist/test files
- Safe placeholder config
- Example-only API scaffolds that are clearly marked as non-production
- Validation scripts that do not require secrets

## What should not be merged yet

Do not merge uncontrolled production behavior yet:

- Real secret values
- Real partner PII
- Production HubSpot writes
- Production Notion writes
- Live webhook receivers wired to a production database
- Admin auth pretending to be hardened enterprise RBAC
- Automatic email/SMS sending
- Commission or payout automation
- Tally webhook exposure inside GPT Actions

Phase 21 is a merge and validation packet, not the “let the robot drive the money truck” phase.

## PII and secrets warning

Before merging:

- Search for API tokens, signing secrets, private keys, OAuth tokens, real partner emails, real phone numbers, and real lead data.
- Keep `.env` files out of the repo.
- Use `.env.example` or documentation placeholders only.
- Use mock/sample data for dashboard and tests.
- Do not log raw PII in validation examples.

## Quick checklist

- [ ] Create integration branch.
- [ ] Copy Batches 13–20 into root-level functional folders.
- [ ] Run duplicate folder check.
- [ ] Run static path check.
- [ ] Run schema/OpenAPI validation if tooling is available.
- [ ] Run `scripts/validate-partner-intake-structure.ps1`.
- [ ] Confirm no secrets or real PII.
- [ ] Open PR with `repo-integration/pr-description.md`.
- [ ] Merge only after local review passes.
