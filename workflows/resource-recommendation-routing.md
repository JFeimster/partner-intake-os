# Resource Recommendation Routing Workflow

## Purpose

Assign the right resource pack to each partner based on partner type, audience, onboarding path, and risk level.

The goal is simple: give each partner the tool that helps them activate fastest without sending them into a content junk drawer.

## Trigger

Resource routing runs when:

- A partner profile is created.
- A partner is classified.
- Partner status changes to `approved`, `education_first`, `watchlist`, or `manual_review`.
- Admin requests a resource recommendation.
- GPT Action `recommendPartnerResources` returns a resource set.

## Inputs

- Partner type
- Partner tier
- Primary audience
- Secondary audiences
- Onboarding path
- Desired partner role
- Current tools
- Funding experience
- Risk level
- Recommended campaign

## Steps

1. Load partner profile.
2. Read `partner_type`, `primary_audience`, and `onboarding_path`.
3. Match to the resource catalog.
4. Apply risk filter:
   - High-risk: only internal/admin review resources.
   - Medium-risk: education-first resources and compliant copy guidance.
   - Low-risk: activation resources and campaign kits.
5. Assign primary resource.
6. Assign supporting resources.
7. Create resource card output for dashboard.
8. Add resource links/placeholders to CRM/storage record.
9. Queue welcome message or admin review note.
10. Track resource assignment event.

## Outputs

- Recommended resource pack
- Resource card payload
- Priority ranking
- Reason for recommendation
- Suggested CTA
- CRM note
- Dashboard-ready resource list

## Systems touched

- Partner Intake OS resource router
- Knowledge/resource catalog
- HubSpot contact/deal properties
- Notion resource relation/status fields
- Google Sheets resource columns
- Future dashboard resource cards
- GPT Action resource endpoint

## Failure handling

| Failure | Handling |
|---|---|
| Unknown partner type | Use general partner orientation pack. |
| Missing audience | Use education-first pack and request more info. |
| Resource URL missing | Store resource title and mark URL placeholder. |
| Risk level high | Do not send external-facing resources automatically. |
| Duplicate resource assigned | Update assignment timestamp instead of duplicating. |

## Human review rules

Human review is required before sending resources when:

- Partner is high-risk.
- Partner requested legal, lending, credit repair, or compliance claims.
- Partner is a strategic/vendor partner.
- Resource contains offer copy that could be misused.
- Partner has unclear audience source.

## Fields updated

- `recommended_resources`
- `resource_priority`
- `resource_assignment_status`
- `resource_assigned_at`
- `next_action`
- `notes`
- `dashboard_resource_cards`
- `event_type: resource_recommended`

## Future improvements

- Add click tracking.
- Add partner-specific resource links.
- Add gated dashboard resource access.
- Add resource completion tracking.
- Add resource performance analytics by partner type.
- Add dynamic resource recommendations from GPT Action logs.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
