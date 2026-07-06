# Tally to Profile Flow

## Purpose

This file documents the Partner Intake OS intake flow from Tally submission to future dashboard-ready partner profile.

This is a flow document only. It does not create dashboard contracts, dashboard UI, new endpoints, automation workflow files, or storage connector code.

## Flow diagram

```text
┌──────────────────────────────┐
│ 1. Tally partner signup form │
└───────────────┬──────────────┘
                │ FORM_RESPONSE
                ▼
┌──────────────────────────────┐
│ 2. Vercel webhook endpoint   │
│ /api/tally/partner-intake-   │
│ webhook                      │
└───────────────┬──────────────┘
                │ verify source
                ▼
┌──────────────────────────────┐
│ 3. Signature verification    │
│ TALLY_SIGNING_SECRET         │
└───────────────┬──────────────┘
                │ valid request
                ▼
┌──────────────────────────────┐
│ 4. Field normalization       │
│ Tally fields → intake schema │
└───────────────┬──────────────┘
                │ normalized intake
                ▼
┌──────────────────────────────┐
│ 5. Normalized intake object  │
│ source: tally                │
└───────────────┬──────────────┘
                │ score inputs
                ▼
┌──────────────────────────────┐
│ 6. Partner scoring           │
│ fit, trust, deal flow, risk  │
└───────────────┬──────────────┘
                │ scorecard
                ▼
┌──────────────────────────────┐
│ 7. Partner classification    │
│ broker, COI, affiliate, etc. │
└───────────────┬──────────────┘
                │ partner profile
                ▼
┌──────────────────────────────┐
│ 8. Onboarding path routing   │
│ fast-track, standard, review │
└───────────────┬──────────────┘
                │ plan inputs
                ▼
┌──────────────────────────────┐
│ 9. Resource recommendation   │
│ assets, training, swipe copy │
└───────────────┬──────────────┘
                │ campaign inputs
                ▼
┌──────────────────────────────┐
│ 10. Campaign recommendation  │
│ CTA, angle, channel, tracking│
└───────────────┬──────────────┘
                │ completed record
                ▼
┌──────────────────────────────┐
│ 11. Storage router           │
│ mock/json/notion/hubspot/    │
│ google_sheets                │
└───────────────┬──────────────┘
                │ stored or staged
                ▼
┌──────────────────────────────┐
│ 12. Admin / GPT review       │
│ approve, reject, request info│
└───────────────┬──────────────┘
                │ future display
                ▼
┌──────────────────────────────┐
│ 13. Dashboard-ready record   │
│ future Partner Command Center│
└──────────────────────────────┘
```

## Step-by-step explanation

### 1. Tally form submission

A potential partner completes the Tally partner signup form.

The form should capture contact info, company details, claimed partner type, audience, referral volume, tools, desired role, notes, and consent.

### 2. Vercel webhook

