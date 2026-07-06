# Sync Failure Handling

## Failure philosophy

A failed sync is not a business emergency unless data was written incorrectly.

Do not retry blindly. Do not paste secrets into logs. Do not dump raw payloads into Slack, Notion, GitHub Issues, or screenshots.

## Status meanings

| Status | Meaning | Operator action |
|---|---|---|
| `queued` | Accepted in mock/dry-run mode | Review payload shape and target mapping |
| `skipped` | Target not configured | Add env vars or use intended mode |
| `synced` | Sandbox target accepted record | Verify fields manually |
| `failed` | Target call failed | Inspect safe error code and config |
| `needs_review` | Record held for manual review | Review risk flags before sync |

## First response checklist

When a sync fails:

1. Confirm storage mode.
2. Confirm dry-run state.
3. Confirm token/database/pipeline env var exists.
4. Confirm target sandbox is not production.
5. Confirm property names match target system.
6. Confirm the record is fake/test data.
7. Confirm no raw PII was logged.
8. Re-run a single fake test record.

## Common Notion failures

| Error | Meaning | Fix |
|---|---|---|
| `notion_http_401` | Bad/missing token | Replace `NOTION_API_KEY` |
| `notion_http_403` | Database not shared | Share database with integration |
| `notion_http_404` | Bad database ID | Replace database ID |
| `validation_error` | Property mismatch | Align Notion property names/types |
| `notion_request_failed` | Network/runtime error | Check Vercel logs and retry once |

## Common HubSpot failures

| Error | Meaning | Fix |
|---|---|---|
| `hubspot_http_401` | Bad/missing token | Replace `HUBSPOT_ACCESS_TOKEN` |
| `hubspot_http_403` | Missing scope | Update private app scopes |
| `PROPERTY_DOESNT_EXIST` | Custom field missing | Create property or update mapping |
| `CONFLICT` | Duplicate contact | Add dedupe search/update in later phase |
| `hubspot_request_failed` | Network/runtime error | Check logs and retry once |

## Retry rules

Retry only when:

- Env vars have been fixed.
- Target properties were corrected.
- The record is fake/test data.
- Dry-run result looks clean.

Do not retry when:

- The partner is high risk.
- Manual review is required.
- The payload includes sensitive data.
- You are unsure whether the target is production or sandbox.

## Rollback notes

If one fake test record was created in sandbox:

1. Mark it as `Archived` or delete it manually.
2. Record the sync result in the checklist.
3. Keep the failed payload out of GitHub if it includes real data.
4. Update mapping before rerunning.

## Incident log template

```text
Date:
Operator:
Mode:
Target:
Dry run:
Event ID:
Partner ID:
Status:
Error code:
Safe summary:
Root cause:
Fix applied:
Retest result:
```
