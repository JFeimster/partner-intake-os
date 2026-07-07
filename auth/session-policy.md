# Session Policy

## Required session storage

Use HTTP-only cookies for admin sessions.

Cookie requirements:

- `HttpOnly`
- `Secure` in production
- `SameSite=Lax` or stricter
- short expiration
- server-side validation

## Prohibited storage

Never store:

- admin tokens
- session tokens
- API keys
- HubSpot tokens
- Notion tokens
- Tally secrets
- user role claims that are trusted without server verification

in:

- `localStorage`
- `sessionStorage`
- static JSON files
- browser-visible JS config

## MVP compatibility

During MVP, `PARTNER_INTAKE_ADMIN_TOKEN` can still support protected admin endpoints. The preferred path is:

1. Admin logs in.
2. Server validates identity.
3. Server creates signed session.
4. Browser receives HTTP-only cookie.
5. API reads cookie and resolves role server-side.

## Expiration

Suggested defaults:

- Standard admin session: 8 hours
- Reviewer session: 8 hours
- Read-only session: 12 hours
- Integration service token: rotate every 30-90 days
