# Sync Routing Rules

## Storage mode matrix

| Mode | Notion | HubSpot | Purpose |
|---|---:|---:|---|
| `mock` | No | No | Safe default. No external writes. |
| `notion` | Yes | No | Partner staging/review database. |
| `hubspot` | No | Yes | CRM/contact/task sandbox. |
| `dual_sandbox` | Yes | Yes | Full sandbox review of both routes. |

## Default behavior

If `PARTNER_INTAKE_STORAGE_MODE` is missing or invalid, the router falls back to:

```text
mock
```

If `PARTNER_INTAKE_DRY_RUN` is missing, the router defaults to:

```text
true
```

This means missing config should never accidentally create a live external record.

## Review-first rules

Return `needs_review` instead of syncing when:

- `manual_review_required` is true.
- `scorecard.manual_review_required` is true.
- `risk_level` is high.
- `risk_flags` has one or more entries.
- Minimum contact/company identifiers are missing for HubSpot.

## Target roles

### Notion

Treat Notion as the staging/review clipboard:

- good for queueing and internal notes
- good for reviewed partner profile staging
- not good for permissions, auth, payouts, or sensitive documents

### HubSpot

Treat HubSpot as CRM/task pipeline:

- good for contacts and follow-up tasks
- good for pipeline handoff
- not good for raw payload dumps or sensitive data parking lots

## Recommended routing by event type

| Event type | Recommended mode | Notes |
|---|---|---|
| `partner_classified` | `notion` | Stage for review first |
| `partner_reviewed` | `dual_sandbox` | Test CRM sync after human review |
| `partner_approved` | `hubspot` | CRM follow-up task flow |
| `partner_watchlisted` | `notion` | Keep in nurture/review board |
| `partner_updated` | `dual_sandbox` | Sandbox update test only |

## No raw PII logging

Do not log:

- full phone numbers
- raw email dumps beyond redacted summaries
- raw Tally payloads
- private notes containing borrower details
- bank/account/tax/credential data
- uploaded documents or document names containing sensitive info

Use `safePartnerSummary()` and `redactSyncEvent()` for operational logs.

## Sync is not approval

A `synced` result means only that the sandbox target accepted the record. It does not mean:

- partner approved
- lead approved
- funding approved
- partner active
- campaign compliant
- commission owed

The system should stay review-led until production auth, audit logging, and CRM data governance exist.
