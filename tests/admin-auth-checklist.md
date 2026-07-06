# Admin Auth Checklist

Use this checklist after adding Phase 26 files to the repo and deploying to Vercel.

## Environment

- [ ] `PARTNER_ADMIN_TOKEN` is configured in Vercel.
- [ ] `PARTNER_ADMIN_SESSION_SECRET` is configured in Vercel.
- [ ] `PARTNER_ADMIN_DEMO_MODE=false` in Production.
- [ ] No real secret values are committed to GitHub.

## Session API

- [ ] `GET /api/admin/session` without cookie returns unauthenticated.
- [ ] `POST /api/admin/session` with missing token returns `401` or `400`.
- [ ] `POST /api/admin/session` with wrong token returns `401`.
- [ ] `POST /api/admin/session` with correct token returns `200`.
- [ ] Correct login sets `partner_admin_session` as HTTP-only cookie.
- [ ] Session response does not expose token or signing secret.

## Review queue API

- [ ] `GET /api/admin/review-queue` without cookie returns `401`.
- [ ] `GET /api/admin/review-queue` with valid cookie returns `200`.
- [ ] `GET /api/admin/review-queue` with `Authorization: Bearer <PARTNER_ADMIN_TOKEN>` returns `200`.
- [ ] `POST /api/admin/review-queue` returns `405`.
- [ ] Response uses sample data only.
- [ ] Emails are masked or fake.
- [ ] No real PII appears in the payload.

## Logout

- [ ] `POST /api/admin/logout` clears session cookie.
- [ ] After logout, review queue redirects to login or returns unauthorized.

## Static admin UI

- [ ] `/site/partner-intake/admin/login.html` loads.
- [ ] Wrong token displays login error.
- [ ] Correct token redirects to `/site/partner-intake/admin/index.html`.
- [ ] Review queue renders protected API records.
- [ ] API unavailable fallback is clearly marked as static demo mode.
- [ ] Logout button returns to login page.
- [ ] Mobile layout is usable.
- [ ] Keyboard navigation works.

## Security review

- [ ] No admin token appears in HTML, CSS, or JS.
- [ ] No token appears in browser console logs.
- [ ] No token appears in network response bodies.
- [ ] Cookies use `HttpOnly`.
- [ ] Production cookies use `Secure`.
- [ ] API responses include no-store cache headers.
- [ ] Demo mode is off before production review.

## Future backlog

- [ ] Replace shared token with real identity provider.
- [ ] Add role-based permissions.
- [ ] Add audit logging.
- [ ] Add rate limiting.
- [ ] Add production database-backed review queue.
