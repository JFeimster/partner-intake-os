# Deploy Lockdown Plan

## Purpose

After a Vercel deployment test window, return the repo/project to a controlled state so accidental production pushes do not become a recurring tax on sanity.

## Lockdown principle

Deployment should be intentional.

No casual merges. No surprise production rebuilds. No “I just changed a comma and Vercel launched a parade.”

## How to disable auto-deploys again

Because Vercel settings may vary by plan/project setup, document the actual project behavior in this file after checking Vercel.

Recommended dashboard checks:

1. Open Vercel project.
2. Go to Settings.
3. Review Git settings.
4. Review Production Branch.
5. Review Ignored Build Step / deployment protection settings if used.
6. Review Preview Deployment behavior.
7. Confirm whether pushes to `main` automatically deploy.
8. Confirm whether PR branches automatically deploy.
9. Record the actual state below.

## Current deployment behavior record

```md
## Vercel Deployment Behavior

- Date checked:
- Operator:
- Project:
- Production branch:
- Auto production deploy enabled: yes/no/unknown
- Preview deploys enabled: yes/no/unknown
- Ignored build step configured: yes/no/unknown
- Deployment protection enabled: yes/no/unknown
- Notes:
```

## Prevent accidental production pushes

Recommended repo discipline:

- Use feature branches.
- Use PRs.
- Do not push directly to `main`.
- Add deployment intent to PR description.
- Require a test-window note before production deploy.
- Keep env var changes logged.
- Keep rollback notes visible.

Recommended PR wording:

```md
## Deployment Intent

- [ ] No deployment expected
- [ ] Preview deployment expected
- [ ] Production deployment requested
- [ ] Production deployment blocked/locked down after test
```

## Document deployment status

Use `/deployment/deployment-incident-log.md` for failures and `/tests/vercel-test-window-checklist.md` for test outcomes.

Minimum status fields:

- Branch.
- Commit SHA.
- Vercel URL.
- Environment.
- Tests run.
- Failures.
- Rollback status.
- Lockdown status.

## How to reopen deployment window later

1. Confirm current branch and commit.
2. Confirm what changed since last deploy.
3. Verify env vars.
4. Run local static checks.
5. Open deployment window.
6. Deploy intentionally.
7. Run `/scripts/vercel-smoke-test.ps1`.
8. Log results.
9. Close window.

## Recommended issue labels

```text
deployment
vercel
phase-22
smoke-test
route-missing
auth-failure
env-var
rollback
lockdown
```

## Final lockdown checklist

- [ ] Test window result recorded.
- [ ] All failures logged as issues.
- [ ] Vercel deploy behavior documented.
- [ ] Production deploys are not happening accidentally.
- [ ] Preview deploy behavior is understood.
- [ ] Env var changes recorded without revealing values.
- [ ] Next action assigned for Phase 23.
