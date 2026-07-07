# Partner Portal Access Rules

## Access checks

Every API call should verify:

1. The session is authenticated.
2. The session maps to a partner account.
3. The partner account is active.
4. The requested partner ID matches the session partner ID or the actor has explicit delegated access.
5. The endpoint permission matches the partner role.

## Page access

| Page | Access |
|---|---|
| `/portal/index.html` | authenticated partner |
| `/portal/profile.html` | authenticated partner |
| `/portal/leads.html` | partner_owner or partner_member |
| `/portal/tracking.html` | partner_owner or partner_member |
| `/portal/resources.html` | authenticated partner |

## Deny cases

Deny access when:

- partner account is paused, revoked, or archived
- session is missing/expired
- requested partner ID mismatch
- route is admin-only
- endpoint attempts to return audit logs, private notes, or commission data

## Browser rule

Never authorize by localStorage values. localStorage can change UI state only, not access.
