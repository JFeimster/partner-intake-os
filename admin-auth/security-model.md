# Admin Auth Security Model

## Security objective

Protect the Partner Intake OS admin review queue from casual public access while keeping the MVP lightweight enough to deploy on Vercel without a database-backed user system.

This is a speed layer, not Fort Knox. It is meant to prevent accidental exposure during internal use, not replace production identity management.

## Current MVP model

```text
Admin token -> session API -> signed HTTP-only cookie -> protected review queue API
```

### Components

| Component | Role |
| --- | --- |
| `PARTNER_ADMIN_TOKEN` | Shared internal admin token used to create session |
| `PARTNER_ADMIN_SESSION_SECRET` | Optional separate signing secret for session cookies |
| HTTP-only cookie | Browser session for admin review UI |
| Bearer token fallback | Direct API testing and internal service calls |
| `PARTNER_ADMIN_DEMO_MODE` | Explicit non-production bypass for static/demo testing |

## Cookie controls

The session cookie uses:

```text
HttpOnly
SameSite=Lax
Path=/
Max-Age=8 hours
Secure in production
```

The cookie is signed with HMAC SHA-256. If `PARTNER_ADMIN_SESSION_SECRET` is not set, the code falls back to `PARTNER_ADMIN_TOKEN` as the signing secret.

## Protected route

`GET /api/admin/review-queue` requires one of:

1. Valid signed admin session cookie.
2. `Authorization: Bearer <PARTNER_ADMIN_TOKEN>`.
3. `PARTNER_ADMIN_DEMO_MODE=true` for non-production test only.

## Sample data boundary

The review queue returns fake/sample records only. The records include masked emails and disclaimers. Real PII should live only in approved storage systems such as Notion sandbox, HubSpot sandbox, or a future database with access controls.

## Current limitations

- Shared token, not per-user identity.
- No password reset.
- No MFA.
- No revocation list.
- No persistent audit log.
- No IP allowlist.
- No rate limiter.
- No production-grade RBAC enforcement.

## Future RBAC model

Recommended roles:

| Role | Access |
| --- | --- |
| `owner` | Full admin, settings, review decisions, integration controls |
| `reviewer` | Review queue, partner notes, manual decisions |
| `read_only` | View review queue and records, no decisions |
| `integration_service_account` | API-only sync and event logging |

## Future hardening backlog

1. Move from shared token to user identity provider.
2. Add MFA.
3. Add role-based route authorization.
4. Add server-side audit log.
5. Add rate limiting and bot protection.
6. Add IP allowlist for admin APIs if needed.
7. Add per-session revocation.
8. Add real database-backed review queue permissions.
9. Add production PII access policy.
10. Add admin security event alerts.

## Production rule

Do not use this MVP auth as the final protection layer for sensitive partner, borrower, lender, payout, or underwriting data. It is a bridge. Bridges are useful; they are not a bank vault.
