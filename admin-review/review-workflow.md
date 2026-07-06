# Admin Review Workflow

## 1. Intake received

Trigger sources:

- Tally partner signup
- manual import
- referral note
- inbound partner email
- future lead submission module
- future tracking link campaign source

The intake should include partner identity, business context, audience, partner role, referral capability, risk notes, and consent/acknowledgment where relevant.

## 2. Normalize record

Convert raw intake into the internal partner profile format:

- partner_id
- display_name
- company
- partner_type
- partner_tier
- onboarding_path
- primary_audience
- risk_level
- score
- status
- next_action
- risk_flags
- recommended_resources
- recommended_campaign

## 3. Score/classify

Classification should consider:

- audience access
- funding relevance
- trust level
- expected deal flow
- activation speed
- compliance risk
- strategic leverage
- technical readiness
- relationship quality

## 4. Route to review queue

Records go to the queue when:

- manual_review_required is true
- risk_level is medium or high
- score is above Tier 1 threshold
- partner_type is uncertain
- required fields are missing
- lead source is untrusted
- partner claims are aggressive or hard to verify

## 5. Review risk flags

Reviewers inspect:

- consent quality
- lead-source quality
- claims about approvals/funding
- compliance-safe positioning
- partner audience fit
- duplicate or suspicious records
- readiness to receive tracking links or lead forms

## 6. Decide

Allowed review decisions:

- approve
- reject
- watchlist
- request_more_info
- approve_with_conditions
- escalate_to_admin

## 7. Assign onboarding path

Recommended paths:

- fast_track_revenue_partner
- standard_affiliate_partner
- referral_only_partner
- education_first_partner
- strategic_partner_review
- nurture_watchlist
- reject_manual_risk_review

## 8. Assign resource pack

Resource pack examples:

- broker starter pack
- referral partner script pack
- CPA/bookkeeper client-readiness pack
- attorney/business broker intro pack
- creator affiliate content pack
- strategic partner review packet

## 9. Assign campaign kit

Campaign kit examples:

- funding readiness checklist campaign
- broker follow-up campaign
- client cash-flow gap campaign
- veteran SMB readiness campaign
- acquisition funding prep campaign
- affiliate tracking link campaign

## 10. Create follow-up task

Create a task when:

- Tier 1 partner needs call
- missing info must be requested
- risk review is required
- partner is approved and needs onboarding
- watchlist partner needs nurture follow-up

## 11. Sync to Notion/HubSpot

Sync only after review status is clear. Notion can be staging/review. HubSpot can be CRM execution. GitHub remains source files only.

## 12. Update dashboard status

Dashboard status should reflect the latest review outcome, assigned owner, next action, updated timestamp, and any manual notes.
