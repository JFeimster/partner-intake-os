# Partner Portal Access Layer

Batch 35 creates the partner-facing portal shell and access model.

## Purpose

Provide authenticated partner portal structure for:

- profile overview
- onboarding status
- lead submission shell
- tracking link shell
- resources shell

## Security stance

The static portal pages are UI shells only. Real partner data must be fetched from authenticated API endpoints. Do not hardcode partner PII, lead PII, admin data, audit logs, tokens, or commission data into static files.

## Storage stance

`localStorage` is allowed only for safe UX preferences. It is not a data store. It is a sticky note, not Fort Knox. 🧷

## Not included yet

- payout tracking
- commission calculations
- public admin routes
- token storage
- borrower document storage
