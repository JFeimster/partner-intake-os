# New Partner Intake Workflow

## Purpose

Turn a new Tally partner signup into a normalized, classified, stored, reviewable partner record.

This is the main front-door automation for Partner Intake OS. It converts raw form chaos into partner operations intelligence: profile, tier, onboarding path, recommended resources, campaign recommendation, risk flags, and next action.

## Trigger

A new Tally `FORM_RESPONSE` event is submitted to:

```text
POST /api/tally/partner-intake-webhook
```

Recommended custom header:

```text
X-Partner-Source: tally
```

## Inputs

- Raw Tally webhook payload
- Tally form metadata
- Submitted field values
- Webhook signature header
- Environment variables:
  - `TALLY_SIGNING_SECRET`
  - `PARTNER_INTAKE_STORAGE_MODE`
  - `PARTNER_INTAKE_ENV`
- Existing field map from `/tally/tally-field-map.json`
- Existing scoring/classification logic from prior API scaffold

## Steps

1. Tally sends a `FORM_RESPONSE` webhook to the Vercel endpoint.
2. Webhook receiver confirms the request method is `POST`.
3. Webhook receiver parses the JSON body.
4. Signature verification runs when `TALLY_SIGNING_SECRET` is configured.
5. Raw Tally field labels are mapped to internal intake fields.
6. Submission is normalized into the Partner Intake schema.
7. Intake is scored for audience fit, trust, revenue potential, activation speed, strategic value, and compliance risk.
8. Partner type is classified.
9. Partner tier is recommended.
10. Onboarding path is selected.
11. Recommended resources are routed by partner type and audience.
12. Campaign recommendation is generated or selected.
13. Storage router sends the result to the configured storage mode:
    - `mock`
    - `json`
    - `notion`
    - `hubspot`
    - `google_sheets`
14. Admin/GPT review card is prepared.
15. Workflow creates or queues the next action.
16. Webhook returns a fast `2XX` response.

## Outputs

- Normalized intake object
- Partner profile object
- Partner scorecard
- Risk flags
- Recommended onboarding path
- Recommended resource pack
- Recommended campaign kit
- Storage confirmation
- Admin review status
- Next action

## Systems touched

- Tally
- Vercel API webhook
- Partner Intake OS normalizer
- Partner Intake OS scoring/classification logic
- Storage router
- Notion, HubSpot, Google Sheets, or JSON/mock storage depending on mode
- Custom GPT review flow
- Future Partner Command Center dashboard

## Failure handling

| Failure | Handling |
|---|---|
| Missing body | Return `400` with safe error; log request ID only. |
| Invalid JSON | Return `400`; do not store partial record. |
| Signature mismatch | Return `401` or `403`; do not process. |
| Missing required contact fields | Store as incomplete only if safe; route to manual review. |
| Classification confidence low | Store with `manual_review_required: true`. |
| Storage connector fails | Return successful webhook response if intake was accepted, then queue/retry storage where supported. |
| Duplicate submission | Use email + submitted_at + form_response_id if available to detect duplicate. |
| High-risk language | Flag, do not approve automatically. |

## Human review rules

Manual review is required when:

- Email is missing or clearly fake.
- Partner type is unclear.
- Partner claims unrealistic volume.
- Partner mentions bought leads, scraped lists, call centers, robocalls, SMS blasts, or pressure tactics.
- Partner makes approval, credit repair, or guaranteed funding claims.
- Partner requests payout/commission details before describing a legitimate audience.
- Strategic/vendor partner has integration implications.
- Tier recommendation is `tier_1` or `reject`.

## Fields updated

- `partner_id`
- `display_name`
- `company`
- `email`
- `phone`
- `website`
- `partner_type_claimed`
- `partner_type`
- `partner_tier`
- `onboarding_path`
- `primary_audience`
- `secondary_audiences`
- `risk_level`
- `risk_flags`
- `status`
- `lead_source`
- `recommended_resources`
- `recommended_campaigns`
- `next_action`
- `manual_review_required`
- `created_at`
- `updated_at`
- `notes`

## Future improvements

- Add duplicate detection across HubSpot and Notion.
- Add enrichment for company website, LinkedIn, and partner category.
- Add admin approval queue.
- Add Slack/Gmail alert for Tier 1 candidates.
- Add partner dashboard provisioning after approval.
- Add audit log for every classification and status change.
- Add retry queue for storage connector failures.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
