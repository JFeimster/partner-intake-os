# Notion Database Properties

Use these properties for the Partner Intake OS staging and admin review database.

## Property table

| Notion property | Type | Internal schema field | Required | Example value | Notes |
|---|---|---|---:|---|---|
| Partner ID | Text | `partner_id` | Yes | `ptr_20260706_broker_001` | Cross-system key. Do not rely on name/email only. |
| Name | Title | `display_name` | Yes | `Marcus Reed` | Main Notion title property. |
| Email | Email | `email` | Yes | `marcus@example.com` | Use for dedupe with contact records. |
| Phone | Phone | `phone` | Optional | `202-555-0142` | Keep private. |
| Company | Text | `company` | Recommended | `Reed Funding Group` | Match to HubSpot company later. |
| Website | URL | `website` | Optional | `https://example.com` | Useful for legitimacy checks. |
| Partner Type | Select | `partner_type` | Yes | `funding_broker` | Use controlled options. |
| Partner Tier | Select | `partner_tier` | Yes | `tier_2` | Computed recommendation, admin can adjust. |
| Onboarding Path | Select | `onboarding_path` | Yes | `fast_track_revenue_partner` | Drives next steps and resource pack. |
| Primary Audience | Select | `primary_audience` | Recommended | `contractors` | Use one primary segment. |
| Secondary Audiences | Multi-select | `secondary_audiences` | Optional | `real_estate_investors`, `general_smb` | Use for broader partner reach. |
| Risk Level | Select | `risk_level` | Yes | `medium` | `low`, `medium`, `high`. |
| Status | Select | `status` | Yes | `needs_review` | See `status-and-stage-model.md`. |
| Source | Select | `source` | Yes | `tally` | Examples: `tally`, `manual`, `gpt_action`, `import`, `referral`. |
| Submitted At | Date | `submitted_at` | Recommended | `2026-07-06T14:30:00Z` | Original submission timestamp. |
| Score | Number | `score` | Yes | `82` | Overall score, 0–100. |
| Manual Review Required | Checkbox | `manual_review_required` | Yes | `true` | Drives Manual Review view. |
| Risk Flags | Multi-select | `risk_flags` | Optional | `compliance_language`, `lead_quality_unclear` | Do not use vague scary labels without notes. |
| Recommended Resources | Multi-select | `recommended_resources` | Optional | `Funding Product Matrix`, `Broker Follow-Up Machine` | Can later map to resource IDs. |
| Recommended Campaign | Text | `recommended_campaign` | Optional | `Contractor Cash Flow Referral Sprint` | Use campaign catalog name or generated title. |
| Next Action | Select | `next_action` | Yes | `schedule_partner_call` | One immediate action. |
| Owner | Person | `owner` | Optional | `Jason Feimster` | Assign internal reviewer/owner. |
| Notes | Text | `notes` | Optional | `Has existing referral traffic; wants broker track.` | Short plain-English notes. |
| Created At | Created time | `created_at` | System | `2026-07-06T14:31:00Z` | Notion system field. |
| Updated At | Last edited time | `updated_at` | System | `2026-07-06T15:10:00Z` | Notion system field. |
| Last Synced At | Date | `last_synced_at` | Recommended | `2026-07-06T15:12:00Z` | API sync timestamp. |

## Select options

### Partner Type

- `funding_broker`
- `iso`
- `referral_partner`
- `cpa_bookkeeper`
- `small_business_attorney`
- `business_broker`
- `real_estate_investor_connector`
- `contractor_trades_connector`
- `franchise_consultant`
- `veteran_community_connector`
- `creator_affiliate`
- `fintech_vendor_partner`
- `strategic_partner`
- `unqualified_not_fit`

### Partner Tier

- `tier_1`
- `tier_2`
- `tier_3`
- `tier_4`
- `reject`

### Onboarding Path

- `fast_track_revenue_partner`
- `standard_affiliate_partner`
- `referral_only_partner`
- `education_first_partner`
- `strategic_partner_review`
- `nurture_watchlist`
- `reject_manual_risk_review`

### Risk Level

- `low`
- `medium`
- `high`

### Status

- `new`
- `needs_review`
- `missing_info`
- `approved`
- `onboarding`
- `active`
- `watchlist`
- `rejected`
- `archived`

### Source

- `tally`
- `manual`
- `gpt_action`
- `import`
- `referral`
- `dashboard`

### Next Action

- `send_welcome`
- `schedule_partner_call`
- `request_more_info`
- `send_resources`
- `assign_campaign`
- `manual_review`
- `reject`
- `archive`

## Recommended resource names

- `Funding Product Matrix`
- `Broker Follow-Up Machine`
- `Funding Pathfinder`
- `Partner Command Center`
- `Client Funding Readiness Checklist`
- `Referral Partner Script`
- `Affiliate Campaign Kit`
- `Tracking Link Builder`

## Risk flag options

- `missing_contact_info`
- `unclear_audience`
- `low_referral_quality`
- `lead_quality_unclear`
- `compliance_language`
- `guarantee_claims`
- `credit_repair_language`
- `unverified_traffic_claims`
- `possible_consumer_fit`
- `manual_review_required`

## Implementation note

Keep field options boring and consistent. Fancy labels are where CRM data goes to get murdered with glitter.
