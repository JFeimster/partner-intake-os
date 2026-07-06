# Lifecycle and Status Rules

## Purpose

This file defines how Partner Intake OS statuses should map into HubSpot lifecycle, pipeline stages, and partner relationship state.

## Lifecycle stage recommendation

For HubSpot lifecycle, use a conservative approach.

Recommended lifecycle mapping:

| Partner Intake status | Suggested HubSpot lifecycle stage | Notes |
|---|---|---|
| `new` | Lead | New partner inquiry. |
| `needs_review` | Lead | Do not upgrade until reviewed. |
| `missing_info` | Lead | Still unqualified. |
| `approved` | Marketing Qualified Lead or Sales Qualified Lead | Use SQL for high-value partner relationships requiring direct follow-up. |
| `onboarding` | Sales Qualified Lead or Opportunity | Partner relationship is being activated. |
| `active` | Customer or Evangelist | Use based on your HubSpot account conventions. For partner programs, “Evangelist” can fit referral/channel partners. |
| `watchlist` | Lead | Nurture or monitor. |
| `rejected` | Other/Lead with rejected status | Do not delete unless policy requires. |
| `archived` | Other | Historical record only. |

If your HubSpot portal uses lifecycle stages differently, keep Partner Status as the authoritative partner-specific field and use lifecycle stage lightly.

## Partner status rules

| Status | Meaning | Allowed next statuses | Automation behavior |
|---|---|---|---|
| `new` | Intake received, not fully reviewed. | `needs_review`, `missing_info`, `approved`, `rejected` | Normalize, classify, create initial records. |
| `needs_review` | Human decision needed. | `missing_info`, `approved`, `watchlist`, `rejected`, `archived` | Create review task. |
| `missing_info` | Potentially useful but incomplete. | `needs_review`, `approved`, `watchlist`, `rejected` | Create info request task. |
| `approved` | Accepted for onboarding. | `onboarding`, `watchlist`, `archived` | Assign onboarding path/resources. |
| `onboarding` | Partner activation in progress. | `active`, `missing_info`, `watchlist`, `archived` | Create onboarding tasks. |
| `active` | Partner relationship is live. | `watchlist`, `archived` | Periodic follow-up and campaign support. |
| `watchlist` | Not ready or has concerns. | `needs_review`, `approved`, `rejected`, `archived` | Nurture or review later. |
| `rejected` | Not accepted. | `archived`, `needs_review` | Stop onboarding. |
| `archived` | Historical/inactive record. | `needs_review` | No active automation. |

## Pipeline stage rules

| Partner Status | Pipeline Stage |
|---|---|
| `new` | New Intake |
| `needs_review` | Needs Review |
| `missing_info` | Missing Info |
| `approved` | Approved |
| `onboarding` | Onboarding |
| `active` | Active Partner |
| `watchlist` | Watchlist |
| `rejected` | Rejected |
| `archived` | Archived |

## Disqualification/rejection notes

Reject or disqualify when:

- partner is actually a direct borrower/applicant, not a partner
- partner lacks a relevant audience or referral relationship
- partner uses guaranteed approval language
- partner claims guaranteed funding amounts
- partner offers lead lists without consent proof
- partner implies fake lender certainty
- partner requests deceptive campaigns
- partner appears to be spam/fraud
- partner refuses basic compliance-safe boundaries

Use rejection notes that are factual, boring, and defensible.

Good:

```text
Rejected due to unclear consent process and prohibited approval-guarantee language in submission.
```

Bad:

```text
This guy is sketchy and smells like lead-gen raccoon energy.
```

Funny internally, terrible in CRM. Do not put comedy grenades in system records.

## Re-engagement/watchlist rules

Move to Watchlist when:

- partner has possible value but low activation readiness
- audience is relevant but trust is unproven
- partner is missing details but not risky
- partner is inactive after onboarding
- partner needs education-first path
- partner has minor copy/compliance problems that can be corrected

Watchlist follow-up options:

- send educational partner resources
- request audience details
- request referral process details
- request consent language/process
- schedule review call
- revisit in 30 days

## Stage safety rules

Do not move to Approved, Onboarding, or Active when:

- `manual_review_required = true` and no review decision exists
- `risk_level = high`
- risk flags include prohibited claims
- required contact fields are missing
- consent acknowledgment is absent for referral/lead submission workflow
- partner identity is unclear

## Owner assignment rules

Suggested owner assignment:

| Condition | Owner |
|---|---|
| Tier 1 strategic/channel partner | Jason/admin |
| Tier 2 broker/referral partner | Partner ops owner |
| CPA/bookkeeper/attorney COI | Partner ops owner |
| High-risk record | Admin/compliance-aware reviewer |
| Missing info | Intake coordinator/admin |
| Watchlist/nurture | Partner ops or automation owner |

## Status QA checklist

- [ ] Partner Status property exists.
- [ ] Partner Status values exactly match internal enum.
- [ ] Pipeline stages align with status model.
- [ ] Lifecycle stage rules are documented.
- [ ] Risk/high-review rules block auto-approval.
- [ ] Rejected partners do not get onboarding tasks.
- [ ] Watchlist records can re-enter review.
- [ ] Archived records do not stay in active automations.
