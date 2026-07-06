# HubSpot Sync Flow

## Purpose

Map Partner Intake OS partner records into HubSpot as usable CRM objects: contact, company, deal/task, and partner lifecycle properties.

HubSpot should be the motion tracker, not the brain. The classification brain stays in Partner Intake OS; HubSpot receives structured fields.

## Trigger

HubSpot sync runs when:

- A partner profile is created.
- A partner profile is updated.
- Status changes to `manual_review`, `approved`, `watchlist`, `rejected`, or `activated_pending`.
- Admin/GPT logs an event.
- `PARTNER_INTAKE_STORAGE_MODE=hubspot` or HubSpot sync is enabled in mixed mode.

## Inputs

- Partner profile
- Partner scorecard
- Admin review card
- Recommended resources
- Recommended campaigns
- Partner CRM event
- HubSpot access token environment variable
- HubSpot property spec from prior storage packet

## Steps

1. Check HubSpot credentials exist.
2. Search HubSpot for existing contact by email.
3. Create or update contact.
4. Create or update company if company name/domain exists.
5. Create or update partner-related deal/pipeline record if configured.
6. Create task for next action.
7. Add note summarizing classification and risk.
8. Store HubSpot object IDs back into partner record if available.
9. Log sync result.
10. Surface failures for admin repair.

## Outputs

- HubSpot contact
- Optional HubSpot company
- Optional HubSpot deal/pipeline record
- HubSpot task
- HubSpot note
- Sync status
- HubSpot object IDs

## Systems touched

- Partner Intake OS storage router
- HubSpot CRM
- Vercel API storage connector
- Admin/GPT review flow
- Future dashboard record links

## Failure handling

| Failure | Handling |
|---|---|
| Missing HubSpot token | Skip sync and log `hubspot_not_configured`. |
| Contact conflict | Match by email first; do not create duplicates blindly. |
| Company conflict | Match by domain/company name and require review if uncertain. |
| API error | Retry where safe; otherwise queue manual sync. |
| Property missing | Log schema/property mismatch and continue with safe fields. |

## Human review rules

Human review is required when:

- Duplicate HubSpot contact/company conflict exists.
- Partner has high-risk flags.
- Strategic partner requires deal/pipeline setup.
- Partner needs custom owner assignment.
- Contact data appears invalid.

## Fields updated

Partner Intake OS fields:

- `hubspot_contact_id`
- `hubspot_company_id`
- `hubspot_deal_id`
- `hubspot_task_id`
- `sync_status`
- `last_synced_at`
- `sync_errors`

HubSpot fields/properties:

- `partner_type`
- `partner_tier`
- `onboarding_path`
- `risk_level`
- `partner_status`
- `next_action`
- `recommended_resources`
- `recommended_campaign`
- `manual_review_required`
- `lead_source`

## Future improvements

- Add HubSpot custom object for partners.
- Add pipeline stage automation.
- Add lifecycle reports by partner type.
- Add owner routing by tier/audience.
- Add activity logging from GPT Actions.
- Add campaign/lead attribution once partner tracking exists.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
