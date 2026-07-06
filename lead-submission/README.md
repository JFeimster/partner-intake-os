# Partner Lead Submission Module

## Purpose

The lead submission module lets approved partners submit business funding leads into the Partner Command Center workflow.

This is the front door for partner-generated opportunities after a partner is approved, activated, and assigned a partner ID or tracking ID. It is designed to be:

- API-ready
- dashboard-ready
- CRM-ready
- compliance-safe
- simple enough to ship without building a haunted fintech carnival

## Who can use it

Recommended users:

- Approved referral partners
- Approved affiliate partners
- Funding brokers
- CPAs and bookkeepers
- Business attorneys
- Business brokers
- Veteran and community connectors
- Strategic fintech or vendor partners

Do not open this module broadly to anonymous public traffic until authentication, rate limits, consent handling, spam controls, and admin review are active.

## What data it collects

The module collects enough information to route and review a submitted lead:

- Partner attribution
- Business owner contact details
- Business profile
- Funding need
- Revenue and cash-flow context
- Time in business
- Credit/readiness context
- Consent confirmation
- Partner notes

Do not collect sensitive personal documents, bank statements, tax returns, SSNs, EIN documentation, full DOB, credit reports, or lender application credentials through this static MVP.

## How it connects later

Current batch status:

- Static demo form only
- Local sample JSON behavior
- No live API submission
- No real CRM sync
- No real funding application
- No approval or underwriting decision

Future flow:

```text
Approved partner
  ↓
Submit lead form
  ↓
POST /api/leads/submit
  ↓
Normalize + validate
  ↓
Route by partner tier, funding purpose, missing info, and risk flags
  ↓
Notion staging / HubSpot CRM / Google Sheets optional log
  ↓
Admin review
  ↓
Next action assigned
```

## Compliance warnings

Partner-facing language must stay readiness-based and operational.

Avoid:

- guaranteed approvals
- guaranteed funding amounts
- guaranteed timelines
- “everyone qualifies”
- fake lender certainty
- deceptive urgency
- credit repair positioning
- invented testimonials
- promising a specific product before review

Use:

- “review”
- “funding readiness”
- “possible options”
- “next steps”
- “based on the information submitted”
- “no funding outcome is guaranteed”

## What not to promise applicants

Partners must not tell business owners:

- “You are approved.”
- “You qualify for $X.”
- “No credit check.”
- “Guaranteed funding.”
- “Same-day funding for everyone.”
- “We can fix your credit.”
- “Lenders will definitely compete for you.”

Approved language:

- “Submit your information for review.”
- “A funding specialist or intake team may follow up.”
- “The information helps identify possible next steps.”
- “Funding availability depends on business profile, revenue, time in business, documentation, lender criteria, and other factors.”

## Recommended implementation order

1. Use the static demo page to validate fields and copy.
2. Convert fields into a Tally form or authenticated partner dashboard form.
3. Add `POST /api/leads/submit`.
4. Validate against `/lead-submission/lead.schema.json`.
5. Route to Notion staging first.
6. Add HubSpot sync.
7. Add partner dashboard history.
8. Add tracking attribution from Batch 19.
9. Add admin review dashboard from Batch 20.

## Files in this module

```text
/lead-submission/README.md
/lead-submission/lead-form-fields.md
/lead-submission/lead.schema.json
/lead-submission/lead-field-map.json
/lead-submission/sample-lead-submission.json
/lead-submission/lead-routing-rules.md
/lead-submission/lead-review-rules.md
/lead-submission/lead-submission-api-spec.md
/lead-submission/partner-facing-copy.md
/site/partner-intake/submit-lead.html
/site/partner-intake/submit-lead.css
/site/partner-intake/submit-lead.js
/site/partner-intake/data/sample-lead-submission.json
/tests/lead-submission-checklist.md
```
