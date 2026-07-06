# Admin Dashboard Release Checklist

## Login and protection

| Check | Status | Notes |
| --- | --- | --- |
| `/site/partner-intake/admin/login.html` loads. |  |  |
| Empty token fails. |  |  |
| Wrong token fails. |  |  |
| Correct token succeeds. |  |  |
| Session check succeeds after login. |  |  |
| Protected admin page rejects unauthenticated users. |  |  |
| Logout clears session. |  |  |
| `PARTNER_ADMIN_DEMO_MODE=false` in production. |  |  |

## Sample vs real data

| Check | Status | Notes |
| --- | --- | --- |
| Sample records are labeled sample/demo. |  |  |
| No real partner PII is hardcoded in static files. |  |  |
| Fake leads are clearly fake. |  |  |
| Export output does not include secrets. |  |  |
| Screenshots do not show sensitive data. |  |  |

## Review queue

| Check | Status | Notes |
| --- | --- | --- |
| Queue endpoint is protected. |  |  |
| Queue records include partner type/tier/risk/next action. |  |  |
| Manual review records are visually identifiable. |  |  |
| High-risk records are not auto-approved. |  |  |
| Lead records do not claim lender approval. |  |  |

## Filters

| Check | Status | Notes |
| --- | --- | --- |
| Filter by status works. |  |  |
| Filter by risk works or is documented as backlog. |  |  |
| Filter by partner type works or is documented as backlog. |  |  |
| Empty state is readable. |  |  |

## Actions

During internal launch, admin actions should be conservative:

- Review.
- Needs info.
- Approve for onboarding checklist.
- Watchlist.
- Archive/reject.

Do **not** automate:

- Lender submission.
- Commission eligibility.
- Funded status.
- Partner payout.
- Public partner access provisioning without review.

## Audit notes

| Check | Status | Notes |
| --- | --- | --- |
| Admin notes avoid sensitive details. |  |  |
| Status changes create or plan to create activity events. |  |  |
| Escalation rules are visible. |  |  |
| Issue log is linked or documented. |  |  |

## Release decision

| Decision | Selected | Notes |
| --- | --- | --- |
| Go |  |  |
| Conditional Go |  |  |
| No-Go |  |  |
