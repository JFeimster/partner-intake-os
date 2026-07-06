# Task and Activity Model

## Purpose

Partner Intake OS should turn classifications into real follow-up behavior. HubSpot tasks and notes are where the operating system becomes useful instead of just producing decorative JSON.

## Task types

| Task type | Purpose | Trigger | Owner | Due timing |
|---|---|---|---|---|
| Admin Review | Review a new or flagged partner intake. | `manual_review_required = true` or stage = Needs Review. | Partner ops owner | Same day or next business day |
| Tier 1 Follow-Up | Fast response for high-value strategic/channel partner. | `partner_tier = tier_1` | Jason/admin | Same day |
| Missing Info Follow-Up | Request missing details before approval. | Stage = Missing Info. | Assigned owner | 1 business day |
| Risk Review | Evaluate prohibited claims, consent issues, or high-risk behavior. | `risk_level = high` or risk flags present. | Admin/compliance-aware reviewer | Same day |
| Onboarding Kickoff | Send resources, next steps, and setup instructions. | Stage = Approved. | Partner ops owner | Same day |
| Campaign Assignment | Assign campaign kit or tracking link next step. | Stage = Onboarding or Active Partner. | Partner ops/marketing | 2-3 business days |
| Re-Engagement | Revisit stalled watchlist or inactive partner. | Stage = Watchlist or inactive. | Assigned owner | 14-30 days |
| Archive Review | Confirm stale/rejected/duplicate record can be archived. | Stage = Rejected or stale record. | Admin | As needed |

## Follow-up task rules

Create a follow-up task when:

- partner is Tier 1
- partner is approved
- partner is missing required information
- partner has a valuable audience but unclear role
- partner has not completed onboarding
- partner has no activity after initial approval
- partner needs a resource pack or tracking link

Recommended task subject format:

```text
Partner Intake OS — {{task_type}} — {{display_name_or_company}}
```

Examples:

```text
Partner Intake OS — Tier 1 Follow-Up — Valor Veterans Network
Partner Intake OS — Missing Info — LedgerLine Advisors
Partner Intake OS — Risk Review — Metro Lead Exchange
```

## Admin review task rules

Create an Admin Review task when:

- `manual_review_required = true`
- `risk_level` is `medium` or `high`
- `partner_tier = tier_1`
- partner type is unclear
- partner claimed a different role than classification suggests
- duplicate detected
- consent language is missing
- high referral volume claim needs validation
- strategic partner/vendor requires human decision

Recommended task body:

```text
Review this Partner Intake OS record before approval.

Partner ID:
Partner Type:
Partner Tier:
Score:
Risk Level:
Risk Flags:
Recommended Decision:
Next Action:
Source:
Review Link:
```

## Tier 1 alert task rules

Tier 1 records should generate a high-priority task but not blind auto-approval.

Create Tier 1 task when:

- audience fit is strong
- trust/relationship leverage is high
- potential deal flow is high
- partner is strategic/channel-level
- risk is low or manageable

Tier 1 task body should include:

```text
Why this is Tier 1:
Recommended first move:
Suggested resource pack:
Suggested call agenda:
Manual review warning:
```

## Risk review task rules

Create Risk Review task when risk flags include:

- guaranteed approvals
- guaranteed funding amounts
- fake lender certainty
- credit repair positioning
- deceptive urgency
- invented testimonials
- everyone qualifies claims
- lead selling without consent proof
- pressure tactics
- misleading borrower-facing claims

Risk review output options:

```text
approve_with_edits
request_more_info
watchlist
reject
archive
```

## Activity notes format

Use consistent activity notes so the CRM timeline stays readable.

### GPT review note

```text
Partner Intake OS Review

Partner ID:
Source:
Submitted At:
Classification:
Tier:
Score:
Risk Level:
Manual Review Required:

Summary:
- 

Risk Flags:
- 

Recommended Onboarding Path:
- 

Recommended Resources:
- 

Recommended Campaign:
- 

Next Action:
- 
```

### Decision note

```text
Partner Intake OS Decision

Decision:
Reviewer:
Decision Date:
Reason:
Status Change:
Next Action:
Follow-Up Task:
Systems Updated:
```

### Sync note

```text
Partner Intake OS Sync

Sync Source:
Sync Time:
Objects Updated:
- Contact:
- Company:
- Deal:
- Task:
Sync Result:
Errors:
Next Sync Action:
```

## GPT review event mapping

| GPT/Partner Intake event | HubSpot activity |
|---|---|
| `intake_received` | Note on contact/deal |
| `partner_classified` | Note plus property updates |
| `resources_recommended` | Note plus property update |
| `campaign_recommended` | Note plus property update |
| `manual_review_required` | Task |
| `partner_approved` | Note plus stage/status update |
| `partner_rejected` | Note plus stage/status update |
| `partner_watchlisted` | Note plus task |
| `crm_sync_completed` | Sync note |
| `crm_sync_failed` | Task or note depending severity |

## Task priority rules

| Condition | Priority |
|---|---|
| Tier 1 + low/medium risk | High |
| High risk | High |
| Missing info + likely Tier 1/Tier 2 | Medium |
| Standard Tier 2 approval | Medium |
| Tier 3 new affiliate | Normal |
| Watchlist re-engagement | Low |
| Archive review | Low |

## What not to automate yet

Do not automate:

- final approval of strategic partners
- payout/commission decisions
- claims about funding approval
- borrower-facing financial claims
- deletion of records
- bulk sending without human review
- risky partner activation

Let the machine sort, summarize, and route. Let the human pull the trigger.
