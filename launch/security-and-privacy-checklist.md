# Security and Privacy Checklist

This is the launch gate that prevents “it worked in testing” from becoming “we accidentally exposed partner data.”

## Secrets

| Check | Status | Notes |
| --- | --- | --- |
| No secrets committed to GitHub. |  |  |
| No secret values pasted into docs. |  |  |
| No tokens included in screenshots. |  |  |
| Vercel env vars are set only in intended environments. |  |  |
| Tokens are long, random, and not reused across unrelated systems. |  |  |
| Old test tokens are rotated before broader internal use. |  |  |

Required secret-style env vars:

```text
PARTNER_INTAKE_ACTION_TOKEN
PARTNER_LEAD_SUBMISSION_TOKEN
PARTNER_TRACKING_API_TOKEN
PARTNER_ADMIN_TOKEN
PARTNER_ADMIN_SESSION_SECRET
TALLY_SIGNING_SECRET
NOTION_API_KEY
HUBSPOT_ACCESS_TOKEN
```

## Environment variables

| Check | Status | Notes |
| --- | --- | --- |
| `PARTNER_INTAKE_ENV` reflects local/preview/production correctly. |  |  |
| `PARTNER_INTAKE_STORAGE_MODE` starts as `mock`. |  |  |
| `PARTNER_INTAKE_DRY_RUN=true` for first launch test. |  |  |
| `PARTNER_ADMIN_DEMO_MODE=false` in production. |  |  |
| `TRACKING_BASE_URL` points to approved domain. |  |  |

## PII and sensitive data

Never collect or store the following in this system during internal launch:

- Social Security numbers.
- Bank login credentials.
- Account numbers.
- Routing numbers.
- Full tax IDs.
- Private financial documents.
- Full loan applications.
- Unverified underwriting decisions.
- Sensitive borrower files.

## Webhook security

| Check | Status | Notes |
| --- | --- | --- |
| Tally webhook endpoint accepts only POST. |  |  |
| Signing secret is configured before real use. |  |  |
| Invalid signature behavior is tested. |  |  |
| Tally endpoint is not exposed in GPT Actions. |  |  |
| Webhook logs are redacted. |  |  |
| Duplicate submission behavior is documented. |  |  |

## Admin auth

| Check | Status | Notes |
| --- | --- | --- |
| Admin token is not committed. |  |  |
| Session secret is not committed. |  |  |
| Review queue rejects unauthenticated requests. |  |  |
| Cookie session uses HTTP-only cookie. |  |  |
| Logout clears session. |  |  |
| Demo mode disabled for production. |  |  |

## Logging

Safe logs may include:

- Request ID.
- Endpoint name.
- Status code.
- Timestamp.
- Redacted partner ID.
- Error code.
- Storage mode.

Unsafe logs include:

- Raw webhook payloads.
- Full email bodies.
- Phone numbers.
- Private notes.
- Secret headers.
- Access tokens.
- Sensitive financial data.

## Sample data

| Check | Status | Notes |
| --- | --- | --- |
| All fixtures use fake names/emails. |  |  |
| Fake domains are clearly synthetic or safe. |  |  |
| No real borrower/applicant data is used. |  |  |
| Test submissions are marked as test records. |  |  |

## Production data boundaries

For controlled internal launch:

- GitHub is source control only.
- Vercel is API/runtime only.
- Tally is intake only.
- Notion is staging/review unless approved otherwise.
- HubSpot is sandbox/dry-run unless approved otherwise.
- Admin route is internal only.
- GPT Actions call only approved partner endpoints.
