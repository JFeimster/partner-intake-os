# HubSpot Setup Packet

## Purpose

This packet defines how Partner Intake OS data should sync into HubSpot for partner relationship management, follow-up, pipeline review, and partner activation.

Partner Intake OS should use HubSpot as a CRM operating layer, not as the source code vault. HubSpot is where partner contacts, companies, partner pipeline deals, tasks, notes, and lifecycle activity live after an intake has been normalized, scored, and reviewed.

## What HubSpot does in Partner Intake OS

HubSpot should handle:

- Partner contact records
- Partner company records
- Partner pipeline deals
- Follow-up tasks
- Admin review tasks
- Partner status tracking
- Partner activity notes
- Segmentation by partner type, tier, audience, risk level, source, and onboarding path

## When to use HubSpot vs Notion

Use **Notion** for staging, internal review, and lightweight admin workspace views.

Use **HubSpot** for:

- CRM records
- follow-up ownership
- lifecycle stage management
- task queues
- sales/partner ops reporting
- relationship history
- workflow automation
- deal/pipeline visibility

A practical split:

| System | Best use |
|---|---|
| Notion | Staging database, admin review workspace, structured notes |
| HubSpot | CRM, pipeline, owner assignment, tasks, partner follow-up |
| GitHub | Source files, schemas, docs, OpenAPI specs, static dashboard files |
| Vercel | API layer and webhook receiver |

## Recommended sync strategy

Start simple:

1. Tally receives partner signup.
2. Vercel webhook normalizes and classifies the intake.
3. Record is staged in Notion or mock storage.
4. Human/admin reviews high-risk or incomplete records.
5. Approved or review-worthy records sync into HubSpot.
6. HubSpot creates/updates contact, company, deal, and follow-up task.
7. Partner status changes are logged back to Notion or dashboard data later.

Do not sync every low-quality submission as a full sales opportunity. That turns HubSpot into a landfill with filters. Route obvious junk to review, rejected, or archived before creating unnecessary deals.

## Recommended object usage

| HubSpot object | Use |
|---|---|
| Contact | Individual partner, broker, referral source, COI, affiliate, or strategic contact |
| Company | Their business, agency, firm, community org, or vendor organization |
| Deal | Partner pipeline record representing activation/onboarding opportunity |
| Task | Follow-up, admin review, risk review, Tier 1 outreach, onboarding steps |
| Note/activity | GPT review summary, intake snapshot, risk flags, assigned resources, decision notes |

## What HubSpot should not do

Do not use HubSpot to store:

- source code
- JSON schemas
- OpenAPI files
- raw webhook secrets
- API keys
- private keys
- unfiltered raw webhook payloads with unnecessary PII
- guaranteed approval language
- fabricated lender confidence notes

## Setup order

1. Create custom properties.
2. Create Partner Pipeline stages.
3. Configure lifecycle/status rules.
4. Configure contact/company/deal mapping.
5. Configure task/activity note model.
6. Add test records.
7. Run sync checklist.
8. Confirm dedupe behavior.
9. Confirm data privacy handling.
10. Only then enable production sync.

## Security and privacy warning

Partner records can contain personal information, business information, and sensitive funding-readiness context. Keep access limited to people who actually need it. Do not store secrets in contact notes, deal notes, timeline events, or custom properties.

## Batch boundaries

This packet does not create API code. It documents the HubSpot setup and mapping needed for the existing/future storage connector.
