# HubSpot Property Setup

## Purpose

Create consistent HubSpot custom properties so Partner Intake OS can sync partner records without inventing a new field name every time the robot gets excited.

The goal is simple: one clean set of fields mapped to Partner Intake OS outputs.

## Naming conventions

Use readable labels for humans and stable internal names for API sync.

Recommended internal name pattern:

```text
partner_<field_name>
```

Examples:

```text
partner_id
partner_type
partner_tier
partner_status
partner_score
```

## Required partner properties

### Contact properties

| Property label | Internal name | Object | Field type | Options/enums | Internal schema mapping | Example value | Required | Notes |
|---|---|---|---|---|---|---|---|---|
| Partner ID | `partner_id` | Contact | Single-line text | N/A | `partner_id` | `ptnr_20260706_broker_001` | Required | Cross-system key. Do not change manually unless repairing a duplicate. |
| Partner Type | `partner_type` | Contact | Dropdown select | `funding_broker`, `iso`, `referral_partner`, `cpa_bookkeeper`, `business_attorney`, `business_broker`, `veteran_community_connector`, `creator_affiliate`, `fintech_vendor_partner`, `strategic_partner`, `unqualified_not_fit` | `partner_type` | `funding_broker` | Required | Main classification. |
| Partner Tier | `partner_tier` | Contact | Dropdown select | `tier_1`, `tier_2`, `tier_3`, `tier_4`, `reject` | `partner_tier` | `tier_2` | Required | Revenue/activation priority. |
| Onboarding Path | `onboarding_path` | Contact | Dropdown select | `fast_track_revenue_partner`, `standard_affiliate_partner`, `referral_only_partner`, `education_first_partner`, `strategic_partner_review`, `nurture_watchlist`, `reject_manual_risk_review` | `onboarding_path` | `standard_affiliate_partner` | Required | Drives tasks/resources. |
| Primary Audience | `primary_audience` | Contact | Dropdown select | `general_smb`, `contractors_trades`, `ecommerce`, `real_estate_investors`, `veterans`, `brokers_isos`, `professional_services`, `franchise_buyers`, `acquisition_entrepreneurs`, `unknown` | `primary_audience` | `contractors_trades` | Optional | Use `unknown` if unclear. |
| Risk Level | `risk_level` | Contact | Dropdown select | `low`, `medium`, `high` | `risk_level` | `medium` | Required | High risk requires review. |
| Partner Status | `partner_status` | Contact | Dropdown select | `new`, `needs_review`, `missing_info`, `approved`, `onboarding`, `active`, `watchlist`, `rejected`, `archived` | `status` | `needs_review` | Required | Keep aligned with pipeline stage. |
| Source | `partner_source` | Contact | Dropdown select | `tally`, `manual`, `gpt_action`, `import`, `referral`, `event`, `unknown` | `source` | `tally` | Optional | Intake origin. |
| Score | `partner_score` | Contact | Number | 0-100 | `score` or `scorecard.overall_score` | `78` | Optional | Overall score. |
| Manual Review Required | `manual_review_required` | Contact | Boolean | true/false | `manual_review_required` | `true` | Required | Controls review queue. |
| Risk Flags | `risk_flags` | Contact | Multi-line text | N/A | `risk_flags` | `claims guaranteed approvals; no consent proof` | Optional | Use concise list. Avoid raw sensitive detail. |
| Recommended Resources | `recommended_resources` | Contact | Multi-line text | N/A | `recommended_resources` | `Funding Product Matrix; Referral Partner Script` | Optional | Can be converted to association/object later. |
| Recommended Campaign | `recommended_campaign` | Contact | Single-line text | N/A | `recommended_campaign` | `Contractor cash-flow readiness campaign` | Optional | Current top campaign recommendation. |
| Next Action | `next_action` | Contact | Single-line text | N/A | `next_action` | `Schedule partner onboarding call` | Required | Human-readable next action. |
| Last Partner Intake Sync | `last_partner_intake_sync` | Contact | Date/time | N/A | `last_synced_at` | `2026-07-06T14:30:00Z` | Optional | Sync health signal. |

### Company properties

| Property label | Internal name | Object | Field type | Options/enums | Internal schema mapping | Example value | Required | Notes |
|---|---|---|---|---|---|---|---|---|
| Partner ID | `partner_id` | Company | Single-line text | N/A | `partner_id` | `ptnr_20260706_cpa_002` | Optional | Use when company is partner-specific. |
| Partner Company Type | `partner_company_type` | Company | Dropdown select | `brokerage`, `accounting_firm`, `law_firm`, `business_brokerage`, `community_org`, `media_brand`, `fintech_vendor`, `consulting_firm`, `other` | derived from `partner_type` | `accounting_firm` | Optional | Helps company segmentation. |
| Primary Audience | `primary_audience` | Company | Dropdown select | Same as contact | `primary_audience` | `general_smb` | Optional | Useful for campaigns. |
| Partner Status | `partner_status` | Company | Dropdown select | Same as contact | `status` | `approved` | Optional | Mirrors active partner state. |
| Partner Source | `partner_source` | Company | Dropdown select | Same as contact | `source` | `tally` | Optional | Acquisition source. |
| Last Partner Intake Sync | `last_partner_intake_sync` | Company | Date/time | N/A | `last_synced_at` | `2026-07-06T14:30:00Z` | Optional | Sync signal. |

