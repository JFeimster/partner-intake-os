# Notion Sync Flow

## Purpose

Sync Partner Intake OS records into a Notion partner staging database for clean internal review, tracking, and lightweight ops management.

Notion is the staging table and command notebook. Do not treat GitHub as the live database. GitHub is the blueprint vault.

## Trigger

Notion sync runs when:

- New partner intake is created.
- Partner status changes.
- Admin review is required.
- Resource/campaign recommendations are assigned.
- `PARTNER_INTAKE_STORAGE_MODE=notion` or Notion sync is enabled in mixed mode.

## Inputs

- Partner profile
- Normalized intake
- Partner scorecard
- Resource recommendations
- Campaign recommendations
- Admin review card
- Notion API key
- Notion partner database ID
- Notion property field map

## Steps

1. Confirm Notion credentials exist.
2. Search database for existing partner by email or partner ID.
3. Create or update Notion page.
4. Map core profile fields to Notion properties.
5. Add score/risk fields.
6. Add recommended resources and campaigns.
7. Add admin review status.
8. Add notes section with plain-English summary.
9. Store Notion page URL/ID back into system where possible.
10. Log sync result.

## Outputs

- Notion partner database page
- Review status
- Partner tier/status fields
- Resource/campaign fields
- Admin notes
- Sync status

## Systems touched

- Partner Intake OS storage router
- Notion API
- Notion partner database
- Admin/GPT review process
- Future dashboard link fields

## Failure handling

| Failure | Handling |
|---|---|
| Missing Notion credentials | Skip sync and use current storage mode fallback. |
| Database ID invalid | Log configuration error. |
| Missing property | Add value to notes instead of failing the whole sync. |
| Duplicate page | Update closest email/partner ID match; flag duplicates. |
| API rate/error | Retry later or queue manual sync. |

## Human review rules

Human review is required when:

- Duplicate Notion records exist.
- Required contact fields are missing.
- Partner tier is Tier 1 or reject.
- Risk level is medium/high.
- Admin decision is unclear.

## Fields updated

Notion properties should include:

- `Partner ID`
- `Name`
- `Company`
- `Email`
- `Partner Type`
- `Partner Tier`
- `Onboarding Path`
- `Primary Audience`
- `Risk Level`
- `Status`
- `Manual Review Required`
- `Next Action`
- `Recommended Resources`
- `Recommended Campaign`
- `Owner`
- `Created At`
- `Updated At`
- `Source`

Partner Intake OS fields:

- `notion_page_id`
- `notion_page_url`
- `sync_status`
- `last_synced_at`
- `sync_errors`

## Future improvements

- Build Notion views by tier, status, owner, and risk.
- Add Notion buttons for approve/watchlist/reject.
- Add two-way sync rules.
- Add linked database for resources/campaigns.
- Add manual review queue view.
- Add rollups for partner activation metrics.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
