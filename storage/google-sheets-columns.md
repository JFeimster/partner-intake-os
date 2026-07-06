# Google Sheets Columns

Use this as the recommended Google Sheets layout for Partner Intake OS review/export workflows.

## Workbook tabs

Create two tabs first:

1. `Partners`
2. `Events`

Add more later only when the workflow earns it.

## Partners tab columns

| Column | Field | Type | Example | Notes |
|---:|---|---|---|---|
| A | partner_id | string | ptr_danafields_20260706 | Stable key |
| B | display_name | string | Dana Fields | Partner/contact name |
| C | company | string | Field Ledger Advisory | Company/brand |
| D | email | email | dana@fieldledger.co | Primary email |
| E | phone | string | +1 202-555-0183 | Phone |
| F | website | url | https://fieldledger.co | Website/profile |
| G | partner_type | enum | cpa_bookkeeper | Canonical partner type |
| H | partner_tier | enum | tier_2 | tier_1, tier_2, tier_3, tier_4, reject_risk |
| I | onboarding_path | enum | referral_only_partner | Canonical onboarding path |
| J | primary_audience | string | Contractors and service businesses | Main market |
| K | secondary_audiences | string | local_smb; tax_planning_clients | Semicolon-delimited |
| L | risk_level | enum | low | low, medium, high, critical |
| M | status | enum | needs_review | Lifecycle status |
| N | tags | string | tier_2; referral_only | Semicolon-delimited |
| O | recommended_resources | string | Funding Product Matrix; Referral partner scripts | Semicolon-delimited |
| P | recommended_campaigns | string | Cash Flow Gap Referral Script | Semicolon-delimited |
| Q | next_action | string | Send onboarding pack | Action owner can execute |
| R | notes | string | Strong trust channel | Avoid guarantee language |
| S | created_at | datetime | 2026-07-06T10:20:00-04:00 | ISO timestamp |
| T | updated_at | datetime | 2026-07-06T10:20:00-04:00 | ISO timestamp |

## Events tab columns

| Column | Field | Type | Example | Notes |
|---:|---|---|---|---|
| A | event_id | string | evt_20260706_001 | Stable event key |
| B | partner_id | string | ptr_danafields_20260706 | Related partner |
| C | event_type | enum | classification_completed | CRM event type |
| D | event_source | enum | api | gpt, tally, api, hubspot, notion, google_sheets, admin, automation |
| E | summary | string | Partner classified as CPA/bookkeeper | Human-readable event summary |
| F | next_action | string | Schedule fit call | Follow-up action |
| G | owner | string | Jason | Person/system responsible |
| H | status | enum | closed | open, closed, skipped, needs_review |
| I | created_at | datetime | 2026-07-06T10:21:00-04:00 | ISO timestamp |
| J | created_by | string | partner-intake-api | Actor/source |
| K | metadata | json string | {"risk_flags":[]} | Keep compact |

## Recommended filters/views

| View | Filter |
|---|---|
| Needs Review | status = needs_review |
| Tier 1 / Strategic | partner_tier = tier_1 OR onboarding_path = strategic_partner_review |
| High Risk | risk_level = high OR risk_level = critical |
| Broker / ISO | partner_type = funding_broker OR partner_type = iso |
| Referral COI | partner_type contains cpa_bookkeeper, small_business_attorney, business_broker, veteran_community_connector |
| Recently Updated | updated_at within last 14 days |

## Implementation note

The Batch 06 Google Sheets connector maps partner records into rows but does not perform live external writes by default. Use Sheets as a visibility layer or automation handoff, not as the long-term source of truth if partner volume grows.
