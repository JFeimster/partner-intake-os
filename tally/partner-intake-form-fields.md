# Tally Partner Intake Form Fields

Purpose: define the recommended Tally intake form for Partner Intake OS so raw partner signups can be mapped into the normalized `/schemas/intake.schema.json` shape created in Batch 03.

This file is a form specification, not API code. The actual webhook receiver is created in the API batch.

## Form configuration

Recommended form name: `Moonshine Capital Partner Intake`

Recommended webhook event: `FORM_RESPONSE`

Recommended success/thank-you message:

> Thanks for your interest in partnering with Moonshine Capital. We review partner fit, audience alignment, and next steps before sending onboarding resources. No funding outcome is guaranteed, and partner resources are intended for educational and operational use.

## Field naming rules

- Keep Tally labels human-readable.
- Map each label to a stable internal field in `tally-field-map.json`.
- Do not rename internal fields casually once submissions are live.
- Use dropdowns/multiple-choice where possible so classification has fewer mystery-meat answers.
- Keep funding language educational and readiness-based. No approval guarantees, no “everyone qualifies,” no credit repair framing.

## Contact info

| Tally label | Internal field | Tally field type | Required | Recommended validation / options | Notes |
|---|---:|---|---:|---|---|
| First name | `first_name` | Short answer | Yes | 1–80 characters | Primary contact first name. |
| Last name | `last_name` | Short answer | Yes | 1–80 characters | Primary contact last name. |
| Email | `email` | Email | Yes | Valid email | Main contact and future partner login/contact field. |
| Phone | `phone` | Phone | No | US or international phone | Useful for high-fit or manual-review follow-up. |

## Business / brand info

| Tally label | Internal field | Tally field type | Required | Recommended validation / options | Notes |
|---|---:|---|---:|---|---|
| Company / brand | `company` | Short answer | No | Max 160 characters | Company, agency, creator brand, advisory firm, or organization. |
| Website or profile URL | `website` | Website | No | URL | Website, LinkedIn, community page, landing page, or relevant public profile. |
| Primary location / market | `location` | Short answer | No | City, state, region, or national | Use for regional COIs, veteran orgs, real estate investors, and local referral channels. |

## Partner type

| Tally label | Internal field | Tally field type | Required | Recommended options | Notes |
|---|---:|---|---:|---|---|
| Which best describes you? | `partner_type_claimed` | Dropdown | Yes | Funding broker; ISO; Referral partner; CPA / bookkeeper; Small business attorney; Business broker; Real estate investor connector; Contractor / trades connector; Franchise consultant; Veteran community connector; Creator / affiliate; Fintech / vendor partner; Strategic partner; Other; Not sure yet | Maps to stable enum values in `tally-field-map.json`. Claimed type is not final classification. |
| Are you applying as an individual, company, or organization? | `applicant_entity_type` | Multiple choice | No | Individual; Company / agency; Nonprofit / community org; Vendor / platform; Other | Helpful metadata. Not part of normalized intake schema unless stored in notes/metadata later. |

## Audience

| Tally label | Internal field | Tally field type | Required | Recommended validation / options | Notes |
|---|---:|---|---:|---|---|
| Who do you serve? | `audience` | Long answer | Yes | Max 500 characters | Describe the business owners, clients, community, or audience they can reach. |
| What industries do you usually work with? | `industry` | Short answer | No | Max 160 characters | Examples: contractors, trucking, ecommerce, franchises, real estate investors, professional services. |
| Approximate audience, client, or network size | `traffic_or_network_size` | Multiple choice | No | Under 100; 100–500; 501–2,500; 2,501–10,000; 10,001+; Not sure | Use ranges instead of fake precision. |

## Referral / funding experience

