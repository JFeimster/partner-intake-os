# GPT Preview Test Plan

Use this plan before releasing Partner Intake OS internally.

## Test method

Run each test in GPT Preview.

For every test, check:

- classification accuracy
- tier recommendation
- onboarding path
- risk flags
- missing info handling
- CRM-ready output
- dashboard-ready JSON stability
- safe funding language
- no credit repair framing
- no guaranteed approvals
- no invented social proof
- no fake lender certainty

## Pass / fail scoring

Use:

```txt
Pass: output is usable without revision
Pass with edits: output is structurally correct but needs copy or routing polish
Fail: output is unsafe, wrong, incomplete, or structurally broken
```

## Test 1 — Funding broker

Prompt:

```txt
Analyze this partner signup and return:
1. Partner Intake Summary
2. Scorecard
3. Normalized partner profile JSON
4. CRM note
5. Next action

Signup:
Name: Marcus Reed
Email: marcus@example.com
Company: Reed Funding Advisors
Website: https://example.com
Partner type claimed: funding broker
Audience: restaurants, contractors, and retail SMBs
Funding experience: 4 years, sends MCA and LOC referrals
Current tools: HubSpot, Gmail, Calendly
Referral volume: 6-10 per month
Desired role: revenue partner
Notes: Wants faster follow-up and campaign assets.
Source: manual
```

Expected:

- partner_type: `funding_broker`
- likely tier: `tier_1` or `tier_2`
- onboarding path: `fast_track_revenue_partner` or `standard_affiliate_partner`
- recommend Broker Follow-Up Machine and Funding Product Matrix
- no lender certainty claims

## Test 2 — CPA/bookkeeper referral partner

Prompt:

```txt
Classify this partner and recommend onboarding:

Name: Dana Brooks
Company: Books & Backoffice Co.
Partner type claimed: CPA/bookkeeper
Audience: contractors and service businesses
Funding experience: clients ask about cash-flow gaps but Dana does not broker deals
Referral volume: 2-5 per month
Current tools: QuickBooks, Notion
Desired role: referral-only partner
Notes: Wants educational resources for clients.
```

Expected:

- partner_type: `cpa_bookkeeper`
- onboarding_path: `referral_only_partner` or `education_first_partner`
- risk: low/medium
- recommend readiness checklist, referral scripts, Funding Product Matrix
- next action: send resource pack or schedule partner orientation

## Test 3 — Small business attorney

Prompt:

```txt
Review this center-of-influence partner:

Name: Priya Shah
Company: Shah Business Law
Partner type claimed: small business attorney
Audience: acquisition entrepreneurs and SMB owners
Funding experience: refers clients to SBA lenders and advisors but does not package deals
Referral volume: 1-3 per month
Desired role: strategic referral partner
Notes: Strong trust but wants compliant language before referring.
```

Expected:

- partner_type: `small_business_attorney`
- tier: `tier_1` or `tier_2`
- onboarding_path: `strategic_partner_review` or `referral_only_partner`
- compliance-safe positioning emphasized
- manual review may be true for strategic alignment

## Test 4 — Business broker

Prompt:

```txt
Turn this partner note into CRM-ready fields and a campaign recommendation:

Luis works with lower-middle-market business owners and buyers. He closes 4-6 business sale transactions per year and often has buyers who need acquisition financing readiness guidance. He is not a lender and does not want to handle funding paperwork. He wants a simple referral path.
```

Expected:

- partner_type: `business_broker`
- audience: acquisition entrepreneurs / business buyers
- onboarding_path: `referral_only_partner` or `strategic_partner_review`
- campaign: acquisition readiness or buyer financing readiness
- CTA: readiness review, not guaranteed financing

## Test 5 — Veteran community connector

Prompt:

```txt
Analyze this intake:

Name: Robert Mills
Company: Veteran Builder Network
Partner type claimed: veteran community connector
Audience: veteran founders, contractors, and franchise buyers
Funding experience: no direct funding experience
Referral volume: unknown
Desired role: community partner
Notes: Runs monthly local meetups and wants educational workshops.
```

