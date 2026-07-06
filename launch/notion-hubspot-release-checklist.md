# Notion + HubSpot Release Checklist

## Release posture

Notion and HubSpot should begin in dry-run or sandbox mode. Do not write production records until fake record tests pass and the operator explicitly approves sandbox-write behavior.

## Notion database check

| Check | Status | Notes |
| --- | --- | --- |
| Sandbox Notion database exists. |  |  |
| Database ID copied into Vercel env var. |  |  |
| Integration has access to the database. |  |  |
| Required properties exist. |  |  |
| Property types match docs. |  |  |
| Test record uses fake data only. |  |  |
| Manual review status is visible. |  |  |

Recommended Notion checks:

```text
Partner / title
Partner ID / text
Status / select
Partner Type / select
Partner Tier / select
Onboarding Path / select
Risk Level / select
Source / select or text
Created At / date
Review Notes / text
```

## HubSpot property check

| Check | Status | Notes |
| --- | --- | --- |
| Sandbox HubSpot account or test portal confirmed. |  |  |
| Private app token stored only in Vercel. |  |  |
| Custom partner properties exist. |  |  |
| Contact/company association plan is documented. |  |  |
| Pipeline/stage mapping is documented. |  |  |
| Fake record write test passed. |  |  |
| No fake record entered production CRM. |  |  |

Recommended HubSpot custom properties:

```text
partner_id
partner_type
partner_tier
onboarding_path
primary_audience
risk_level
source
review_status
recommended_next_action
```

## Pipeline check

| Check | Status | Notes |
| --- | --- | --- |
| Partner pipeline/stages exist if using deals. |  |  |
| Lead review queue stage exists if using deals/tickets. |  |  |
| Manual review stage exists. |  |  |
| “Approved” is not automated. |  |  |
| “Funded” is not set automatically. |  |  |

## Sandbox sync check

Test sequence:

1. `PARTNER_INTAKE_STORAGE_MODE=mock`.
2. `PARTNER_INTAKE_DRY_RUN=true`.
3. `PARTNER_INTAKE_STORAGE_MODE=notion` with dry-run.
4. `PARTNER_INTAKE_STORAGE_MODE=hubspot` with dry-run.
5. `PARTNER_INTAKE_STORAGE_MODE=dual_sandbox` with dry-run.
6. Fake sandbox-write only after approval.

## Manual review flow

Every synced record should preserve:

- Partner ID.
- Partner type.
- Tier recommendation.
- Risk level.
- Manual review flag.
- Recommended next action.
- Source.
- Created timestamp.
- Redacted review notes.

## Failure handling

| Failure | Required response |
| --- | --- |
| Notion property mismatch | Stop writes, fix database property. |
| HubSpot unknown property | Stop writes, create property or update mapping. |
| Auth failure | Rotate/check token. |
| Rate limit | Retry later; do not spam retries. |
| Raw PII in error | Stop, redact logs, fix logging. |
| Wrong environment write | Stop sync, delete fake record if needed, document incident. |
