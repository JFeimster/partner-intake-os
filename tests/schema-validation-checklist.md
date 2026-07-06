# Schema Validation Checklist

Use this checklist before merging schema or OpenAPI changes into the Partner Intake OS repo.

## JSON Schema validation checklist

- [ ] Every schema file is valid JSON.
- [ ] Every schema file uses `.schema.json`.
- [ ] Every schema includes `$schema`.
- [ ] Every schema includes `$id`.
- [ ] Every schema includes `title`.
- [ ] Every schema includes `description`.
- [ ] Every schema defines `type`.
- [ ] Every object schema defines `properties`.
- [ ] Every object schema defines `required`.
- [ ] Every object schema defines `additionalProperties`.
- [ ] Every schema includes at least one realistic `examples` entry when practical.
- [ ] Relative `$ref` values resolve from the `/schemas/` folder.
- [ ] Shared primitives come from `common.schema.json` when reused.
- [ ] Shared enums come from `enums.schema.json` when reused.

Quick syntax test:

```bash
python - <<'PY'
import json
from pathlib import Path

for path in sorted(Path("schemas").glob("*.json")):
    with path.open("r", encoding="utf-8") as f:
        json.load(f)
    print(f"valid json: {path}")
PY
```

## Required fields checklist

- [ ] Required fields are truly required for MVP operation.
- [ ] Optional fields are not accidentally required.
- [ ] ID fields follow prefix convention.
- [ ] Timestamp fields use `format: date-time`.
- [ ] Date-only fields use `format: date`.
- [ ] Email fields use `format: email`.
- [ ] URL fields use `format: uri`.
- [ ] Scores include `minimum` and `maximum`.
- [ ] Arrays include `items`.
- [ ] Free-text fields include reasonable `maxLength`.
- [ ] PII fields are minimized where possible.

## Enum consistency checklist

Check these shared enum values across schemas:

- [ ] `partner_type`
- [ ] `partner_tier`
- [ ] `onboarding_path`
- [ ] `risk_level`
- [ ] `partner_status`
- [ ] `next_action`
- [ ] `decision`
- [ ] `review_status`
- [ ] `task_status`
- [ ] `activity_type`
- [ ] `event_source`
- [ ] `campaign_type`
- [ ] `campaign_channel`
- [ ] `resource_type`
- [ ] `lead_status`
- [ ] `lead_source`
- [ ] `attribution_event_type`
- [ ] `integration_system`
- [ ] `sync_status`
- [ ] `consent_status`
- [ ] `webhook_status`
- [ ] `environment`

Rules:

- [ ] Use lowercase snake_case.
- [ ] Do not duplicate the same meaning under two names.
- [ ] Do not introduce one-off enum values in child schemas unless they are truly local.
- [ ] Add enum changes to `enums.schema.json` first.

## Sample payload checklist

Create or verify sample payloads for:

- [ ] low-info partner intake
- [ ] funding broker
- [ ] CPA/bookkeeper referral partner
- [ ] business attorney
- [ ] business broker
- [ ] veteran/community partner
- [ ] affiliate/content creator
- [ ] shady lead seller / high-risk signup
- [ ] classification result
- [ ] risk assessment
- [ ] manual review
- [ ] admin decision
- [ ] lead submission
- [ ] tracking link
- [ ] attribution event
- [ ] integration sync result
- [ ] webhook receipt
- [ ] consent record
- [ ] API error

Each sample should avoid:

- [ ] guaranteed approvals
- [ ] guaranteed funding amounts
- [ ] credit repair claims
- [ ] fake lender certainty
- [ ] deceptive urgency
- [ ] invented testimonials
- [ ] “everyone qualifies” language

## API response compatibility checklist

For each API route, confirm response matches a schema.

Core routes:

- [ ] `GET /api/health`
- [ ] `POST /api/partners/classify`
- [ ] `POST /api/partners/recommend-resources`
- [ ] `POST /api/partners/generate-onboarding-plan`
- [ ] `POST /api/partners/generate-campaign-kit`
- [ ] `POST /api/partners/log-event`

Planned routes:

- [ ] `POST /api/partners/submit-lead`
- [ ] `POST /api/partners/create-tracking-link`
- [ ] `POST /api/partners/log-attribution-event`
- [ ] `POST /api/admin/review-partner`
- [ ] `POST /api/admin/update-partner-status`
- [ ] `GET /api/admin/review-queue`

Keep planned routes marked planned until live.

## Dashboard compatibility checklist

- [ ] `profile.schema.json` feeds partner snapshot.
- [ ] `dashboard-summary.schema.json` feeds dashboard cards.
- [ ] `admin-review-card.schema.json` feeds admin review queue.
- [ ] `onboarding-plan.schema.json` feeds onboarding checklist sections.
- [ ] `resource-recommendation.schema.json` feeds recommended resource cards.
- [ ] `campaign-kit.schema.json` or `campaign-recommendation.schema.json` feeds campaign kit UI.
- [ ] `partner-task.schema.json` feeds open task counts and task lists.
- [ ] `partner-activity.schema.json` feeds timeline activity.
- [ ] `lead-submission.schema.json` supports future lead submission forms.
- [ ] `tracking-link.schema.json` supports future tracking link builder.
- [ ] No dashboard view exposes raw secrets, tokens, webhook signatures, or unnecessary PII.

## GPT Action compatibility checklist

- [ ] `actions/openapi.bundle.yaml` is self-contained.
- [ ] No external `$ref` values exist in the bundle.
- [ ] Every operation has a unique `operationId`.
- [ ] Bearer auth is configured.
- [ ] Server URL is replaced before live import.
- [ ] `checkHealth` works in GPT Action preview.
- [ ] `classifyPartnerIntake` works with a low-info sample.
- [ ] `classifyPartnerIntake` works with a high-risk sample.
- [ ] `recommendPartnerResources` returns structured recommendations.
- [ ] `generatePartnerOnboardingPlan` returns the expected sections.
- [ ] `generatePartnerCampaignKit` includes compliance notes.
- [ ] `logPartnerEvent` returns logged confirmation.
- [ ] `/api/tally/partner-intake-webhook` is not present.
- [ ] Admin-only endpoints are not included in partner-facing specs.
- [ ] Planned endpoints are clearly marked or excluded.

## Merge readiness

Before committing:

```bash
git status
python -m json.tool actions/openapi.json > /dev/null
python -m json.tool actions/openapi.bundle.json > /dev/null
```

Then:

```bash
git add schemas actions tests
git commit -m "Add schema and OpenAPI validation docs"
```

Final rule: the schema layer should make the system harder to misunderstand, not easier to over-automate. If a field invites bad behavior, rename it, narrow it, or kill it.
