# Schemas README

Partner Intake OS uses JSON Schema files as the machine-readable contract between manual GPT review, the Vercel API layer, storage connectors, CRM tools, attribution logic, and future dashboard modules.

This folder is the contract layer. Treat it like the wiring diagram for the revenue machine. If field names drift here, the whole pipeline starts speaking five dialects of chaos.

## Scope

These schemas support:

- partner intake normalization
- partner classification and scoring
- risk review and admin decisions
- CRM-ready notes, tasks, status updates, and event logs
- lead submission and attribution
- campaign kit and welcome packet generation
- dashboard summaries and admin review cards
- integration sync results, storage records, webhook receipts, audit logs, and consent records

## Schema groups

### Core intake and profile schemas

| File | Purpose |
|---|---|
| `intake.schema.json` | Raw or normalized partner intake data from Tally, manual entry, API input, or GPT review. |
| `tally-submission.schema.json` | Tally webhook payload wrapper and normalized intake object. |
| `profile.schema.json` | Normalized partner profile used by CRM, dashboard, storage, and API responses. |
| `scorecard.schema.json` | Partner scoring output for urgency, audience fit, trust, revenue potential, activation speed, compliance risk, strategic value, and tiering. |
| `onboarding-plan.schema.json` | Structured onboarding plan with first 24 hours, first 7 days, first 30 days, required assets, and next action. |
| `resource-recommendation.schema.json` | Recommended resources based on partner type, audience, and partner stage. |
| `campaign-recommendation.schema.json` | Recommended campaign concept, channels, CTA, copy angle, and tracking notes. |
| `crm-events.schema.json` | CRM-style partner events and next-action records. |
| `api-error.schema.json` | Standard API error contract. |

### Shared foundation schemas

| File | Purpose |
|---|---|
| `common.schema.json` | Shared primitives such as IDs, timestamps, URLs, scores, metadata, owner fields, and contact wrappers. |
| `enums.schema.json` | Shared enum values for partner type, tier, risk level, status, decision, event types, sync state, and environment. |

### Classification and review schemas

| File | Purpose |
|---|---|
| `classification-result.schema.json` | Full classification output from GPT/API logic. Includes type, tier, onboarding path, scorecard, risk assessment, CRM fields, dashboard summary, and confidence score. |
| `risk-assessment.schema.json` | Risk flags and compliance checks for bad-fit or high-risk partners. |
| `manual-review.schema.json` | Admin review queue record when a partner needs human review. |
| `admin-decision.schema.json` | Final or interim admin decision, including status changes, tasks, resources, and campaign assignment. |

### Operational/admin schemas

| File | Purpose |
|---|---|
| `partner-note.schema.json` | CRM-ready internal, partner-visible, or admin-only notes. |
| `partner-task.schema.json` | Tasks for onboarding, review, follow-up, compliance checks, campaign setup, and CRM updates. |
| `partner-status-update.schema.json` | Partner lifecycle status transition record. |
| `partner-activity.schema.json` | Dashboard/CRM timeline activity record. |
| `partner-event-log.schema.json` | Structured event history for API calls, GPT Actions, automations, admin activity, and integrations. |

### Lead submission and tracking schemas

| File | Purpose |
|---|---|
| `lead-submission.schema.json` | Partner-submitted lead intake. Intake only; it does not imply approval, eligibility, or funding certainty. |
| `lead-submission-response.schema.json` | API validation response after a lead submission. |
| `tracking-link.schema.json` | Partner/campaign tracking URL and UTM metadata. |
| `attribution-event.schema.json` | Privacy-conscious event record for clicks, form starts, lead submissions, and attribution. |
| `referral-source.schema.json` | Partner referral source, channel, expected volume, quality notes, and risk notes. |

### Partner activation and dashboard schemas

| File | Purpose |
|---|---|
| `campaign-kit.schema.json` | Partner campaign kit with CTA, audience, channels, copy angle, suggested assets, tracking link, and compliance notes. |
| `welcome-packet.schema.json` | Onboarding packet with welcome message, first steps, resources, campaign kit, dashboard notes, and support contact. |
| `dashboard-summary.schema.json` | Compact dashboard profile snapshot. |
| `admin-review-card.schema.json` | Admin review card for queue views and decision-making. |

### Integration, storage, webhook, audit, and consent schemas

| File | Purpose |
|---|---|
| `integration-sync-result.schema.json` | Result of syncing a local object to Notion, HubSpot, Google Sheets, Supabase, JSON/mock storage, n8n, or Activepieces. |
| `storage-record.schema.json` | Generic persistence wrapper for local or external storage systems. |
| `webhook-receipt.schema.json` | Internal webhook receipt and processing status. Do not expose Tally webhook processing through GPT Actions. |
| `audit-log.schema.json` | Audit record for sensitive changes and operational history. |
| `consent.schema.json` | Consent and acknowledgment record for partner intake, lead submission, communications, attribution, or data processing. |

## How to validate schemas

Recommended local validation:

```bash
python -m json.tool schemas/common.schema.json > /dev/null
python -m json.tool schemas/enums.schema.json > /dev/null
```

Validate all schema JSON files:

```bash
python - <<'PY'
import json
from pathlib import Path

for path in sorted(Path("schemas").glob("*.schema.json")):
    with path.open("r", encoding="utf-8") as f:
        json.load(f)
    print(f"valid json: {path}")
PY
```

For full JSON Schema validation, use a Draft 2020-12-compatible validator such as Ajv.

```bash
npm install -D ajv ajv-formats
```

Example validation pattern:

```bash
npx ajv validate -s schemas/classification-result.schema.json -d examples/sample-classification-result.json --spec=draft2020
```

## Naming conventions

Use this style:

- schema filenames: lowercase kebab-case ending in `.schema.json`
- field names: lowercase snake_case
- enum values: lowercase snake_case
- IDs: prefix-based strings such as `ptr_`, `lead_`, `camp_`, `trk_`, `attr_`, `rev_`, `sync_`, `audit_`
- timestamps: ISO 8601 date-time strings
- URLs: validated with `format: uri`
- emails: validated with `format: email`

Do not add project-name prefixes to filenames. The repo already establishes context.

## Maintenance notes

When adding a new operational concept:

1. Add shared values to `enums.schema.json` first if the field will be reused.
2. Add primitives to `common.schema.json` only when at least two schemas need the same field structure.
3. Create the domain schema.
4. Add a sample payload.
5. Update OpenAPI components if the API exposes that object.
6. Update the dashboard contract only if the UI consumes it.
7. Add validation checklist coverage under `/tests/`.

## Compliance notes

The schema layer must not encode fake funding certainty. Avoid fields or examples that imply:

- guaranteed approvals
- guaranteed funding amounts
- guaranteed eligibility
- credit repair positioning
- fake lender certainty
- deceptive urgency
- invented testimonials
- everyone qualifies language

Use readiness, review, intake, routing, eligibility review, fit assessment, and next-action language instead.
