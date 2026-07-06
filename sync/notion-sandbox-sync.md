# Notion Sandbox Sync

## Role of Notion

Notion is the staging and review layer for Partner Intake OS.

Use it for:

- Partner intake review.
- Manual review queue.
- Operator notes.
- Intake classification history.
- Lightweight readiness boards.

Do not use Notion as the source of truth for production auth, partner permissions, payout logic, or sensitive lead files.

## Required env vars

```text
PARTNER_INTAKE_STORAGE_MODE=notion
PARTNER_INTAKE_DRY_RUN=true
NOTION_API_KEY=
NOTION_PARTNER_DATABASE_ID=
```

For dual target testing:

```text
PARTNER_INTAKE_STORAGE_MODE=dual_sandbox
```

## Recommended database

Database name:

```text
Partner Intake Review Queue
```

Recommended properties:

| Property | Type | Notes |
|---|---|---|
| Partner | Title | Company or display name |
| Partner ID | Text | Stable partner ID |
| Status | Select | Pending Review, Active, Needs Info, Needs Review, Paused, Archived |
| Partner Type | Select | Broker, Referral Partner, Affiliate, COI, Strategic, Vendor |
| Partner Tier | Select | tier_1, tier_2, tier_3, tier_4, reject |
| Onboarding Path | Select | fast_track, standard, education_first, referral_only, manual_review |
| Contact Name | Text | Primary contact |
| Email | Email | Contact email |
| Phone | Phone | Optional |
| Company | Text | Company or brand |
| Primary Audience | Text | Audience served |
| Risk Level | Select | low, medium, high, unknown |
| Source | Select | tally, api, gpt_action, admin, test |
| Tags | Multi-select | Routing labels |
| Manual Review | Checkbox | True when sync should stop for review |
| Next Action | Text | Operator next step |
| Review Notes | Text | Safe summary only |
| Created At | Date | Intake creation timestamp |
| Updated At | Date | Last update timestamp |

## Dry-run first

Keep:

```text
PARTNER_INTAKE_DRY_RUN=true
```

Expected dry-run result:

```json
{
  "status": "queued",
  "target": "notion",
  "dry_run": true,
  "message": "Dry-run Notion sandbox sync queued. No Notion page was created."
}
```

## Write test

Only after property mapping is confirmed:

```powershell
$env:PARTNER_INTAKE_DRY_RUN="false"
```

Submit one fake test partner. Verify:

- A Notion page is created.
- No raw webhook payload appears in Notion.
- No sensitive data appears in notes.
- Manual review records are held with `needs_review` when risk flags exist.

## Common failure causes

| Failure | Likely cause | Fix |
|---|---|---|
| `notion_http_401` | Invalid API key | Replace token in Vercel env vars |
| `notion_http_403` | Integration not shared with database | Share database with integration |
| `validation_error` | Property names mismatch | Update `mapPartnerToNotionProperties` |
| `object_not_found` | Wrong database ID | Re-copy database ID |

## Sandbox safety

Use a test-only Notion database first. Notion is the review clipboard, not the bank vault.