Tally sends a `FORM_RESPONSE` event to:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
```

The webhook endpoint should accept `POST` requests with JSON payloads.

### 3. Signature verification

The webhook verifies that the request came from Tally using:

```text
TALLY_SIGNING_SECRET
```

If the signature is invalid, stop the flow and return an auth/signature error. Do not normalize, classify, store, or notify on invalid payloads.

### 4. Field normalization

The normalizer maps human-readable Tally form labels into internal intake fields.

Example:

```json
{
  "First name": "first_name",
  "Last name": "last_name",
  "Email": "email",
  "Company / brand": "company",
  "Who do you serve?": "audience",
  "Estimated monthly referral volume": "referral_volume_estimate",
  "Anything else we should know?": "notes"
}
```

### 5. Normalized intake

The output of normalization should look like the existing intake schema from Batch 03.

Expected normalized fields include:

- `first_name`
- `last_name`
- `email`
- `phone`
- `company`
- `website`
- `partner_type_claimed`
- `audience`
- `industry`
- `location`
- `funding_experience`
- `current_tools`
- `traffic_or_network_size`
- `referral_volume_estimate`
- `desired_partner_role`
- `notes`
- `source`
- `submitted_at`

### 6. Partner scoring

The scoring logic reviews the normalized intake against the project’s tiering rules.

Suggested scoring dimensions:

- Audience access
- Funding relevance
- Existing trust
- Existing deal flow
- Activation speed
- Compliance risk
- Strategic leverage
- Revenue potential
- Technical ability
- Relationship quality

### 7. Partner classification

The system assigns a final partner type. The claimed type is evidence, not gospel.

Common output classifications:

- `funding_broker`
- `iso`
- `referral_partner`
- `cpa_bookkeeper`
- `small_business_attorney`
- `business_broker`
- `veteran_community_connector`
- `creator_affiliate`
- `fintech_vendor_partner`
- `strategic_partner`
- `unqualified_not_fit`
- `manual_risk_review`

### 8. Onboarding path recommendation

The system recommends one onboarding path:

- `fast_track_revenue_partner`
- `standard_affiliate_partner`
- `referral_only_partner`
- `education_first_partner`
- `strategic_partner_review`
- `nurture_watchlist`
- `reject_manual_risk_review`

### 9. Resource recommendation

The system recommends resources based on partner type and audience.

Examples:

- Broker Follow-Up Machine
- Funding Product Matrix
- Funding Pathfinder
- Partner Command Center access notes
- Referral partner script
- Client funding readiness checklist
- Affiliate swipe copy
- Campaign tracking guidance

### 10. Campaign recommendation

The system recommends a campaign kit or first campaign angle.

Output should include:

- Campaign name
- Campaign type
- Audience
- Offer
- CTA
- Suggested channels
- Copy angle
- Tracking notes

### 11. Storage router

The storage router sends the completed record to the configured destination.

Supported storage modes from prior batches:

- `mock`
- `json`
- `notion`
- `hubspot`
- `google_sheets`

GitHub is source control, not the live partner database. Do not store live partner PII in GitHub.

### 12. Admin / GPT review

After the record is stored or staged, an admin or the Partner Intake OS GPT reviews the output.

Admin review can decide:

- Approve partner
- Fast-track partner
- Request more information
- Route to education-first nurture
- Schedule a strategy call
- Reject or mark as manual risk review

### 13. Future dashboard-ready record

A future Partner Command Center dashboard can display the partner profile, tier, status, next action, onboarding checklist, recommended resources, campaign kit, and risk flags.

Do not build that dashboard in this batch. Batch 10 defines contracts. Batch 11 builds static MVP.

## Input fields

Use these expected form/input fields from the Tally mapping batch:

| Tally field | Internal field | Notes |
|---|---|---|
| First name | `first_name` | Required where possible. |
| Last name | `last_name` | Required where possible. |
| Email | `email` | Normalize lowercase. |
| Phone | `phone` | Preserve or normalize consistently. |
| Company / brand | `company` | Use for display and CRM. |
| Website | `website` | Useful for legitimacy review. |
| Which best describes you? | `partner_type_claimed` | Claimed type only. Final classifier may override. |
| Who do you serve? | `audience` | Key scoring field. |
| What industries do you work with? | `industry` | Helps campaign matching. |
| Location | `location` | Useful for local COIs and events. |
| Do you currently refer business funding deals? | `funding_experience` | Signal, not final truth. |
| Estimated monthly referral volume | `referral_volume_estimate` | Helps score revenue potential. |
| What tools do you use? | `current_tools` | CRM/email/automation readiness. |
| Traffic or network size | `traffic_or_network_size` | Creator/community/COI leverage. |
| Desired partner role | `desired_partner_role` | Affiliate, broker, referral, strategic. |
| Anything else we should know? | `notes` | Source of both opportunity and risk flags. |
| Consent / acknowledgment | `consent_acknowledgment` | Must be captured for follow-up. |

## Output objects

The completed flow should produce these objects or object-like sections:

### Normalized intake

```json
{
  "source": "tally",
  "first_name": "Avery",
  "last_name": "Brooks",
  "email": "avery@example.com",
  "company": "Brooks Capital Advisory",
  "partner_type_claimed": "Funding broker",
  "audience": "SMB owners seeking working capital",
  "referral_volume_estimate": "6-10 per month",
  "desired_partner_role": "Broker partner"
}
```

### Scorecard

```json
{
  "audience_fit_score": 8,
  "trust_score": 7,
  "revenue_potential_score": 8,
  "activation_speed_score": 7,
  "compliance_risk_score": 3,
  "strategic_value_score": 6,
  "overall_score": 78,
  "tier_recommendation": "tier_2",
  "manual_review_required": false
}
```

### Partner profile

```json
{
  "partner_type": "funding_broker",
  "partner_tier": "tier_2",
  "onboarding_path": "fast_track_revenue_partner",
  "risk_level": "low",
  "status": "new_intake",
  "next_action": "send_broker_welcome_and_schedule_activation_call"
}
```

### Resource recommendation

```json
{
  "recommended_resource": "Broker Follow-Up Machine",
  "reason": "Partner already works funding leads and needs follow-up infrastructure.",
  "priority": "high"
}
```

### Campaign recommendation

```json
{
  "campaign_name": "Cash Flow Gap Review",
  "campaign_type": "email_social_referral",
  "audience": "SMB owners with working capital needs",
  "cta": "Check funding readiness",
  "tracking_notes": "Assign partner tracking link before launch."
}
```

## Systems touched

Current or near-term systems:

- Tally
- Vercel API
- Partner Intake OS GPT
- Notion
- HubSpot
- Google Sheets
- GitHub source files

Future systems:

- n8n
- Activepieces
- Partner Command Center dashboard
- Admin review queue
- Partner portal access
- Tracking link builder

## Human review triggers

Require manual review when any of the following appear:

- Low-info submission
- Missing email or unverifiable contact details
- No clear audience
- No consent / acknowledgment
- Purchased lead list claims
- Lead resale language
- Guaranteed approval claims
- Guaranteed funding amount claims
- Fake lender certainty
- Credit repair positioning
- Deceptive urgency
- Invented testimonials
- “Everyone qualifies” language
- Aggressive commission-only framing with no compliance awareness
- Strategic integration request
- Co-branding request
- High referral volume claim without proof
- Partner asks to use their own landing page with unreviewed copy
- Any mention of sensitive borrower data being shared without permission

## Failure points

| Failure point | What happens | Recovery step |
|---|---|---|
| Wrong webhook URL | Tally delivery fails | Correct URL and resend test. |
| Missing Vercel env vars | Function error | Add env vars and redeploy. |
| Invalid signature | Request rejected | Confirm secret matches Tally and Vercel. |
| Field label mismatch | Missing normalized fields | Update `/tally/tally-field-map.json`. |
| Storage connector failure | Record not saved | Retry with `mock` or `json`, inspect connector config. |
| Classification mismatch | Wrong routing | Review scoring rules and sample intakes. |
| High-risk language missed | Unsafe partner could pass | Add risk flag pattern and manual review rule. |
| Slow response | Tally times out | Return `202` fast and move slow work to async/queued future flow. |

## Recovery steps

1. Capture Tally delivery ID and request timestamp.
2. Search Vercel logs by timestamp or request ID.
3. Confirm the webhook reached the correct endpoint.
4. Confirm signature verification result.
5. Confirm normalization result.
6. Confirm classification and risk flags.
7. Confirm storage router selected the expected mode.
8. If storage failed, retry in `mock` mode to isolate the connector issue.
9. Delete test records from live Notion, HubSpot, or Sheets after validation.
10. Add any new edge case to `/tally-setup/tally-sample-test-submissions.md`.

## Future upgrade notes

### Notion

Use Notion as a staging database for partner intake review.

Future fields:

- Partner ID
- Display Name
- Company
- Email
- Partner Type
- Partner Tier
- Onboarding Path
- Risk Level
- Manual Review Required
- Status
- Next Action
- Recommended Resources
- Recommended Campaign
- Source
- Submitted At

### HubSpot

Use HubSpot when partner records need CRM lifecycle movement.

Future mapping:

- Contact record for individual partner
- Company record for partner business
- Deal or pipeline record for partner activation
- Task for admin follow-up
- Custom properties for partner type, tier, risk level, source, and next action

### Google Sheets

Use Sheets for lightweight QA, exports, and operational visibility.

Future tabs:

- Raw Intake Log
- Normalized Records
- Manual Review Queue
- Approved Partners
- Rejected / Risk Review
- Campaign Assignments

### n8n

Use n8n for advanced branching and multi-system routing after the webhook is stable.

Future flows:

- New Tally intake → Vercel → Notion staging → Slack/Gmail alert
- Tier 1 partner → create HubSpot task → notify admin
- High-risk partner → create manual review item → suppress auto-welcome

### Activepieces

Use Activepieces for simpler ops workflows and low-code admin handoffs.

Future flows:

- New intake → Google Sheets row
- Approved partner → send resource pack
- Missing info → send request-more-info email draft

### Dashboard display

Use Batch 10 contracts and Batch 11 static MVP to display:

- Partner snapshot
- Tier and status
- Onboarding path
- Next action
- Scorecard
- Risk flags
- Recommended resources
- Campaign kit
- Admin review notes

Do not connect live dashboard display until the intake record shape is stable. Otherwise you get dashboard confetti over bad data. That is not ops. That is a haunted spreadsheet.
