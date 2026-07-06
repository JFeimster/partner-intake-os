# Notion + HubSpot Sandbox Sync Checklist

Use this checklist before enabling any non-dry-run sync.

## 1. Repo placement

| Check | Pass/Fail | Notes |
|---|---|---|
| `/lib/storage/notion.ts` exists |  |  |
| `/lib/storage/hubspot.ts` exists |  |  |
| `/lib/storage/storage-router.ts` exists |  |  |
| `/lib/storage/sync-log.ts` exists |  |  |
| `/lib/storage/sync-types.ts` exists |  |  |
| `/sync/README.md` exists |  |  |
| `/sync/sample-sync-events.json` exists |  |  |

## 2. Environment variables

| Env var | Required for | Present | Notes |
|---|---|---:|---|
| `PARTNER_INTAKE_STORAGE_MODE` | all modes |  | mock/notion/hubspot/dual_sandbox |
| `PARTNER_INTAKE_DRY_RUN` | safe testing |  | should be true first |
| `NOTION_API_KEY` | Notion |  | never commit value |
| `NOTION_PARTNER_DATABASE_ID` | Notion |  | sandbox database only |
| `HUBSPOT_ACCESS_TOKEN` | HubSpot |  | sandbox/private app only |
| `HUBSPOT_PARTNER_PIPELINE_ID` | HubSpot |  | future task/deal pipeline |

## 3. Mock mode

| Check | Pass/Fail | Notes |
|---|---|---|
| `PARTNER_INTAKE_STORAGE_MODE=mock` returns `queued` |  |  |
| No external API call is made |  |  |
| Logs contain only safe partner summary |  |  |

## 4. Notion dry-run

| Check | Pass/Fail | Notes |
|---|---|---|
| `PARTNER_INTAKE_STORAGE_MODE=notion` |  |  |
| `PARTNER_INTAKE_DRY_RUN=true` |  |  |
| Valid fake event returns `queued` |  |  |
| Missing Notion env vars returns `skipped` |  |  |
| High-risk event returns `needs_review` |  |  |
| No raw PII appears in logs |  |  |

## 5. HubSpot dry-run

| Check | Pass/Fail | Notes |
|---|---|---|
| `PARTNER_INTAKE_STORAGE_MODE=hubspot` |  |  |
| `PARTNER_INTAKE_DRY_RUN=true` |  |  |
| Valid fake event returns `queued` |  |  |
| Missing HubSpot token returns `skipped` |  |  |
| Missing identifier returns `needs_review` |  |  |
| High-risk event returns `needs_review` |  |  |
| No raw PII appears in logs |  |  |

## 6. Dual sandbox dry-run

| Check | Pass/Fail | Notes |
|---|---|---|
| `PARTNER_INTAKE_STORAGE_MODE=dual_sandbox` |  |  |
| Notion result returned |  |  |
| HubSpot result returned |  |  |
| Aggregate summary is safe |  |  |
| No external writes happen while dry-run is true |  |  |

## 7. Non-dry-run sandbox test

Only run this section after Jason/admin confirms the target systems are sandbox-only.

| Check | Pass/Fail | Notes |
|---|---|---|
| One fake partner record used |  |  |
| `PARTNER_INTAKE_DRY_RUN=false` only during test |  |  |
| Notion page created in sandbox |  |  |
| HubSpot contact created in sandbox |  |  |
| No production workspace was touched |  |  |
| Test record archived/deleted after validation |  |  |
| Dry-run restored to true after test |  |  |

## 8. Compliance and privacy

| Check | Pass/Fail | Notes |
|---|---|---|
| No guaranteed approval/funding language returned |  |  |
| No raw Tally payloads logged |  |  |
| No bank/tax/account/password data stored |  |  |
| Manual review remains required for high-risk records |  |  |
| Sync status is not treated as partner approval |  |  |

## Final decision

| Decision | Mark |
|---|---:|
| Keep in mock mode |  |
| Ready for Notion dry-run |  |
| Ready for HubSpot dry-run |  |
| Ready for dual sandbox dry-run |  |
| Ready for one fake non-dry-run sandbox write |  |
| Not ready; fix issues first |  |
