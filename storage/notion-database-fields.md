# Notion Database Fields

Use this as the recommended Notion partner staging database spec.

## Database name

`Partner Intake OS — Partner Records`

## Core properties

| Property | Type | Required | Example | Notes |
|---|---:|---:|---|---|
| Name | Title | Yes | Dana Fields | Partner display name |
| Partner ID | Rich text | Yes | ptr_danafields_20260706 | Stable internal ID |
| Company | Rich text | No | Field Ledger Advisory | Company, agency, brand, or organization |
| Email | Email | Yes | dana@fieldledger.co | Primary partner email |
| Phone | Phone | No | +1 202-555-0183 | Partner phone |
| Website | URL | No | https://fieldledger.co | Website or profile URL |
| Partner Type | Select | Yes | cpa_bookkeeper | Use canonical enum values |
| Partner Tier | Select | Yes | tier_2 | tier_1, tier_2, tier_3, tier_4, reject_risk |
| Onboarding Path | Select | Yes | referral_only_partner | Canonical onboarding enum |
| Primary Audience | Rich text | Yes | Contractors and service businesses | Main reachable audience |
| Secondary Audiences | Multi-select | No | local_smb, tax_planning_clients | Optional verticals |
| Risk Level | Select | Yes | low | low, medium, high, critical |
| Status | Select | Yes | needs_review | new, needs_review, approved, active, nurture, watchlist, rejected, inactive |
| Tags | Multi-select | Yes | tier_2, referral_only | CRM-ready tags |
| Recommended Resources | Rich text | Yes | Funding Product Matrix; Referral partner scripts | Can later become relation |
| Recommended Campaigns | Rich text | Yes | Cash Flow Gap Referral Script | Can later become relation |
| Next Action | Rich text | Yes | Send referral-only onboarding pack | Operational next move |
| Notes | Rich text | No | Strong trust channel | Keep notes safe and non-guaranteed |
| Created At | Date | Yes | 2026-07-06T10:20:00-04:00 | Creation timestamp |
| Updated At | Date | Yes | 2026-07-06T10:20:00-04:00 | Last update timestamp |

## Recommended select options

### Partner Type

- funding_broker
- iso
- referral_partner
- cpa_bookkeeper
- small_business_attorney
- business_broker
- real_estate_investor_connector
- contractor_trades_connector
- franchise_consultant
- veteran_community_connector
- creator_affiliate
- fintech_vendor_partner
- strategic_partner
- unqualified_not_fit

### Partner Tier

- tier_1
- tier_2
- tier_3
- tier_4
- reject_risk

### Onboarding Path

- fast_track_revenue_partner
- standard_affiliate_partner
- referral_only_partner
- education_first_partner
- strategic_partner_review
- nurture_watchlist
- reject_manual_risk_review

### Risk Level

- low
- medium
- high
- critical

### Status

- new
- needs_review
- approved
- active
- nurture
- watchlist
- rejected
- inactive

## Optional related databases

Add these later when Partner Intake OS grows teeth:

| Database | Purpose |
|---|---|
| Partner Events | Activity log, reviews, recommendations, approvals |
| Partner Resources | Resource catalog attached to partner profiles |
| Partner Campaigns | Campaign kits, CTAs, tracking notes, statuses |
| Onboarding Tasks | First 24 hours, first 7 days, first 30 days |
| Admin Review Queue | Manual review, risk flags, decision notes |

## Implementation note

The Batch 06 Notion connector maps partner records into Notion-style property objects but does not perform live external writes by default. Keep it that way until the Notion database exists and the fields above are created.
