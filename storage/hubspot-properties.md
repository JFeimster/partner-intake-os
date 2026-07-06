# HubSpot Properties

Use this as the recommended HubSpot property and pipeline setup reference for Partner Intake OS.

## Object strategy

Use HubSpot like this:

| HubSpot object | Purpose |
|---|---|
| Contact | Primary partner/person record |
| Company | Partner company, agency, firm, or organization |
| Deal | Partner onboarding or revenue-partnership opportunity |
| Task | Next action, review, onboarding, follow-up |
| Note / Timeline event | Classification events and admin review history |

## Contact properties

| Internal name | Label | Type | Example | Notes |
|---|---|---:|---|---|
| partner_id | Partner ID | Single-line text | ptr_danafields_20260706 | Stable internal key |
| partner_type | Partner Type | Dropdown select | cpa_bookkeeper | Use canonical enum |
| partner_tier | Partner Tier | Dropdown select | tier_2 | tier_1 through reject_risk |
| onboarding_path | Onboarding Path | Dropdown select | referral_only_partner | Canonical path |
| primary_audience | Primary Audience | Multi-line text | Contractors and service businesses | Main market served |
| secondary_audiences | Secondary Audiences | Multi-line text | local_smb; tax_planning_clients | Semicolon-delimited |
| risk_level | Risk Level | Dropdown select | low | low, medium, high, critical |
| partner_status | Partner Status | Dropdown select | needs_review | Lifecycle status |
| partner_tags | Partner Tags | Multi-line text | tier_2; referral_only | Simple semicolon list |
| recommended_resources | Recommended Resources | Multi-line text | Funding Product Matrix; Referral partner scripts | Resource routing |
| recommended_campaigns | Recommended Campaigns | Multi-line text | Cash Flow Gap Referral Script | Campaign routing |
| next_action | Next Action | Multi-line text | Send onboarding pack | Owner-friendly next step |
| partner_notes | Partner Notes | Multi-line text | Strong trust channel | No guarantee language |
| partner_created_at | Partner Created At | Date picker | 2026-07-06 | Optional mirror |
| partner_updated_at | Partner Updated At | Date picker | 2026-07-06 | Optional mirror |

## Company properties

| Internal name | Label | Type | Example | Notes |
|---|---|---:|---|---|
| partner_company_type | Partner Company Type | Dropdown select | accounting_firm | Optional normalized company category |
| partner_primary_audience | Partner Primary Audience | Multi-line text | Contractor clients | Roll up from contact/deal |
| partner_program_status | Partner Program Status | Dropdown select | needs_review | Useful for company-level reporting |
| partner_source | Partner Source | Dropdown select | tally | tally, manual, gpt, hubspot, notion, google_sheets, import, other |

## Deal properties

| Internal name | Label | Type | Example | Notes |
|---|---|---:|---|---|
| partner_id | Partner ID | Single-line text | ptr_danafields_20260706 | Same stable ID |
| partner_type | Partner Type | Dropdown select | cpa_bookkeeper | Reporting dimension |
| partner_tier | Partner Tier | Dropdown select | tier_2 | Priority dimension |
| onboarding_path | Onboarding Path | Dropdown select | referral_only_partner | Pipeline logic |
| risk_level | Risk Level | Dropdown select | low | Review logic |
| partner_status | Partner Status | Dropdown select | needs_review | Lifecycle state |
| next_action | Next Action | Multi-line text | Schedule fit call | Task creation source |

## Suggested partner onboarding pipeline

| Stage | Meaning |
|---|---|
| Intake Received | Submission captured from Tally/manual/GPT |
| Needs Review | Requires admin review or missing info |
| Fit Confirmed | Partner appears viable |
| Onboarding Started | Resources/checklist assigned |
| Active Partner | Approved and ready to submit/referral/promote |
| Nurture / Watchlist | Not ready, but not rejected |
| Rejected / Risk | Declined or high-risk |

## Task templates

| Task | Trigger |
|---|---|
| Review new partner intake | Every new Tally intake |
| Schedule fit call | tier_1 or strategic_partner_review |
| Send referral resource pack | referral_only_partner |
| Send broker onboarding checklist | funding_broker or iso |
| Compliance review | risk_level high or critical |

## Implementation note

The Batch 06 HubSpot connector maps partner records into Contact and Deal property payloads, but it does not perform live external writes by default. That is deliberate. Build the CRM properties first, then turn on writes after testing.
