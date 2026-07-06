# Notion Setup Pass/Fail Checklist

Use this as the final setup QA checklist for Batch 16.

## Database

| Test | Pass/Fail | Notes |
|---|---|---|
| Partner review database exists |  |  |
| Database is private/internal |  |  |
| Database is shared with Notion integration |  |  |
| Title property is `Name` |  |  |
| `Partner ID` property exists |  |  |
| `Email` property exists |  |  |
| `Partner Type` select options exist |  |  |
| `Partner Tier` select options exist |  |  |
| `Onboarding Path` select options exist |  |  |
| `Status` select options exist |  |  |
| `Risk Level` select options exist |  |  |
| `Manual Review Required` checkbox exists |  |  |
| `Risk Flags` multi-select exists |  |  |
| `Last Synced At` date exists |  |  |

## Views

| Test | Pass/Fail | Notes |
|---|---|---|
| New Intakes view exists |  |  |
| Tier 1 Priority view exists |  |  |
| Manual Review view exists |  |  |
| Approved Partners view exists |  |  |
| Watchlist view exists |  |  |
| High Risk view exists |  |  |
| Needs Follow-Up view exists |  |  |
| By Partner Type view exists |  |  |
| By Audience view exists |  |  |
| Recently Updated view exists |  |  |

## Integration

| Test | Pass/Fail | Notes |
|---|---|---|
| `NOTION_API_KEY` exists in Vercel |  |  |
| `NOTION_PARTNER_DATABASE_ID` exists in Vercel |  |  |
| `PARTNER_INTAKE_STORAGE_MODE=notion` set where intended |  |  |
| Database ID matches target database |  |  |
| Integration can create a test record |  |  |
| Integration can update a test record |  |  |
| Integration does not expose secrets in responses |  |  |

## Record behavior

| Test | Pass/Fail | Notes |
|---|---|---|
| Broker sample record imports |  |  |
| CPA/bookkeeper sample record imports |  |  |
| Attorney sample record imports |  |  |
| Veteran connector sample record imports |  |  |
| Creator/affiliate sample record imports |  |  |
| High-risk lead seller sample record imports |  |  |
| High-risk record appears in High Risk view |  |  |
| Manual-review record appears in Manual Review view |  |  |
| Tier 1 record appears in Tier 1 Priority view |  |  |

## Compliance and privacy

| Test | Pass/Fail | Notes |
|---|---|---|
| No API keys in Notion pages |  |  |
| No raw private keys in Notion pages |  |  |
| No secrets in sample records |  |  |
| No fake approval/funding claims |  |  |
| Risk flags are review-focused, not defamatory |  |  |
| Database access is limited to internal users |  |  |

## Final decision

- [ ] Pass — Notion staging/review setup is ready.
- [ ] Fail — Fix issues before enabling live sync.

Reviewer:

Date:
