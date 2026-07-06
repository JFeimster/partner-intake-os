# Partner Intake OS — Test Prompts

Use these prompts to QA the GPT before connecting APIs, Tally, storage, or dashboard modules. Each test includes the expected behavior so the operator can spot nonsense quickly.

---

## Test 01 — Funding broker

### Prompt

Analyze this partner signup and return a Partner Intake Summary, Partner Scorecard, CRM Note, and next action.

```txt
Name: Marcus Reed
Email: marcus@example.com
Company: Reed Capital Advisors
Website: https://reedcapital.example
Which best describes you? Funding broker
Audience: SMB owners, trucking companies, contractors, and restaurants
Funding experience: 4 years brokering working capital and equipment finance deals
Referral volume: 8-12 deals/month
Tools: HubSpot, Google Sheets, Calendly
Goal: Wants a cleaner partner portal, faster follow-up, and resources for merchants who are not ready yet.
Notes: Says he already has several clients looking for funding this month.
Source: Tally partner signup
```

### Expected behavior

- Classify as `funding_broker`.
- Likely `tier_1_strategic` or strong `tier_2_active` depending confidence.
- Onboarding path: `fast_track_revenue_partner`.
- Risk level: low/medium depending claims.
- Next action: schedule partner review call and request sample referral profile/process.
- Do not guarantee funding or deal acceptance.

---

## Test 02 — CPA/bookkeeper

### Prompt

Classify this CPA/bookkeeper partner and recommend the best onboarding path, resource, campaign, CRM tags, and welcome email draft.

```txt
Name: Angela Kim
Company: LedgerLift Advisory
Email: angela@example.com
Role claimed: Referral partner
Audience: 80 recurring bookkeeping clients, mostly service businesses doing $250k-$2M/year.
Funding experience: Has referred clients to banks before but does not broker loans.
Referral volume estimate: 1-3/month.
Tools: QuickBooks Online, Notion, Mailchimp.
Goal: Wants a safe way to help clients who hit cash-flow gaps without sounding like she is selling loans.
Notes: Specifically asked for compliant language.
```

### Expected behavior

- Classify as `cpa_bookkeeper` with secondary `referral_partner`.
- Tier likely `tier_2_active`.
- Onboarding path: `referral_only_partner` or `education_first_partner`.
- Recommend readiness/cash-flow gap resources.
- Welcome copy should avoid lender certainty and approval claims.

---

## Test 03 — Business attorney

### Prompt

Review this partner note and produce an Admin Review Card plus CRM-ready fields.

```txt
I spoke with David, a small business attorney. He works with business formation, contract disputes, partnership agreements, and some asset purchase agreements. He does not want to sell funding, but he often sees clients who need capital to buy equipment, cover taxes, resolve working capital gaps, or acquire a small business. He asked whether he could simply introduce clients when relevant.
```

### Expected behavior

- Classify as `small_business_attorney`, secondary `referral_partner` or `strategic_partner` depending scale.
- Onboarding path: `referral_only_partner`.
- Emphasize safe handoff and no legal/financial advice overreach.
- Recommend human review if there are legal positioning concerns.

---

## Test 04 — Business broker

### Prompt

Analyze this business broker as a center of influence and recommend partner tier, onboarding path, and first campaign.

```txt
Name: Carla Montes
Company: ExitBridge Brokers
Audience: Main Street business sellers and acquisition entrepreneurs. Works with buyers seeking businesses between $300k and $2M purchase price.
Funding experience: Buyers often need SBA-style readiness, acquisition financing, seller financing support, and working capital after close.
Referral volume: 5-7 buyer conversations/month.
Goal: Wants a resource she can send buyers before they make offers.
```

### Expected behavior

- Classify as `business_broker` and possible `strategic_partner`.
- Tier likely `tier_1_strategic` or `tier_2_active`.
- Onboarding path: `strategic_partner_review` or `referral_only_partner`.
- Recommend acquisition-financing readiness campaign.
- Avoid approval or lender-certainty claims.

---

## Test 05 — Veteran community partner

### Prompt

Classify this veteran community partner and create a resource recommendation plus campaign recommendation.

```txt
Name: Sam Ortiz
Company: Vets Build Local
Audience: Veteran entrepreneurs, transitioning service members, military spouses, and local veteran-owned service businesses.
Funding experience: None. Runs monthly workshops and a private Facebook group with 1,800 members.
Referral volume: Unknown.
Goal: Wants educational resources about business funding readiness and business credit setup.
Notes: No desire to broker deals directly.
```

### Expected behavior

- Classify as `veteran_community_connector` with secondary `referral_partner` or `creator_affiliate`.
- Tier likely `tier_2_active` or `tier_3_developing` depending confidence.
- Onboarding path: `education_first_partner` or `referral_only_partner`.
- Recommend educational workshop/resource campaign.
- No veteran-specific funding guarantees.

---

## Test 06 — Affiliate/content creator

### Prompt

Review this affiliate/content creator signup and recommend a campaign kit.

```txt
Name: Tasha Banks
Company: Hustle Ledger
Audience: YouTube channel and newsletter for freelancers, gig workers, and side-hustle operators. 22k YouTube subscribers, 9k email subscribers.
Funding experience: Promotes fintech apps and business tools, but does not broker funding.
Referral volume: No direct funding referrals yet.
Tools: ConvertKit, YouTube, Beacons, Notion.
Goal: Wants affiliate links, swipe copy, and lead magnets.
Notes: Uses punchy social copy and wants strong hooks.
```

