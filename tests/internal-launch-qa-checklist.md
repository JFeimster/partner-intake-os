# Internal Launch QA Checklist

Final pass/fail checklist for Partner Intake OS internal launch.

## Launch identity

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Launch owner assigned. |  |  |
| Test window date/time documented. |  |  |
| Vercel project confirmed. |  |  |
| Repo branch/PR confirmed. |  |  |
| Rollback owner assigned. |  |  |

## Files and repo

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Phase 21 files present. |  |  |
| Phase 22 files present. |  |  |
| Phase 23 files present. |  |  |
| Phase 24 files present. |  |  |
| Phase 25 files present. |  |  |
| Phase 26 files present. |  |  |
| Phase 27 files present. |  |  |
| Phase 28 files present. |  |  |
| Phase 29 files present. |  |  |
| Phase 30 files present. |  |  |
| No secrets committed. |  |  |
| No batch folders committed as nested packages. |  |  |

## Endpoint tests

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Health route passes. |  |  |
| GPT partner route auth passes. |  |  |
| GPT partner bad auth fails. |  |  |
| Tally webhook fake payload passes. |  |  |
| Admin route requires auth. |  |  |
| Lead submission route returns review-first status. |  |  |
| Tracking create-link route validates destination. |  |  |

## GPT Action tests

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| OpenAPI imports. |  |  |
| Bearer auth configured. |  |  |
| Six required operation IDs appear. |  |  |
| Tally webhook excluded. |  |  |
| Admin endpoints excluded. |  |  |
| Manual partner classification test passes. |  |  |
| Resource recommendation test passes. |  |  |
| Onboarding plan test passes. |  |  |
| Campaign kit test passes. |  |  |
| Log event test passes. |  |  |

## Tally E2E tests

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Strategic partner fixture tested. |  |  |
| Broker fixture tested. |  |  |
| CPA fixture tested. |  |  |
| Attorney fixture tested. |  |  |
| Veteran connector fixture tested. |  |  |
| Affiliate fixture tested. |  |  |
| Low-info fixture tested. |  |  |
| High-risk seller fixture tested. |  |  |
| Duplicate fixture tested. |  |  |
| Malformed fixture tested. |  |  |

## Storage/sync tests

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Mock storage mode tested. |  |  |
| Notion dry-run tested. |  |  |
| HubSpot dry-run tested. |  |  |
| Dual sandbox dry-run tested. |  |  |
| No production write occurred unexpectedly. |  |  |

## Admin QA

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| Login page loads. |  |  |
| Valid token creates session. |  |  |
| Invalid token fails. |  |  |
| Review queue protected. |  |  |
| Logout works. |  |  |
| Sample data labeled clearly. |  |  |

## Compliance QA

| Item | Pass/Fail | Notes |
| --- | --- | --- |
| No guaranteed approval language. |  |  |
| No guaranteed funding language. |  |  |
| No guaranteed commission language. |  |  |
| No credit repair positioning. |  |  |
| No fake urgency. |  |  |
| No invented testimonials. |  |  |
| Lead submission disclaimers present. |  |  |
| GPT outputs remain review-first. |  |  |

## Final decision

| Decision | Selected | Notes |
| --- | --- | --- |
| Go for controlled internal pilot |  |  |
| Conditional Go after listed fixes |  |  |
| No-Go |  |  |

## Signoff

```text
Launch owner:
Date:
Decision:
Known blockers:
Rollback plan reviewed: yes/no
Phase 31 backlog created: yes/no
```
