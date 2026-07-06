# HubSpot Sync Checklist

## Purpose

Use this checklist before enabling Partner Intake OS to sync partner data into HubSpot.

## Private app token setup

- [ ] Create or identify HubSpot private app for Partner Intake OS.
- [ ] Grant only the scopes needed for contacts, companies, deals, tasks, and notes.
- [ ] Store token only in Vercel environment variables.
- [ ] Add env var:

```text
HUBSPOT_ACCESS_TOKEN=
```

- [ ] Do not store token in GitHub.
- [ ] Do not paste token into docs, screenshots, Notion, HubSpot notes, or issue comments.
- [ ] Rotate token if exposed.

## Property creation checklist

- [ ] Contact properties created.
- [ ] Company properties created.
- [ ] Deal properties created.
- [ ] Internal names match `/hubspot/property-setup.md`.
- [ ] Dropdown enum values match Partner Intake OS schema values.
- [ ] Boolean fields accept true/false.
- [ ] Score field accepts number.
- [ ] Date/time field accepts sync timestamp.
- [ ] Multi-line fields are used only for summaries, not secret dumps.

## Pipeline setup checklist

- [ ] Partner Intake Pipeline created.
- [ ] New Intake stage created.
- [ ] Needs Review stage created.
- [ ] Missing Info stage created.
- [ ] Approved stage created.
- [ ] Onboarding stage created.
- [ ] Active Partner stage created.
- [ ] Watchlist stage created.
- [ ] Rejected stage created.
- [ ] Archived stage created.
- [ ] Stage order matches `/hubspot/pipeline-setup.md`.
- [ ] Partner Status property aligns with pipeline stage.

## Test sync checklist

Use sample records from:

```text
/hubspot/sample-records.json
```

Run test sync for:

- [ ] funding broker
- [ ] CPA/bookkeeper
- [ ] business attorney
- [ ] business broker
- [ ] veteran/community connector
- [ ] affiliate/content creator

Confirm each test:

- [ ] Contact created or updated.
- [ ] Company created or updated when domain exists.
- [ ] Deal created in Partner Intake Pipeline.
- [ ] Contact is associated to company.
- [ ] Deal is associated to contact.
- [ ] Deal is associated to company when company exists.
- [ ] Partner ID appears on contact/deal.
- [ ] Partner Type appears on contact/deal.
- [ ] Partner Tier appears on contact/deal.
- [ ] Risk Level appears on contact/deal.
- [ ] Partner Status appears on contact/deal.
- [ ] Next Action appears on contact/deal.
- [ ] Last Partner Intake Sync is updated.
- [ ] No duplicate contact created when same email is synced twice.
- [ ] No duplicate company created when same domain is synced twice.
- [ ] No duplicate active deal created for same Partner ID.

## Task creation checklist

- [ ] Manual review task created when `manual_review_required = true`.
- [ ] Tier 1 follow-up task created for Tier 1 records.
- [ ] Missing info task created for Missing Info stage.
- [ ] Risk review task created for high-risk records.
- [ ] Onboarding kickoff task created for Approved stage.
- [ ] Task subject follows naming convention.
- [ ] Task body includes key Partner Intake OS fields.
- [ ] Task owner is assigned or routed to fallback owner.
- [ ] Rejected records do not receive onboarding tasks.

## Activity note checklist

- [ ] GPT review note is created.
- [ ] Decision note is created after manual decision.
- [ ] Sync note is created after sync.
- [ ] Notes include Partner ID.
- [ ] Notes include risk level and risk flags.
- [ ] Notes include recommended next action.
- [ ] Notes do not include secrets.
- [ ] Notes avoid guarantees or lender certainty.

## Data privacy checklist

- [ ] Only necessary partner data is synced.
- [ ] Raw Tally payloads are not dumped into HubSpot notes by default.
- [ ] API keys and webhook secrets are not stored in HubSpot.
- [ ] Private keys are not stored in HubSpot.
- [ ] Sensitive notes are access-controlled.
- [ ] High-risk records are not included in partner-facing automations.
- [ ] Rejected records do not trigger campaigns.

## Failure handling checklist

- [ ] Failed contact sync returns clear error.
- [ ] Failed company sync does not block contact record if contact is valid.
- [ ] Failed deal sync creates review note or task where possible.
- [ ] Duplicate uncertainty creates manual review task.
- [ ] Rate-limit or temporary failures can be retried safely.
- [ ] Permanent validation failures are logged with safe details.
- [ ] Sync failure does not expose secrets in logs.

## Production readiness checklist

- [ ] Test mode completed.
- [ ] Sample records verified.
- [ ] Owner assignment tested.
- [ ] Pipeline reports look clean.
- [ ] Dedupe behavior tested.
- [ ] High-risk routing tested.
- [ ] Rejected routing tested.
- [ ] Token stored in Vercel.
- [ ] Rollback/disable path documented.