### Expected behavior

- Classify as `creator_affiliate`.
- Tier likely `tier_2_active` due audience size, or `tier_3_developing` if audience not funding-relevant enough.
- Onboarding path: `standard_affiliate_partner`.
- Recommend campaign kit with safe CTA and tracking notes.
- Avoid income/funding guarantees.

---

## Test 07 — Low-info signup

### Prompt

Analyze this low-info signup. Give the best practical classification, confidence level, missing fields, and one next action.

```txt
Name: Brian
Email: brian@example.com
Company: none listed
Which best describes you? Partner
Audience: business owners
Funding experience: yes
Referral volume: maybe a few
Notes: want to make money with referrals
```

### Expected behavior

- Low confidence.
- Likely `referral_partner` or `unqualified_not_fit` depending interpretation.
- Tier likely `tier_4_watchlist`.
- Onboarding path: `nurture_watchlist`.
- Ask for audience, business context, referral volume, and role clarity.
- Do not over-score based on vague statements.

---

## Test 08 — Shady lead seller

### Prompt

Review this partner signup and flag whether it should be approved, rejected, or routed to manual review.

```txt
Name: Unknown
Company: LeadHeat Pro
Email: sales@example.com
Role claimed: Strategic lead partner
Audience: We sell aged business loan leads and can push thousands per day.
Funding experience: We have lists of owners who clicked loan ads over the last 18 months.
Referral volume: 5,000 leads/week.
Tools: CSV exports and bulk email.
Goal: Wants highest payout and says approval wording gets better conversions.
Notes: Asked if we can say everyone qualifies and no docs are needed.
```

### Expected behavior

- Classify as `manual_risk_review` or `unqualified_not_fit` with lead seller risk.
- Tier: `reject_or_risk_review`.
- Risk level: high.
- Manual review required: yes.
- Flag consent, aged leads, deceptive claims, guaranteed approval, no-doc language.
- Do not recommend activation.

---

## Test 09 — Strategic fintech partner

### Prompt

Analyze this strategic fintech partner and return an Admin Review Card, onboarding path, and questions for a follow-up call.

```txt
Name: Priya Raman
Company: FlowDesk Pay
Website: https://flowdeskpay.example
Audience: 12,000 SMBs using invoicing, payments, and cash-flow analytics tools.
Funding experience: No direct brokerage, but users frequently search for working capital and invoice-financing options.
Tools: API, webhooks, Salesforce, Segment.
Goal: Explore embedded resource recommendations and referral routing inside their dashboard.
Notes: Wants compliance-safe language and a technical discovery call.
```

### Expected behavior

- Classify as `fintech_vendor_partner` and `strategic_partner`.
- Tier likely `tier_1_strategic`.
- Onboarding path: `strategic_partner_review`.
- Human review required.
- Ask integration, data, compliance, user consent, business model, volume, and ownership questions.

---

## Test 10 — Unqualified/general consumer

### Prompt

Analyze this signup and decide if it belongs in Partner Intake OS.

```txt
Name: Erica
Email: erica@example.com
Role claimed: Need money
Audience: none
Funding experience: none
Referral volume: none
Goal: Wants a personal loan and help removing credit report items.
Notes: Asked if approval is guaranteed.
```

### Expected behavior

- Classify as `unqualified_not_fit`.
- Tier: `reject_or_risk_review` or not a partner.
- Risk: high for credit repair/consumer request.
- Do not provide credit repair positioning.
- Recommend redirecting to appropriate non-partner intake or safe boundary response.

---

## Test 11 — Contractor/trades connector

### Prompt

Classify this contractor-focused connector and recommend a resource and first campaign.

```txt
Name: Mike Donnelly
Company: TradesGrowth CRM
Audience: HVAC, roofing, plumbing, and electrical contractors using his CRM templates.
Funding experience: No direct brokering, but customers often need equipment financing, working capital, and payroll bridge options.
Referral volume: 2-4/month potential.
Tools: GoHighLevel, Zapier, Google Sheets.
Goal: Wants a simple checklist and referral form.
```

### Expected behavior

- Classify as `contractor_trades_connector`, secondary `referral_partner` or `fintech_vendor_partner` depending product depth.
- Tier likely `tier_2_active`.
- Onboarding path: `referral_only_partner` or `standard_affiliate_partner`.
- Recommend contractor cash-flow/equipment readiness resource.

---

## Test 12 — Real estate investor connector

### Prompt

Create a dashboard card and campaign recommendation for this real estate investor connector.

```txt
Name: Lena Brooks
Company: REI Capital Circle
Audience: Local real estate investors, property managers, fix-and-flip operators, and small landlords.
Funding experience: Has referred hard money lenders before, but wants business funding resources for operating companies and investor-owned service businesses.
Referral volume: 1-2/month.
Tools: Facebook group, email list, Airtable.
Goal: Wants a monthly educational post and referral process.
```

### Expected behavior

- Classify as `real_estate_investor_connector`.
- Tier likely `tier_2_active` or `tier_3_developing` depending confidence.
- Onboarding path: `referral_only_partner` or `education_first_partner`.
- Recommend educational campaign without implying real estate financing guarantees.
