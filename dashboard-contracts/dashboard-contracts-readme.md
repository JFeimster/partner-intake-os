# Dashboard Data Contracts

## Purpose

This folder defines the Batch 10 data contracts for the future Partner Command Center dashboard module.

These files do **not** create dashboard UI. They define the objects the dashboard will consume after Partner Intake OS classifies, scores, routes, and stores a partner profile.

In plain English: this is the dashboard's menu, not the restaurant. No pixels yet. No React goblin. No accidental Batch 11 invasion.

## Files

| File | Purpose |
|---|---|
| `partner-dashboard-card.schema.json` | Compact partner snapshot for dashboard cards and profile headers. |
| `partner-onboarding-checklist.schema.json` | Partner onboarding task list with completion tracking. |
| `partner-resource-card.schema.json` | Recommended resources for the partner based on type, audience, and onboarding path. |
| `partner-campaign-card.schema.json` | Recommended campaign kit or activation campaign for the partner. |
| `admin-partner-review-card.schema.json` | Internal admin review object for approval, watchlist, reject, or manual review decisions. |
| `sample-dashboard-payload.json` | One combined realistic payload containing all major dashboard objects. |

## Contract position in the Partner Intake OS pipeline

```text
Tally submission
  -> Vercel webhook
  -> signature verification
  -> field normalization
  -> partner scoring
  -> partner classification
  -> onboarding/resource/campaign recommendations
  -> storage router
  -> dashboard data contracts
  -> future Partner Command Center dashboard
```

## Design rules

- Use JSON Schema Draft 2020-12.
- Keep objects display-ready for a static MVP and future authenticated dashboard.
- Keep admin-only review objects separate from partner-facing cards.
- Do not put raw Tally payloads in dashboard cards.
- Do not include sensitive notes, private admin reasoning, or internal security metadata in partner-facing objects.
- Do not imply guaranteed approvals, guaranteed funding amounts, credit repair outcomes, lender certainty, fake urgency, invented testimonials, or “everyone qualifies” language.

## Recommended usage

### Static dashboard MVP

Batch 11 can load `sample-dashboard-payload.json` from local `/site/partner-intake/data/` after copying or transforming it.

### Future API response

A future dashboard endpoint could return this shape:

```json
{
  "partner_dashboard_card": {},
  "partner_onboarding_checklist": {},
  "partner_resource_cards": [],
  "partner_campaign_cards": [],
  "admin_partner_review_card": {}
}
```

### Future storage mapping

- Notion can store the partner card fields as database properties and checklist/resources/campaigns as related tables or page sections.
- HubSpot can map the partner card into contact/company/deal properties and admin review into tasks or notes.
- Google Sheets can flatten partner card fields into columns and store nested resources/campaigns as JSON strings or separate tabs.
- Supabase or another database can store each contract as separate typed tables later.

## Validation notes

These schemas are designed to be validated by any JSON Schema Draft 2020-12 compatible validator.

Example validation targets:

- Validate a single partner card against `partner-dashboard-card.schema.json`.
- Validate onboarding tasks against `partner-onboarding-checklist.schema.json`.
- Validate each item in `partner_resource_cards` against `partner-resource-card.schema.json`.
- Validate each item in `partner_campaign_cards` against `partner-campaign-card.schema.json`.
- Validate admin review data against `admin-partner-review-card.schema.json`.

## Admin vs partner-facing boundary

The `admin-partner-review-card.schema.json` object is internal by default. Do not expose it directly to partners without filtering.

Safe partner-facing fields are usually:

- partner display name
- onboarding checklist labels/status
- approved resource cards
- approved campaign cards
- next action after approval

Keep these private:

- internal score reasoning
- risk flags
- reviewer notes
- rejection/watchlist rationale
- source metadata
- webhook/security details
- raw Tally payloads

## Batch boundary

Batch 10 creates contracts only.

Do **not** add:

- `site/partner-intake/index.html`
- dashboard CSS/JS
- API endpoints
- OpenAPI specs
- automation workflows
- storage connector code

Those belong to later batches.
