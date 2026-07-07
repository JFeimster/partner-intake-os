# Immutable Decision Log Pattern

Decision logs are append-only operational records. Do not edit old decisions. Add a new decision that references the earlier one.

## Decision object

```json
{
  "review_item_id": "rev_123",
  "entity_type": "partner",
  "entity_id": "ptr_123",
  "decision": "approved_for_onboarding",
  "previous_status": "needs_review",
  "new_status": "approved_for_onboarding",
  "reason_code": "qualified_referral_partner",
  "operator_note": "Referral partner has relevant SMB audience and low compliance risk.",
  "created_by": "admin@example.com",
  "created_at": "2026-07-06T17:00:00Z"
}
```

## Safe reason codes

- `low_info_intake`
- `qualified_referral_partner`
- `qualified_broker`
- `strategic_partner_review`
- `duplicate_detected`
- `consent_missing`
- `sensitive_data_flagged`
- `compliance_language_risk`
- `not_fit_consumer`
- `manual_admin_override`

## Audit pairing

Each decision log should be paired with an audit log event when the database layer is available:

- action: `review_decision_created`
- entity_type: `admin_review_item`
- entity_id: review item ID
- metadata: safe summary only

## Rule

Never delete decision history. The review queue is not a diary with a shredder button.
