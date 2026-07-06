# Lead Routing Rules

## Routing objective

Move partner-submitted leads to the right review lane without making fake funding promises or over-automating decisions that need human judgment.

Routing is not approval. Routing only determines where the lead goes next.

## Default routing flow

```text
Lead submitted
  ↓
Validate required fields
  ↓
Check consent
  ↓
Check partner attribution
  ↓
Check duplicate risk
  ↓
Check missing information
  ↓
Check risk flags
  ↓
Route to Notion / HubSpot / Sheets
  ↓
Assign admin review lane
```

## Routing by partner tier

| Partner tier | Routing lane | Expected speed | Notes |
|---|---|---:|---|
| `tier_1` | Priority review | fastest | Strategic/channel partners. Create admin alert. |
| `tier_2` | Standard review | normal | Active referral or broker partners. |
| `tier_3` | Standard review with quality check | normal | Newer partners. Watch referral quality. |
| `tier_4` | Manual review | slower | Nurture/watchlist partners. |
| `watchlist` | Risk review | manual | Do not automate next steps. |
| `rejected` | Do not proceed | manual/admin only | Partner should not submit leads. |

## Routing by funding purpose

| Funding purpose | Suggested lane | Notes |
|---|---|---|
| `working_capital` | Funding readiness review | Check revenue, time in business, deposits, urgency. |
| `equipment` | Equipment-fit review | Confirm equipment purpose and business profile. |
| `inventory` | Cash-flow and inventory review | Watch for seasonality and repayment pressure. |
| `payroll` | Urgency review | Payroll stress can be high risk. Review carefully. |
| `expansion` | Growth capital review | Check revenue trend and timing. |
| `acquisition` | Acquisition readiness review | Needs extra documentation and human review. |
| `franchise` | Franchise readiness review | Needs franchise context and timeline. |
| `refinance_existing_debt` | Debt stack review | Watch for stacking and affordability issues. |
| `emergency_cash_flow` | Manual risk review | High urgency often means lower data quality. |
| `other` | Manual review | Clarify use case. |

## Routing by risk flags

| Risk flag | Route | Required action |
|---|---|---|
| `missing_consent` | Blocked/manual review | Do not route to sales follow-up until consent is fixed. |
| `missing_contact_info` | Missing info | Request required contact fields. |
| `incomplete_business_profile` | Missing info | Request business profile details. |
| `pre_revenue` | Education/readiness review | Do not position as immediate funding fit. |
| `very_new_business` | Readiness review | Set expectations around limited history. |
| `high_urgency_low_info` | Manual review | Do not automate partner or applicant follow-up. |
| `possible_duplicate` | Duplicate review | Check email, phone, business name, website. |
| `restricted_or_unclear_industry` | Risk review | Escalate before CRM outreach. |
| `partner_quality_concern` | Partner manager review | Review partner behavior and claims. |
| `unverified_claims` | Manual review | Ask for clarification; avoid relying on hype. |
| `sensitive_docs_submitted` | Security review | Remove/secure docs. Do not store in GitHub. |

## Routing by missing information

Route to `missing_info` when any required field is absent or unusable:

- owner email
- owner phone
- business name
- industry
- location
- time in business
- monthly revenue range
- requested amount range
- funding purpose
- consent confirmation

Recommended next action:

```text
request_missing_info
```

## Routing to systems

### Notion

Use Notion as the staging and admin review workspace.

Create or update:

- partner lead record
- status
- risk flags
- partner attribution
- admin owner
- next action

### HubSpot

Use HubSpot for CRM workflows when the lead is contactable and consent is present.

Create or update:

- contact
- company
- deal or partner-referred opportunity
- task
- activity note

### Google Sheets

Use Sheets only as a lightweight audit/export layer.

Do not store secrets, private keys, or sensitive documents.

## Manual review triggers

Manual review is required when:

- consent is missing or unclear
- partner is unapproved or unknown
- lead comes from watchlist partner
- risk flags are present
- business profile is incomplete
- lead appears duplicated
- partner claims guaranteed results
- business is in a restricted or unclear industry
- lead includes sensitive documents
- urgency is immediate but information is thin

## Duplicate handling

Possible duplicate signals:

- same owner email
- same owner phone
- same business name and location
- same website
- same partner submitted the same lead within 30 days
- same lead came through tracking link and manual form

Recommended duplicate route:

```text
status: duplicate
next_action: review_duplicate_before_follow_up
```

## Recommended status transitions

```text
submitted
  → needs_review
  → missing_info
  → qualified_for_review
  → routed
  → archived
```

Reject only when there is a clear reason. Otherwise use `missing_info`, `watchlist`, or `archived`.
