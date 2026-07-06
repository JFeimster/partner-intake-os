# Notion Views and Filters

Create these views in the Partner Intake OS Notion database.

## View configuration table

| View | Filter rules | Sort rules | Use case |
|---|---|---|---|
| New Intakes | `Status` is `new` OR `Submitted At` is within past 14 days | `Submitted At` descending | Daily intake review. |
| Tier 1 Priority | `Partner Tier` is `tier_1` AND `Status` is not `rejected` or `archived` | `Score` descending, `Submitted At` descending | High-leverage partners that deserve fast follow-up. |
| Manual Review | `Manual Review Required` is checked OR `Status` is `needs_review` | `Risk Level` descending, `Score` descending | Human decision queue before automation proceeds. |
| Approved Partners | `Status` is `approved` OR `Status` is `onboarding` OR `Status` is `active` | `Updated At` descending | Partners cleared for onboarding or activity. |
| Watchlist | `Status` is `watchlist` OR `Partner Tier` is `tier_4` | `Updated At` descending | Not-now partners for nurture or future review. |
| High Risk | `Risk Level` is `high` OR `Risk Flags` is not empty and includes high-risk values | `Submitted At` descending | Compliance/risk review. |
| Needs Follow-Up | `Next Action` is not empty AND `Status` is not `rejected` or `archived` | `Updated At` ascending | Operational task queue. |
| By Partner Type | No strict filter; group by `Partner Type` | `Score` descending | Segment analysis and campaign planning. |
| By Audience | No strict filter; group by `Primary Audience` | `Score` descending | See which audiences are attracting partners. |
| Recently Updated | `Updated At` within past 30 days | `Updated At` descending | Recent activity review. |

## Recommended view types

### New Intakes

Type: Table

Fields to show:

- Name
- Company
- Partner Type
- Partner Tier
- Status
- Score
- Manual Review Required
- Submitted At
- Next Action

### Tier 1 Priority

Type: Board or Table

Fields to show:

- Name
- Company
- Primary Audience
- Score
- Risk Level
- Next Action
- Owner

### Manual Review

Type: Table

Fields to show:

- Name
- Partner Type
- Risk Level
- Risk Flags
- Score
- Notes
- Next Action
- Owner

### Approved Partners

Type: Board grouped by `Status`

Fields to show:

- Name
- Partner Type
- Partner Tier
- Onboarding Path
- Recommended Campaign
- Next Action

### Watchlist

Type: Table

Fields to show:

- Name
- Company
- Partner Type
- Risk Flags
- Notes
- Updated At

### High Risk

Type: Table

Fields to show:

- Name
- Email
- Website
- Risk Level
- Risk Flags
- Notes
- Owner

## Filter details

### High-risk flag filter pattern

Use one or more of these flag conditions:

- `Risk Flags` contains `guarantee_claims`
- `Risk Flags` contains `credit_repair_language`
- `Risk Flags` contains `lead_quality_unclear`
- `Risk Flags` contains `possible_consumer_fit`
- `Risk Flags` contains `manual_review_required`

### Follow-up view filter pattern

```text
Status is not rejected
AND Status is not archived
AND Next Action is not empty
```

## Operator note

Views are not strategy. They are sorting trays. The strategy is what happens after a record hits the tray.