Expected:

- partner_type: `veteran_community_connector`
- tier: `tier_2` or `tier_3`
- onboarding_path: `education_first_partner`
- recommend workshop, readiness checklist, Partner Command Center
- request missing referral volume and audience size

## Test 6 — Creator affiliate

Prompt:

```txt
Classify this affiliate/content creator:

Name: Maya Lane
Company: HustleOps Media
Partner type claimed: creator affiliate
Audience: gig workers, ecomm sellers, solo founders
Traffic/network size: 22,000 email subscribers and 80,000 TikTok followers
Funding experience: no direct funding packaging, has promoted fintech tools
Desired role: affiliate
Notes: Wants swipe copy, tracking links, and content hooks.
```

Expected:

- partner_type: `creator_affiliate`
- tier: `tier_1` or `tier_2`
- onboarding_path: `standard_affiliate_partner`
- campaign type: social/email/lead magnet
- recommend campaign kits and tracking guidance
- no “everyone qualifies” language

## Test 7 — Low-info signup

Prompt:

```txt
Analyze this partner signup:

Name: Chris
Email: chris@example.com
Partner type claimed: other
Notes: I can send leads.
```

Expected:

- status: `needs_review`
- partner_tier: `tier_4` or similar nurture/watchlist
- onboarding_path: `nurture_watchlist`
- request missing info
- no overconfident classification

## Test 8 — Shady lead seller / high risk

Prompt:

```txt
Review this partner:

Name: Fast Leads LLC
Partner type claimed: lead seller
Audience: all businesses
Funding experience: sells aged loan leads
Referral volume: 500+ per month
Notes: Says leads are exclusive but cannot explain source. Wants payout before validation. Claims everyone can get approved if we push hard enough.
```

Expected:

- risk_level: `critical` or `high`
- tier: `reject_risk`
- onboarding_path: `reject_manual_risk_review`
- manual_review_required: true
- risk flags: source quality, deceptive claims, payout-before-validation, approval guarantee language
- no campaign recommendation except reject/manual review

## Test 9 — Strategic fintech partner

Prompt:

```txt
Review this strategic partner:

Name: Alex Chen
Company: LedgerFlow AI
Partner type claimed: fintech vendor partner
Audience: accountants and fractional CFOs
Funding experience: wants to embed funding readiness insights inside their dashboard
Current tools: API-first SaaS, HubSpot, Segment
Traffic/network size: 3,000 active firms
Desired role: strategic partner
Notes: Wants API integration and co-marketing.
```

Expected:

- partner_type: `fintech_vendor_partner` or `strategic_partner`
- tier: `tier_1`
- onboarding_path: `strategic_partner_review`
- manual_review_required: true
- recommend strategic review, API/action discussion, co-marketing plan
- do not auto-approve

## Test 10 — Unqualified consumer

Prompt:

```txt
Analyze this intake:

Name: Taylor
Partner type claimed: referral partner
Audience: none
Notes: I need a personal loan and want to fix my credit.
```

Expected:

- partner_type: `unqualified_not_fit`
- tier: `reject_risk` or nurture only if appropriate
- onboarding_path: `reject_manual_risk_review` or `nurture_watchlist`
- explain this system is for partner intake, not consumer credit repair
- no credit repair advice

## Action Preview tests

After Actions are configured, run:

```txt
Use the Partner Intake OS API to check health.
```

Expected action:

```txt
checkHealth
```

Then run:

```txt
Use the Partner Intake OS API to classify this partner intake:
Name: Dana Brooks
Company: Books & Backoffice Co.
Partner type claimed: CPA/bookkeeper
Audience: contractors and service businesses
Funding experience: refers clients who need working capital education
Referral volume estimate: 2-5 per month
Desired partner role: referral partner
Source: manual
```

Expected action:

```txt
classifyPartnerIntake
```

## Regression checklist

After changing instructions, knowledge, schemas, or actions, rerun:

- Test 1
- Test 7
- Test 8
- Action health check
- Action classify test

The high-risk and low-info tests are the canaries. If those fail, don’t ship. The robot is chewing wires.
