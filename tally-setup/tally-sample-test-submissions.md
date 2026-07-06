# Tally Sample Test Submissions

## Purpose

Use these fictional samples to test the Tally partner signup form, webhook delivery, normalization, classification, scoring, routing, and risk handling.

All samples are fake. Do not use real partner PII in docs. The goal is to test the machine before letting live signups into the operating room.

## Expected output fields for every sample

Each test should produce:

- Expected classification
- Expected tier
- Expected onboarding path
- Expected risk level
- Expected next action
- Manual review required: true/false
- Risk flags, if any

## Sample 01 — Funding broker

### Sample profile

- Name: Avery Brooks
- Email: avery.brooks@example.com
- Phone: 202-555-0184
- Company: Brooks Capital Advisory
- Website: https://example.com/brooks-capital
- Location: Washington, DC

### Claimed partner type

Funding broker

### Audience

Small business owners seeking working capital, lines of credit, equipment financing, and short-term cash flow support.

### Referral volume estimate

6–10 referrals per month

### Current tools

HubSpot, Gmail, Google Sheets, Calendly, and a basic lead form.

### Desired partner role

Broker partner with access to better intake structure, follow-up assets, and funding product routing.

### Notes

Has worked with SMB clients for three years. Wants cleaner packaging, compliant follow-up language, and faster routing for docs-ready borrowers.

### Expected classification

`funding_broker`

### Expected tier

`tier_2`

### Expected onboarding path

`fast_track_revenue_partner`

### Expected risk level

`low`

### Expected next action

`send_broker_welcome_pack_and_schedule_activation_call`

### Manual review required

false

### Risk flags

None expected.

---

## Sample 02 — ISO

### Sample profile

- Name: Marco Silva
- Email: marco.silva@example.com
- Phone: 305-555-0142
- Company: Southline Merchant Funding
- Website: https://example.com/southline
- Location: Miami, FL

### Claimed partner type

ISO

### Audience

Restaurants, small retailers, contractors, and service businesses already using merchant processing.

### Referral volume estimate

11–20 referrals per month

### Current tools

Salesforce, RingCentral, Mailchimp, shared Google Drive folder.

### Desired partner role

ISO/referral partner. Wants to route funding-ready businesses and receive partner support.

### Notes

Strong merchant network. Mentions speed but does not claim guaranteed approvals. Wants approved scripts for reps.

### Expected classification

`iso`

### Expected tier

`tier_1` or `tier_2`, depending on verification and relationship quality score

### Expected onboarding path

`strategic_partner_review` if volume is validated; otherwise `fast_track_revenue_partner`

### Expected risk level

`medium`

### Expected next action

`schedule_partner_review_call_and_request_lead_source_details`

### Manual review required

true

### Risk flags

- `high_volume_claim_requires_validation`
- `sales_team_script_review_required`

---

## Sample 03 — CPA/bookkeeper

### Sample profile

- Name: Dana Kim
- Email: dana.kim@example.com
- Phone: 410-555-0171
- Company: LedgerWise Advisory
- Website: https://example.com/ledgerwise
- Location: Baltimore, MD

### Claimed partner type

CPA/bookkeeper

### Audience

Small business clients with bookkeeping cleanup needs, seasonal cash flow swings, tax planning issues, and working capital questions.

### Referral volume estimate

1–3 referrals per month

### Current tools

QuickBooks Online, Gusto, Karbon, Google Workspace.

### Desired partner role

Referral partner. Wants educational resources for clients who ask about funding.

### Notes

Does not want to sell financing directly. Wants a clean referral path and readiness checklist.

### Expected classification

`cpa_bookkeeper`

### Expected tier

`tier_3`

### Expected onboarding path

`education_first_partner`

### Expected risk level

`low`

### Expected next action

`send_referral_partner_resource_pack_and_client_readiness_checklist`

### Manual review required

false

### Risk flags

None expected.

---

## Sample 04 — Small business attorney

### Sample profile

- Name: Priya Nair
- Email: priya.nair@example.com
- Phone: 703-555-0198
- Company: Nair Business Law PLLC
- Website: https://example.com/nair-law
- Location: Arlington, VA

### Claimed partner type

Small business attorney

### Audience

LLC owners, franchise buyers, acquisition entrepreneurs, partnership disputes, and contract-heavy service businesses.

### Referral volume estimate

1–2 referrals per month

### Current tools

Clio, Microsoft 365, Lawmatics.

### Desired partner role

