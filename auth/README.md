# Admin Identity + RBAC

Batch 33 upgrades the admin layer from MVP token/cookie auth into a role-based access model.

## Roles

- `owner`
- `admin`
- `reviewer`
- `read_only`
- `integration_service`

## Session rule

Admin sessions should use HTTP-only, secure cookies. Do not store admin tokens, session tokens, API keys, or integration credentials in `localStorage`.

## Compatibility

This batch keeps compatibility with the Phase 26 MVP token/cookie pattern. It adds a clean authorization model without forcing a provider switch.

## Future migration path

Supported future providers:

- Supabase Auth
- Clerk
- Auth0
- WorkOS
- Custom signed session backed by Postgres

Provider choice should not change role semantics. Roles and permissions stay internal to Partner Intake OS.
