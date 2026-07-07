# Sync Conflict Resolution

## Conflict types

| Type | Description | Default outcome |
|---|---|---|
| `locked_field_update` | External system tried to update a locked field. | Queue for manual review |
| `stale_external_record` | External timestamp older than database timestamp. | Keep database |
| `missing_external_id` | Sync target object not found. | Retry lookup or recreate with operator approval |
| `schema_mismatch` | External system field does not match internal schema. | Pause sync |
| `sensitive_data_violation` | Payload includes restricted PII/secrets. | Terminal failure + compliance queue |

## Resolution actions

- `keep_database`
- `accept_external`
- `merge_non_sensitive`
- `pause_sync`
- `recreate_external_record`
- `escalate_to_admin`

## Decision log pattern

All conflict resolutions should produce an event:

```json
{
  "event_type": "sync_conflict_resolved",
  "record_type": "partner",
  "record_id": "ptr_demo_001",
  "target_system": "hubspot",
  "resolution": "keep_database",
  "operator_id": "admin_001",
  "reason": "Database field is locked by production review decision."
}
```

## Hard rule

Never accept external updates that imply funding approval, lender review, guaranteed outcomes, guaranteed commissions, or approval certainty.