Center-of-influence referral partner with educational resources and clear boundaries.

### Notes

Clients frequently ask about funding for acquisitions, franchise purchases, and working capital. Wants no legal-advice crossover and no pressure-based messaging.

### Expected classification

`small_business_attorney`

### Expected tier

`tier_3`

### Expected onboarding path

`referral_only_partner`

### Expected risk level

`low`

### Expected next action

`send_coi_referral_guide_and_acquisition_readiness_resource`

### Manual review required

false

### Risk flags

None expected.

---

## Sample 05 — Business broker

### Sample profile

- Name: Roland Hayes
- Email: roland.hayes@example.com
- Phone: 312-555-0166
- Company: Main Street Exit Advisors
- Website: https://example.com/main-street-exit
- Location: Chicago, IL

### Claimed partner type

Business broker

### Audience

Main Street business buyers, sellers, searchers, acquisition entrepreneurs, and franchise buyers.

### Referral volume estimate

4–6 referrals per month

### Current tools

DealRoom, HubSpot, Google Workspace, DocuSign.

### Desired partner role

Referral and strategic partner for buyers who need acquisition financing readiness guidance.

### Notes

Wants a funding readiness path for buyers before LOI and a resource for sellers with working capital constraints.

### Expected classification

`business_broker`

### Expected tier

`tier_2`

### Expected onboarding path

`strategic_partner_review`

### Expected risk level

`low`

### Expected next action

`schedule_strategic_partner_call_and_send_acquisition_financing_readiness_pack`

### Manual review required

true

### Risk flags

- `strategic_partner_review`

---

## Sample 06 — Veteran/community connector

### Sample profile

- Name: Marcus Reed
- Email: marcus.reed@example.com
- Phone: 757-555-0139
- Company: Mission Main Street Network
- Website: https://example.com/mission-main-street
- Location: Norfolk, VA

### Claimed partner type

Veteran/community connector

### Audience

Veteran entrepreneurs, military spouses, reservists starting service businesses, and local community founders.

### Referral volume estimate

1–5 referrals per month

### Current tools

Facebook group, MailerLite, Google Forms, local meetup list.

### Desired partner role

Community referral partner. Wants practical education and a simple way to send business owners to a readiness review.

### Notes

Runs local workshops. Wants to avoid hype and keep resources grounded.

### Expected classification

`veteran_community_connector`

### Expected tier

`tier_3`

### Expected onboarding path

`education_first_partner`

### Expected risk level

`low`

### Expected next action

`send_community_partner_resource_pack_and_workshop_cta_copy`

### Manual review required

false

### Risk flags

None expected.

---

## Sample 07 — Creator affiliate

### Sample profile

- Name: Tasha Lane
- Email: tasha.lane@example.com
- Phone: 404-555-0155
- Company: Hustle Stack Media
- Website: https://example.com/hustlestack
- Location: Atlanta, GA

### Claimed partner type

Creator affiliate

### Audience

Gig workers, new LLC owners, side hustlers, e-commerce starters, and small business creators.

### Referral volume estimate

Unknown referral volume; 42,000 TikTok followers and 12,000 email subscribers.

### Current tools

Beehiiv, TikTok, Instagram, Linktree, ConvertKit.

### Desired partner role

Affiliate partner with swipe copy, tracking link, and content ideas.

### Notes

Wants content that explains funding readiness without promising approvals. Interested in lead magnets.

### Expected classification

`creator_affiliate`

### Expected tier

`tier_2` if audience quality is strong; otherwise `tier_3`

### Expected onboarding path

`standard_affiliate_partner`

### Expected risk level

`low`

### Expected next action

`send_affiliate_campaign_kit_and_tracking_link_setup_instructions`

### Manual review required

false

### Risk flags

None expected.

---

## Sample 08 — Strategic fintech/vendor partner

### Sample profile

- Name: Elena Torres
- Email: elena.torres@example.com
- Phone: 646-555-0117
- Company: FlowLedger AI
- Website: https://example.com/flowledger
- Location: New York, NY

### Claimed partner type

Strategic fintech/vendor partner

### Audience

Bookkeepers, fractional CFOs, SMB operators, and agencies using cash flow forecasting tools.

### Referral volume estimate

Potentially 20+ per month through app marketplace and partner newsletter.

### Current tools

Own SaaS dashboard, HubSpot, Segment, Webflow, Zapier.

### Desired partner role

Strategic integration partner. Wants API or workflow-based handoff for funding-readiness leads.

### Notes

