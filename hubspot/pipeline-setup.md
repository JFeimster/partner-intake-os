# HubSpot Partner Pipeline Setup

## Purpose

Create a dedicated Partner Pipeline so Partner Intake OS can track partner intake, review, approval, onboarding, activation, watchlist, rejection, and archival without polluting borrower/client sales pipelines.

Recommended pipeline name:

```text
Partner Intake Pipeline
```

## Pipeline stages

| Stage | Purpose | Entry criteria | Exit criteria | Automation notes | Manual review rules |
|---|---|---|---|---|---|
| New Intake | Fresh partner signup or manually entered partner record. | Intake received from Tally, manual entry, import, or GPT Action. | Required fields normalized and initial classification completed. | Create contact/company if confidence is acceptable; create deal. | Required if intake has missing name/email/company or unclear role. |
| Needs Review | Admin must review before approving, rejecting, or requesting info. | Manual review required, medium/high risk, incomplete context, duplicate suspected, or high-value strategic partner. | Admin decision recorded. | Create review task for owner. | Always required before moving to Approved, Watchlist, or Rejected. |
| Missing Info | Partner appears useful but key info is missing. | Missing contact data, unclear audience, no website, unclear partner role, insufficient compliance context. | Missing data collected or record is downgraded/rejected. | Create follow-up task and optional email draft. | Human should verify before requesting sensitive info. |
| Approved | Partner accepted but not yet onboarded. | Admin approves record; risk level acceptable; next action assigned. | Onboarding path starts. | Trigger resource pack assignment and onboarding task. | Human approval required for all new active partners. |
| Onboarding | Partner is receiving resources, setup instructions, tracking links, or initial campaign kit. | Approved and onboarding path assigned. | Partner has completed basic activation steps or is stalled. | Create tasks for first 24 hours, 7 days, and 30 days. | Human review if stalled or confused. |
| Active Partner | Partner has usable relationship, tracking, lead submission path, or live campaign. | Onboarding complete or partner is actively referring/participating. | Partner goes stale, watchlist, archived, or escalated. | Optional periodic check-in tasks. | Review if volume spikes or quality drops. |
| Watchlist | Not rejected, but not ready or has quality/risk concerns. | Low score, low confidence, minor compliance concerns, no clear audience, or inactive after onboarding. | Re-engaged, approved, rejected, or archived. | Create nurture/check-in task. | Required before moving from Watchlist to Active. |
| Rejected | Not a fit or high-risk partner. | Prohibited claims, lead resale behavior, no consent path, fake certainty language, consumer-only applicant, or obvious mismatch. | Usually final unless manually reopened. | Stop automated onboarding. | Human decision should be logged. |
| Archived | Closed/inactive record preserved for history. | Duplicate, stale, old rejected, no-response, or moved out of pipeline. | Reopened manually only. | Remove active tasks where appropriate. | Human review for reactivation. |

## Stage transition map

```text
New Intake
  -> Needs Review
  -> Missing Info
  -> Approved
  -> Rejected

Needs Review
  -> Missing Info
  -> Approved
  -> Watchlist
  -> Rejected
  -> Archived

Missing Info
  -> Needs Review
  -> Approved
  -> Watchlist
  -> Rejected

Approved
  -> Onboarding
  -> Watchlist
  -> Archived

Onboarding
  -> Active Partner
  -> Missing Info
  -> Watchlist
  -> Archived

Active Partner
  -> Watchlist
  -> Archived

Watchlist
  -> Needs Review
  -> Approved
  -> Rejected
  -> Archived

Rejected
  -> Archived

Archived
  -> Needs Review
```

## Automation notes

### New Intake automation

When a new partner intake syncs:

- create or update Contact
- create or update Company if company/domain exists
- create Partner Pipeline deal
- assign stage based on classification
- create task if review is needed
- write Partner Intake OS note

### Tier 1 automation

When `partner_tier = tier_1`:

- create urgent follow-up task
- assign owner
- move to Needs Review or Approved depending on risk
- add note explaining why it is Tier 1
- do not auto-approve strategic partners without human review

### High-risk automation

When `risk_level = high` or risk flags include prohibited behavior:

- move to Needs Review or Rejected
- create risk review task
- suppress onboarding automations
- log risk summary
- require manual decision

### Missing-info automation

When required fields are absent:

- move to Missing Info
- create follow-up task
- do not send partner activation resources yet
- do not create tracking links until basic identity and consent are clean

## Manual review triggers

Manual review is required when:

- risk level is high
- partner claims guaranteed approvals or guaranteed funding
- lead resale language appears
- no consent/permission path is clear
- partner type is unclear
- company/domain conflict suggests duplicate
- partner is strategic/Tier 1
- requested role conflicts with actual audience
- record contains unusual or suspicious claims
- applicant appears to be a borrower, not a partner

## Deal naming convention

Recommended deal name:

```text
Partner Intake — {{company_or_display_name}} — {{partner_type}}
```

Examples:

```text
Partner Intake — Blue Ridge Funding — funding_broker
Partner Intake — LedgerLine Advisors — cpa_bookkeeper
Partner Intake — Valor Veterans Network — veteran_community_connector
```

## Required deal fields

At minimum, every partner deal should include:

- Partner ID
- Partner Type
- Partner Tier
- Partner Status
- Onboarding Path
- Risk Level
- Manual Review Required
- Score
- Next Action
- Last Partner Intake Sync

## Pipeline QA checklist

- [ ] Partner pipeline exists.
- [ ] All stages exist in the correct order.
- [ ] Stage names are human-readable.
- [ ] Status enum values align with Partner Intake OS status model.
- [ ] High-risk records cannot silently become active.
- [ ] Tier 1 records generate review/follow-up.
- [ ] Missing-info records do not receive full activation resources.
- [ ] Rejected records do not trigger welcome/onboarding tasks.
