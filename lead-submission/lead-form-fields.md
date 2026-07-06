# Lead Form Fields

## Field design rules

Collect enough information to route and review the lead. Do not turn the form into a full loan application. This module is for partner-submitted lead intake, not final underwriting.

Every form should include:

- partner attribution
- business owner contact
- business profile
- funding need
- readiness context
- consent confirmation
- notes

## Partner attribution

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Partner ID | `partner_id` | short answer | yes | Assigned partner identifier. |
| Tracking ID | `tracking_id` | short answer | no | Generated from tracking link builder when available. |
| Referral Source | `referral_source` | dropdown | yes | Partner, affiliate, broker, COI, event, campaign, direct referral. |
| Campaign ID | `campaign_id` | short answer | no | Future Batch 19 tracking link output. |
| Partner Notes About Relationship | `partner_relationship_notes` | long answer | no | How the partner knows the business owner. |

## Business owner contact

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Business Name | `business_name` | short answer | yes | Legal or operating name. |
| Owner First Name | `owner_first_name` | short answer | yes | Primary contact. |
| Owner Last Name | `owner_last_name` | short answer | yes | Primary contact. |
| Owner Email | `owner_email` | email | yes | Primary contact email. |
| Owner Phone | `owner_phone` | phone | yes | Primary contact phone. |
| Website | `website` | website | no | Business website or public profile. |

## Business profile

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Industry | `industry` | dropdown | yes | Use broad category first. |
| Business Location | `location` | short answer | yes | City/state or operating region. |
| Time in Business | `time_in_business` | dropdown | yes | Use ranges. |
| Entity Type | `entity_type` | dropdown | no | LLC, corporation, sole prop, partnership, other. |
| Number of Employees | `employee_count_range` | dropdown | no | Optional readiness context. |

Recommended `time_in_business` options:

- pre_revenue
- less_than_6_months
- 6_to_12_months
- 1_to_2_years
- 2_to_5_years
- 5_plus_years
- unknown

## Funding need

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Requested Amount Range | `requested_amount_range` | dropdown | yes | Range, not exact guarantee. |
| Funding Purpose | `funding_purpose` | multiple choice | yes | Working capital, equipment, inventory, expansion, payroll, acquisition, refinance, emergency cash flow, other. |
| Urgency | `urgency` | dropdown | yes | Low, medium, high, immediate. |
| Desired Timeline | `desired_timeline` | dropdown | no | This is not a promised timeline. |
| Has Existing Financing? | `has_existing_financing` | dropdown | no | Yes, no, unknown. |

Recommended `requested_amount_range` options:

- under_10k
- 10k_to_25k
- 25k_to_50k
- 50k_to_100k
- 100k_to_250k
- 250k_to_500k
- 500k_plus
- unknown

## Revenue and cash-flow context

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Monthly Revenue Range | `monthly_revenue_range` | dropdown | yes | Estimate only. |
| Revenue Trend | `revenue_trend` | dropdown | no | Increasing, stable, seasonal, declining, unknown. |
| Main Cash Flow Gap | `cash_flow_gap` | long answer | no | Operational context. |
| Average Monthly Deposits Known? | `monthly_deposits_known` | checkbox | no | Keep it simple. |

Recommended `monthly_revenue_range` options:

- pre_revenue
- under_5k
- 5k_to_10k
- 10k_to_25k
- 25k_to_50k
- 50k_to_100k
- 100k_to_250k
- 250k_plus
- unknown

## Credit/readiness context

This section must not be positioned as credit repair.

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Business Bank Account Active? | `business_bank_account_active` | dropdown | no | Yes, no, unknown. |
| Bookkeeping Current? | `bookkeeping_current` | dropdown | no | Yes, no, partial, unknown. |
| Estimated Personal Credit Band | `personal_credit_band` | dropdown | no | Optional. Do not require. |
| Has Recent NSF/Overdraft Issues? | `recent_nsf_or_overdrafts` | dropdown | no | Yes, no, unknown. |
| Has Tax Liens/Judgments Known? | `known_liens_or_judgments` | dropdown | no | Yes, no, unknown. |

Recommended credit band options:

- 720_plus
- 680_to_719
- 640_to_679
- 600_to_639
- under_600
- unknown
- prefer_not_to_say

## Consent and acknowledgment

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Consent Confirmed | `consent_confirmed` | checkbox | yes | Must be true before routing. |
| Consent Notes | `consent_notes` | long answer | no | Document what the partner represented. |
| Acknowledgment | `acknowledgment_confirmed` | checkbox | yes | Confirms this is review, not approval. |

Recommended consent language:

> I confirm the business owner gave permission to submit this information for review and understands that submitting a lead does not guarantee approval, funding, terms, rates, or timing.

## Notes

| Field label | Schema field | Type | Required | Notes |
|---|---|---:|---:|---|
| Partner Notes | `notes` | long answer | no | Context, risk flags, quality notes, next action. |
| Missing Information | `missing_information` | long answer | no | Use for review routing. |
| Internal Admin Notes | `admin_notes` | long answer | no | Admin-only. Do not show partner by default. |
