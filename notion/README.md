# Notion Setup Packet

## Purpose

Notion is the staging and admin review workspace for Partner Intake OS. It is where normalized partner intake records can be inspected, reviewed, assigned, and moved through a clear partner status model before or alongside HubSpot CRM sync.

Partner Intake OS flow:

```text
Tally intake / manual review
→ Vercel API normalization and scoring
→ Notion staging database
→ admin review
→ HubSpot / Google Sheets / dashboard-ready record
```

## What Notion should do

- Hold partner intake records for staging and review.
- Give Jason/admins a fast manual review queue.
- Track partner type, tier, onboarding path, score, risk flags, and next action.
- Store recommended resources and campaign recommendations in reviewable fields.
- Support lightweight operations before deeper CRM automation is finalized.
- Provide a readable review layer for records created by Tally, API calls, GPT Actions, or manual entry.

## What Notion should not do

- Do not use Notion as the source code repository.
- Do not store secrets, API keys, bearer tokens, webhook signing secrets, or private keys.
- Do not use Notion as the long-term system of record if HubSpot or another CRM owns the partner lifecycle.
- Do not use Notion as the live partner dashboard backend without authentication and access control.
- Do not store unnecessary sensitive applicant or borrower details in partner records.

GitHub is the blueprint vault. Notion is the review desk. Do not make the review desk hold the keys to the vault.

## Recommended setup order

1. Create the Notion database using `database-setup.md`.
2. Add all properties from `database-properties.md`.
3. Create views from `views-and-filters.md`.
4. Configure statuses using `status-and-stage-model.md`.
5. Add the page template from `partner-record-template.md`.
6. Share the database with your Notion integration.
7. Add `NOTION_API_KEY` and `NOTION_PARTNER_DATABASE_ID` to Vercel.
8. Create one test record using `sample-records.json`.
9. Validate sync behavior using `sync-checklist.md`.
10. Run the pass/fail checklist in `/tests/notion-setup-checklist.md`.

## PII and integration warning

Partner records may contain names, emails, phone numbers, websites, referral notes, and operational context. Keep the database private, grant integration access only where needed, and avoid dumping raw Tally payloads into visible pages unless there is a clear operational reason.

For MVP: store normalized review records, not messy raw intake exhaust. Garbage in, prettier garbage out is still garbage. 🧹