Interested in co-marketing, embedded readiness score, and partner marketplace placement.

### Expected classification

`fintech_vendor_partner`

### Expected tier

`tier_1`

### Expected onboarding path

`strategic_partner_review`

### Expected risk level

`medium`

### Expected next action

`schedule_strategic_review_and_request_integration_requirements`

### Manual review required

true

### Risk flags

- `strategic_integration_review`
- `co_marketing_review_required`
- `custom_workflow_requested`

---

## Sample 09 — Low-info signup

### Sample profile

- Name: Jay
- Email: jay.test@example.com
- Phone: not provided
- Company: not provided
- Website: not provided
- Location: not provided

### Claimed partner type

Affiliate

### Audience

“Businesses”

### Referral volume estimate

“Not sure”

### Current tools

None listed

### Desired partner role

“Make money with referrals”

### Notes

“I saw this online and want to join.”

### Expected classification

`unqualified_not_fit` or `low_info_affiliate_candidate`

### Expected tier

`tier_4`

### Expected onboarding path

`nurture_watchlist`

### Expected risk level

`medium`

### Expected next action

`request_more_information_before_approval`

### Manual review required

true

### Risk flags

- `insufficient_information`
- `unclear_audience`
- `unclear_partner_role`

---

## Sample 10 — High-risk/shady lead seller

### Sample profile

- Name: Blake Stone
- Email: blake.stone@example.com
- Phone: 702-555-0191
- Company: LeadStorm Direct
- Website: https://example.com/leadstorm
- Location: Las Vegas, NV

### Claimed partner type

Lead seller / broker / affiliate

### Audience

“Business owners who need money fast.”

### Referral volume estimate

100+ leads per week

### Current tools

Cold email software, call center dialer, scraped lead lists, SMS platform.

### Desired partner role

Wants to send high-volume leads and receive commission. Wants permission to advertise “guaranteed approvals up to $500K.”

### Notes

Says they can generate volume quickly using aged data and purchased lists. Claims “everyone qualifies if the lender knows what they are doing.”

### Expected classification

`manual_risk_review` or `reject`

### Expected tier

`reject`

### Expected onboarding path

`reject_manual_risk_review`

### Expected risk level

`high`

### Expected next action

`reject_or_escalate_to_admin_risk_review`

### Manual review required

true

### Risk flags

- `purchased_leads`
- `scraped_leads`
- `aged_leads`
- `guaranteed_approval_language`
- `guaranteed_funding_amount`
- `everyone_qualifies_language`
- `unclear_consent`
- `high_pressure_sales`
- `compliance_risk`

## Suggested test sequence

Run samples in this order:

1. Low-info signup
2. Funding broker
3. CPA/bookkeeper
4. Business broker
5. Creator affiliate
6. Veteran/community connector
7. Strategic fintech/vendor partner
8. High-risk/shady lead seller
9. ISO
10. Small business attorney

This order validates the edge cases first and then confirms useful partner categories. No need to start with the golden child while the basement is still full of raccoons.

## Expected routing summary

| Sample | Classification | Tier | Path | Risk | Manual review |
|---|---|---:|---|---|---|
| Funding broker | `funding_broker` | `tier_2` | `fast_track_revenue_partner` | low | false |
| ISO | `iso` | `tier_1` or `tier_2` | `strategic_partner_review` or `fast_track_revenue_partner` | medium | true |
| CPA/bookkeeper | `cpa_bookkeeper` | `tier_3` | `education_first_partner` | low | false |
| Small business attorney | `small_business_attorney` | `tier_3` | `referral_only_partner` | low | false |
| Business broker | `business_broker` | `tier_2` | `strategic_partner_review` | low | true |
| Veteran/community connector | `veteran_community_connector` | `tier_3` | `education_first_partner` | low | false |
| Creator affiliate | `creator_affiliate` | `tier_2` or `tier_3` | `standard_affiliate_partner` | low | false |
| Strategic fintech/vendor | `fintech_vendor_partner` | `tier_1` | `strategic_partner_review` | medium | true |
| Low-info signup | `low_info_affiliate_candidate` | `tier_4` | `nurture_watchlist` | medium | true |
| High-risk lead seller | `manual_risk_review` or `reject` | `reject` | `reject_manual_risk_review` | high | true |

## Cleanup note

After testing, delete or clearly archive test records in Notion, HubSpot, Google Sheets, or JSON storage. Do not let fake partners wander into live reporting like unpaid interns with fake mustaches.