### Deal properties

| Property label | Internal name | Object | Field type | Options/enums | Internal schema mapping | Example value | Required | Notes |
|---|---|---|---|---|---|---|---|---|
| Partner ID | `partner_id` | Deal | Single-line text | N/A | `partner_id` | `ptnr_20260706_broker_001` | Required | Deal-level cross-system key. |
| Partner Type | `partner_type` | Deal | Dropdown select | Same as contact | `partner_type` | `funding_broker` | Required | Keep aligned. |
| Partner Tier | `partner_tier` | Deal | Dropdown select | Same as contact | `partner_tier` | `tier_1` | Required | Used for priority. |
| Onboarding Path | `onboarding_path` | Deal | Dropdown select | Same as contact | `onboarding_path` | `fast_track_revenue_partner` | Required | Drives onboarding stage. |
| Risk Level | `risk_level` | Deal | Dropdown select | `low`, `medium`, `high` | `risk_level` | `low` | Required | Review routing. |
| Partner Status | `partner_status` | Deal | Dropdown select | Same as contact | `status` | `onboarding` | Required | Should align to deal stage. |
| Score | `partner_score` | Deal | Number | 0-100 | `scorecard.overall_score` | `91` | Optional | Priority score. |
| Manual Review Required | `manual_review_required` | Deal | Boolean | true/false | `manual_review_required` | `false` | Required | Must be reviewed before activation if true. |
| Risk Flags | `risk_flags` | Deal | Multi-line text | N/A | `risk_flags` | `none` | Optional | Summarize only. |
| Recommended Resources | `recommended_resources` | Deal | Multi-line text | N/A | `recommended_resources` | `Broker onboarding kit; Funding Product Matrix` | Optional | Use as onboarding notes. |
| Recommended Campaign | `recommended_campaign` | Deal | Single-line text | N/A | `recommended_campaign` | `Broker missing-docs revival campaign` | Optional | Campaign assignment. |
| Next Action | `next_action` | Deal | Single-line text | N/A | `next_action` | `Approve and send onboarding packet` | Required | Admin next action. |
| Last Partner Intake Sync | `last_partner_intake_sync` | Deal | Date/time | N/A | `last_synced_at` | `2026-07-06T14:30:00Z` | Optional | Sync signal. |

## Optional properties

| Property label | Internal name | Object | Field type | Example value | Notes |
|---|---|---|---|---|---|
| Claimed Partner Type | `partner_type_claimed` | Contact/Deal | Single-line text | `I am a broker` | Preserve original claim separately from classification. |
| Referral Volume Estimate | `referral_volume_estimate` | Contact/Deal | Dropdown select | `5-10 per month` | Useful for tiering. |
| Current Tools | `current_tools` | Contact/Deal | Multi-line text | `HubSpot, Tally, Google Sheets` | Activation readiness. |
| Desired Partner Role | `desired_partner_role` | Contact/Deal | Dropdown select | `referral_partner` | Useful for onboarding path. |
| Traffic or Network Size | `traffic_or_network_size` | Contact/Deal | Single-line text | `20k email list` | Creator/COI evaluation. |
| Funding Experience | `funding_experience` | Contact/Deal | Dropdown select | `experienced`, `some`, `none`, `unknown` | Risk and onboarding signal. |

## Task/activity notes

HubSpot tasks and notes do not need every custom property. Use a consistent note format instead.

Recommended activity note heading:

```text
Partner Intake OS Review
```

Recommended note fields:

```text
Partner ID:
Classification:
Tier:
Score:
Risk Level:
Risk Flags:
Recommended Onboarding:
Recommended Resources:
Recommended Campaign:
Next Action:
Reviewer:
Source:
```

## Property creation checklist

- [ ] Create contact properties.
- [ ] Create company properties.
- [ ] Create deal properties.
- [ ] Confirm internal names are exact.
- [ ] Confirm enum values match schemas.
- [ ] Confirm required fields are populated during test sync.
- [ ] Confirm boolean fields receive true/false, not text.
- [ ] Confirm score is numeric.
- [ ] Confirm multi-line fields are concise and safe.
- [ ] Confirm no secrets or private keys are stored in HubSpot.

## Compliance guardrail

Do not use HubSpot properties or notes to claim guaranteed approvals, guaranteed funding, guaranteed lender matches, credit repair outcomes, or fabricated urgency. Use readiness-based language.
