# Lead Review Rules

## Review principle

A submitted lead is not a funded deal. It is a referral record that needs validation, consent, routing, and human review.

No robot gets to wear the lender hat. Not yet. Not in this module.

## Human review rules

Human review is required before any high-stakes decision, including:

- telling the applicant they may fit a specific product
- marking a lead as ready for funding review
- escalating to a funding specialist
- syncing to a live sales sequence
- disqualifying a lead based on limited information
- contacting a lead where consent is unclear
- accepting a lead from a watchlist or high-risk partner

## Missing information rules

Mark `missing_info` when required fields are absent, vague, or obviously unusable.

Required minimum viable lead fields:

- partner ID
- referral source
- business name
- owner first name
- owner last name
- owner email
- owner phone
- industry
- location
- time in business
- monthly revenue range
- requested amount range
- funding purpose
- urgency
- consent confirmation

Recommended admin action:

```text
request_more_info
```

## High-risk flags

Use risk flags when the lead may create compliance, quality, privacy, or operational problems.

High-risk examples:

- missing or unclear consent
- partner says the applicant is “already approved”
- partner claims a guaranteed amount
- partner collected documents outside approved flow
- lead is pre-revenue but positioned as urgent funding
- business industry is unclear or potentially restricted
- lead is duplicated across multiple partners
- lead includes sensitive documents
- partner submitted many low-info leads in a short period
- urgent payroll or emergency cash-flow need with poor information quality

## Prohibited claims

Do not allow partner-facing or applicant-facing copy to say:

- guaranteed approval
- guaranteed funding
- no denial
- everyone qualifies
- instant approval
- no credit concerns
- funding regardless of revenue
- fix your credit
- remove negative credit
- lenders are waiting to fund you
- approved up to a specific amount without review

## Consent rules

Before any follow-up:

1. Confirm the business owner gave permission.
2. Confirm the partner is allowed to submit the information.
3. Confirm the business owner understands this is review, not approval.
4. Log the consent source and notes.
5. If consent is unclear, do not route to automated outreach.

## Referral quality notes

Track partner quality over time.

Positive signals:

- complete lead data
- clear consent
- accurate expectations
- relevant business profile
- responsive owner
- realistic funding purpose
- partner provides useful context

Negative signals:

- repeated missing fields
- exaggerated claims
- scraped or cold data
- suspicious volume
- no relationship to owner
- pressure tactics
- mismatched business types
- sensitive docs submitted outside approved flow

## When not to proceed

Do not proceed when:

- consent is missing
- the partner is rejected or not approved
- the lead appears scraped or purchased without permission
- business owner contact information is fake
- the lead asks for prohibited or unsupported services
- the partner used deceptive claims
- required information remains missing after follow-up
- sensitive documents were submitted into an unsafe channel

Recommended status:

```text
rejected
```

or, when less severe:

```text
archived
```

## Approved review language

Use:

- “Submitted for review”
- “Needs more information”
- “Possible next steps”
- “Funding readiness review”
- “May be contacted for follow-up”
- “No funding outcome is guaranteed”

Avoid:

- “Approved”
- “Qualified”
- “Guaranteed”
- “Pre-approved”
- “No risk”
- “Everyone qualifies”

## Admin review checklist

- [ ] Consent confirmed
- [ ] Partner ID valid
- [ ] Tracking ID preserved if present
- [ ] Contact fields complete
- [ ] Business fields complete
- [ ] Funding purpose clear
- [ ] Urgency reviewed
- [ ] Missing info captured
- [ ] Risk flags reviewed
- [ ] Duplicate check completed
- [ ] Status assigned
- [ ] Next action assigned
- [ ] No prohibited claims included
