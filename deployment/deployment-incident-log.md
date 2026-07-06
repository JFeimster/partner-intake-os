# Deployment Incident Log

Use this file to record Vercel deployment issues during Partner Intake OS test windows.

## Incident template

```md
## Incident: YYYY-MM-DD — Short title

- Incident ID:
- Date/time:
- Operator:
- Branch:
- Commit:
- Vercel deployment URL:
- Environment: Preview / Production / Local
- Severity: low / medium / high
- Status: open / resolved / rolled back / deferred

### Summary

Describe what broke in plain English.

### Expected behavior

What should have happened?

### Actual behavior

What happened instead?

### Impact

- Static pages affected:
- API routes affected:
- GPT Action affected:
- Tally webhook affected:
- Admin review affected:
- Partner/lead data affected: yes/no
- Real PII exposed: yes/no

### Evidence

- Screenshots:
- Logs:
- Status codes:
- Browser console errors:
- Vercel log excerpt:

### Immediate action taken

- [ ] Stopped test window
- [ ] Rolled back
- [ ] Disabled deployment behavior
- [ ] Removed exposed secret
- [ ] Created issue
- [ ] Assigned repair owner

### Root cause

Document only after confirmed. Do not guess and dress it up like a lab coat.

### Repair plan

- Phase:
- File(s):
- Endpoint(s):
- Owner:
- Due:

### Verification

- Retest command:
- Expected result:
- Actual result:
- Verified by:
- Date closed:
```

## Incident severity guide

| Severity | Meaning |
|---|---|
| Low | Cosmetic/static issue, no data/security impact |
| Medium | Broken route, endpoint, or env var preventing test completion |
| High | Secret exposure, real PII exposure, production write, or auth boundary failure |

## Current incidents

_No incidents logged yet._
