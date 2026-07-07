# Partner Portal localStorage Policy

## Allowed

localStorage may store:

- dashboard filters
- selected tabs
- collapsed sidebar state
- draft campaign names
- draft UTM values
- recently copied tracking link
- theme preference
- dismissed UI notices
- non-sensitive onboarding checklist state

## Forbidden

localStorage must not store:

- admin tokens
- session tokens
- API keys
- partner PII
- lead PII
- borrower data
- contact records
- private notes
- HubSpot tokens
- Notion tokens
- Tally secrets
- audit logs
- approval decisions
- commission data

## Expiration

Local UX state should include a timestamp and be easy to clear.

## Implementation file

Use:

`/site/partner-intake/shared/local-store.js`
