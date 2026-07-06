# Internal Launch Plan

## Launch objective

Move Partner Intake OS from packaged build artifacts into a controlled internal pilot where the full intake pipeline can be tested safely:

```text
Tally test submission
  → Vercel webhook/API
  → normalization/classification/risk logic
  → sandbox storage or mock storage
  → GPT Action tests
  → protected admin review queue
  → operator decision
```

## Launch scope

### In scope

- Controlled Vercel deployment window.
- API smoke tests.
- GPT Action import and testing.
- Tally webhook test submissions.
- Notion/HubSpot sandbox sync validation.
- Admin review queue validation.
- Lead submission API test records.
- Tracking link API test records.
- Operator QA and issue capture.

### Out of scope

- Public partner launch.
- Partner payments/commission ledger.
- Real lender submission.
- Automated approvals.
- Real applicant/private financial document intake.
- Production CRM automation without human review.

## Day 0 setup

1. Pull latest `main`.
2. Create release branch.
3. Merge Phase 21–30 files by PR or controlled local merge.
4. Confirm folder structure.
5. Confirm env vars in local `.env` or Vercel dashboard.
6. Confirm `PARTNER_INTAKE_STORAGE_MODE=mock` for first pass.
7. Confirm `PARTNER_INTAKE_DRY_RUN=true` for first pass.
8. Confirm Tally signing secret policy.
9. Confirm GPT Action token policy.
10. Confirm admin token/session secret policy.

## Day 1 testing

Run tests in this order:

1. Repo structure validation.
2. Vercel route smoke tests.
3. API auth tests.
4. GPT Action import tests.
5. Tally webhook fake submission tests.
6. Notion dry-run tests.
7. HubSpot dry-run tests.
8. Admin login and protected queue tests.
9. Lead submission test payloads.
10. Tracking link test payloads.
11. Phase 29 E2E harness.
12. Compliance copy review.

## Week 1 monitored use

During the first week:

- Keep all partner records in review status.
- Review every GPT classification manually.
- Review every Tally submission manually.
- Compare GPT output against expected tiering rules.
- Keep a daily issue log.
- Record false positives and false negatives.
- Track missing fields from Tally.
- Track action failures from GPT Builder.
- Keep Notion/HubSpot in sandbox or dry-run unless intentionally testing writes.

## Feedback capture

Capture feedback in one place:

```text
/launch/issue-log.md or GitHub Issues
```

Minimum feedback fields:

- Date.
- Tester.
- Area: GPT, API, Tally, Vercel, Notion, HubSpot, Admin, Tracking, Lead Submission.
- What happened.
- Expected behavior.
- Actual behavior.
- Severity.
- Owner.
- Next action.

## Rollback conditions

Rollback or pause if any of these occur:

- Secrets exposed in logs or repo.
- Tally sends real data to wrong endpoint.
- Admin route becomes publicly readable.
- GPT Action exposes Tally webhook or admin endpoints.
- API accepts invalid auth.
- API returns guaranteed approval/funding/commission language.
- Notion/HubSpot writes to production unintentionally.
- Logs contain raw sensitive data.
- Duplicate webhook behavior cannot be explained.

## Success criteria

Internal launch passes when:

- All checklists are complete.
- All critical issues are closed.
- GPT Actions pass happy-path and failure-path tests.
- Tally test submissions reach the expected endpoint.
- Review queue behavior is verified.
- Admin login protection works.
- No secrets/PII are exposed.
- Compliance copy review passes.
- Operator can run the review workflow without guessing.

## Final go/no-go

| Decision | Meaning |
| --- | --- |
| Go | Internal pilot can begin with fake/sandbox data and manual review. |
| Conditional Go | Pilot can begin after listed blockers are fixed. |
| No-Go | Do not launch internally until blockers are resolved. |
