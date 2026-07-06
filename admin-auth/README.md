# Admin Auth MVP

Phase 26 adds lightweight admin protection for the Partner Intake OS admin review route.

This is an MVP guardrail, not a full identity platform. It protects the review queue behind a shared admin token and HTTP-only session cookie, while leaving room for future role-based access control.

## What this phase adds

```text
/lib/admin-auth.ts
/api/admin/session.ts
/api/admin/logout.ts
/api/admin/review-queue.ts
/site/partner-intake/admin/login.html
/site/partner-intake/admin/login.css
/site/partner-intake/admin/login.js
/site/partner-intake/admin/index.html
/site/partner-intake/admin/script.js
```

## Route behavior

| Route | Method | Purpose | Auth |
| --- | --- | --- | --- |
| `/api/admin/session` | `GET` | Check current admin session | Cookie or bearer |
| `/api/admin/session` | `POST` | Create admin session | `PARTNER_ADMIN_TOKEN` in JSON body |
| `/api/admin/logout` | `POST` | Clear admin session cookie | None required |
| `/api/admin/review-queue` | `GET` | Read protected sample review queue | Cookie or bearer |
| `/site/partner-intake/admin/login.html` | Static | Admin login page | Token submitted to session API |
| `/site/partner-intake/admin/index.html` | Static | Protected review queue UI | Calls protected API |

## What this is ready for

- Internal review queue MVP.
- Controlled admin demos.
- Testing protected Vercel serverless routes.
- Keeping sample admin queue away from casual public browsing.

## What this is not ready for

- Multi-user admin accounts.
- Password reset.
- SSO.
- OAuth.
- Fine-grained permissions.
- Production PII review at scale.
- Regulated audit logging.

## MVP login flow

1. Admin opens `/site/partner-intake/admin/login.html`.
2. Admin enters the internal `PARTNER_ADMIN_TOKEN`.
3. `POST /api/admin/session` validates the token.
4. API creates a signed HTTP-only cookie.
5. Admin UI calls `/api/admin/review-queue` with `credentials: include`.
6. Review queue API returns sample/internal review records.

## Fallback static demo mode

The static admin page includes a fallback fixture if the API is unavailable. It is clearly marked as static demo mode and must not be treated as authenticated or production-backed data.

For API-level demo bypass, only enable:

```text
PARTNER_ADMIN_DEMO_MODE=true
```

inside a temporary non-production test window. Do not enable this in production.

## Hard rule

Do not place real partner PII in static JS, static JSON, screenshots, GitHub issues, docs, prompts, or sample data. Sample data means fake data. Period.
