# Campaign Kit Generation Workflow

## Purpose

Generate or assign a campaign kit for approved partners based on their audience, partner type, and desired role.

This is where “cool partner signup” becomes “go make noise with something trackable.”

## Trigger

Campaign kit generation runs when:

- Partner is approved.
- Partner requests campaign materials.
- Admin chooses “generate campaign kit.”
- GPT Action `generatePartnerCampaignKit` is called.
- Partner profile has enough data:
  - partner type
  - audience
  - offer angle
  - desired role
  - preferred channels

## Inputs

- Partner profile
- Primary audience
- Partner type
- Desired partner role
- Recommended product/resource
- Preferred channels
- Compliance guardrails
- Tracking link placeholder
- Existing campaign catalog

## Steps

1. Load partner profile.
2. Confirm partner is approved or manually cleared.
3. Select campaign type:
   - referral script
   - email blurb
   - landing page angle
   - social post set
   - webinar/workshop angle
   - business funding readiness checklist
   - broker follow-up angle
4. Generate campaign concept.
5. Generate safe CTA language.
6. Add tracking link placeholder.
7. Add compliance-safe notes.
8. Store campaign card.
9. Add campaign to dashboard-ready payload.
10. Create follow-up task to check first campaign launch.

## Outputs

- Campaign card
- Campaign name
- Audience
- Offer angle
- CTA
- Suggested channels
- Copy angle
- Tracking notes
- Launch checklist
- CRM note/event

## Systems touched

- GPT Action campaign endpoint
- Campaign kit catalog
- Storage router
- HubSpot task/deal/contact
- Notion partner record
- Google Sheets tracking columns
- Future tracking link builder
- Future dashboard campaign cards

## Failure handling

| Failure | Handling |
|---|---|
| Missing audience | Do not generate final kit; request more info. |
| Partner not approved | Generate internal draft only. |
| Risk flags exist | Route to manual copy review. |
| Tracking link unavailable | Use placeholder and mark as pending. |
| Campaign catalog miss | Use generic readiness campaign template. |

## Human review rules

Require manual review before launch when:

- Campaign copy mentions funding speed, amounts, approvals, credit improvement, or lender certainty.
- Partner is a broker/ISO with aggressive sales posture.
- Audience includes sensitive/high-risk niches.
- Partner wants to use SMS/cold outreach.
- Partner wants co-branded language.

## Fields updated

- `recommended_campaigns`
- `campaign_name`
- `campaign_type`
- `campaign_status`
- `tracking_notes`
- `tracking_link_status`
- `copy_review_required`
- `next_action`
- `campaign_assigned_at`
- `event_type: campaign_assigned`

## Future improvements

- Add tracking link builder.
- Add UTM generation.
- Add campaign launch status.
- Add partner content calendar.
- Add conversion tracking by partner/campaign.
- Add GPT-generated copy variants with approval queue.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