| Tally label | Internal field | Tally field type | Required | Recommended options | Notes |
|---|---:|---|---:|---|---|
| Do you currently refer business funding deals? | `currently_refers_funding` | Multiple choice | No | Yes, regularly; Sometimes; Rarely; No, but interested; Not applicable | Mapping rule can append this to `funding_experience`. |
| Describe your funding, finance, or referral experience | `funding_experience` | Long answer | No | Max 1,000 characters | Look for existing deal flow, trust, and safe handoff habits. |
| Estimated monthly referral volume | `referral_volume_estimate` | Multiple choice | No | 0; 1–2; 3–5; 6–10; 11–25; 26+; Not sure | Do not treat claimed volume as verified. |
| How do you currently send or manage referrals? | `referral_process` | Long answer | No | Max 1,000 characters | Useful for onboarding and future workflow design. |

## Tools and systems

| Tally label | Internal field | Tally field type | Required | Recommended options | Notes |
|---|---:|---|---:|---|---|
| What tools do you currently use? | `current_tools` | Checkbox | No | HubSpot; GoHighLevel; Salesforce; Notion; Google Sheets; Airtable; Zapier; n8n; Activepieces; Mailchimp; ConvertKit; Calendly; Slack; Other; None | Maps to array of strings. |
| If you selected Other tools, list them here | `current_tools_other` | Short answer | No | Max 300 characters | Mapping rule can append to `current_tools` or `notes`. |

## Goals

| Tally label | Internal field | Tally field type | Required | Recommended options | Notes |
|---|---:|---|---:|---|---|
| What partner role are you most interested in? | `desired_partner_role` | Multiple choice | Yes | Affiliate partner; Referral partner; Broker / funding advisor; Strategic channel partner; Education / community partner; Vendor / integration partner; Not sure yet | Helps route onboarding path. |
| What would make this partnership successful for you? | `success_goal` | Long answer | No | Max 1,000 characters | Append to notes until a later schema stores goals directly. |
| How quickly are you hoping to launch? | `launch_timeline` | Multiple choice | No | Immediately; This week; This month; Next quarter; Still exploring | Helps activation speed scoring later. |

## Notes

| Tally label | Internal field | Tally field type | Required | Recommended validation / options | Notes |
|---|---:|---|---:|---|---|
| Anything else we should know? | `notes` | Long answer | No | Max 3,000 characters | Preserve useful context. Flag risky claims manually. |
| Best next step | `preferred_next_step` | Multiple choice | No | Send resources; Schedule intro call; Review my audience fit; Help me launch a campaign; Not sure | Can drive `next_action` after classification. |

## Consent / acknowledgment

| Tally label | Internal field | Tally field type | Required | Recommended text / options | Notes |
|---|---:|---|---:|---|---|
| Partner acknowledgment | `partner_acknowledgment` | Checkbox | Yes | “I understand that Moonshine Capital reviews partner fit and does not guarantee funding approvals, funding amounts, lender matches, business credit results, or partner revenue.” | Keep this. It is the seatbelt before the go-fast button. |
| Contact permission | `contact_permission` | Checkbox | Yes | “I agree to be contacted about partner onboarding, resources, and next steps.” | Useful for follow-up and CRM compliance. |

## Internal mapping target

The normalized intake object should populate these Batch 03 fields:

```json
{
  "first_name": "",
  "last_name": "",
  "email": "",
  "phone": null,
  "company": null,
  "website": null,
  "partner_type_claimed": "unknown",
  "audience": null,
  "industry": null,
  "location": null,
  "funding_experience": null,
  "current_tools": [],
  "traffic_or_network_size": null,
  "referral_volume_estimate": null,
  "desired_partner_role": null,
  "notes": null,
  "source": "tally",
  "submitted_at": ""
}
```

## Fields intentionally not normalized yet

These fields are useful, but should remain in raw payload, metadata, or notes until later batches define storage contracts:

- `applicant_entity_type`
- `currently_refers_funding`
- `referral_process`
- `current_tools_other`
- `success_goal`
- `launch_timeline`
- `preferred_next_step`
- `partner_acknowledgment`
- `contact_permission`

Do not throw them away. Store them in raw payload and/or append relevant context to `notes` during normalization.
