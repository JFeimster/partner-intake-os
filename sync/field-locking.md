# Field Locking

Field locking prevents external tools from turning production data into a street fight.

## Lock levels

| Lock level | Meaning | Examples |
|---|---|---|
| `database_locked` | Database is canonical. External edits are ignored or queued for review. | partner_tier, risk_level, review_status |
| `crm_locked` | HubSpot owns the field after assignment. | crm_owner_id, deal_stage |
| `ops_locked` | Notion/operator workspace owns limited ops metadata. | review_notes_draft, checklist_context |
| `open_sync` | Any approved target may update if newer and valid. | website, company_name |
| `manual_only` | Only admin/operator action can change it. | rejection_reason, compliance_override |

## Locked-by-default fields

- `partner_id`
- `lead_id`
- `partner_tier`
- `risk_level`
- `review_status`
- `manual_review_required`
- `compliance_flags`
- `tracking_link_id`
- `audit_log`
- `commission_data`
- `approval_decisions`

## Conflict handling

When an external update conflicts with a locked field:

1. Do not overwrite the database.
2. Create a `sync_conflict` event.
3. Write a `needs_review` sync job status.
4. Show conflict to admin dashboard.
5. Allow operator to accept source, keep database, or merge non-sensitive fields.

## Example field policy

```json
{
  "field": "partner_tier",
  "lock_level": "database_locked",
  "external_update_behavior": "queue_conflict",
  "allowed_sources": ["admin_review", "scoring_rules"],
  "audit_required": true
}
```
