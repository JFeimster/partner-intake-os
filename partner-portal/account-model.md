# Partner Account Model

## Account object

```json
{
  "partner_account_id": "pacc_123",
  "partner_id": "ptr_123",
  "email": "partner@example.com",
  "role": "partner_owner",
  "status": "active",
  "onboarding_status": "in_progress",
  "last_login_at": null,
  "created_at": "2026-07-06T17:00:00Z"
}
```

## Partner portal roles

| Role | Meaning |
|---|---|
| `partner_owner` | Main account owner for the partner organization. |
| `partner_member` | Team member with limited access. |
| `partner_read_only` | Read-only access. |

## Statuses

- `invited`
- `active`
- `paused`
- `revoked`
- `archived`

## Important distinction

A partner account with `active` portal access is not an approved borrower, approved lender relationship, guaranteed commission recipient, or guaranteed business outcome recipient. It means the portal account can access permitted partner resources.
