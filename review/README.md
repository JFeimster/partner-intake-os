# Review Queue Workflow Engine

Batch 32 turns the admin review queue into an operating workflow instead of a static list.

## Purpose

Use this module when a partner intake, lead submission, campaign request, or tracking event needs human judgment before the system moves forward.

## Review-safe language

Use these status labels only:

- `new`
- `needs_review`
- `needs_info`
- `approved_for_onboarding`
- `rejected`
- `paused`
- `archived`

Avoid saying `approved partner` in admin notes or partner-facing copy. `approved_for_onboarding` means the partner can enter onboarding. It does **not** imply funding approval, lender review, guaranteed commissions, or guaranteed business outcomes.

## Systems touched

- Postgres production data store from Batch 31
- `admin_review_items`
- `partner_events`
- `audit_log`
- Future notification workflows, not implemented here

## Operating rule

Every meaningful queue action should produce:

1. A status change or action event
2. An operator note when context matters
3. An immutable decision log entry
4. An audit log entry where possible

## Sensitive data rule

Do not place raw borrower files, full SSNs, bank statements, private credentials, or lender portal data in review notes. Store only a safe summary and a pointer to the secure system that holds the record.

## Required environment

- `DATABASE_URL`
- `PARTNER_INTAKE_STORAGE_MODE=postgres`
- `PARTNER_INTAKE_ADMIN_TOKEN` or compatible admin session middleware

No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.
