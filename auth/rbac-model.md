# RBAC Model

## Subject

A subject is the current admin/operator/service actor.

```json
{
  "user_id": "usr_123",
  "email": "ops@example.com",
  "role": "reviewer",
  "permissions": ["review:read", "review:update"],
  "session_id": "sess_123"
}
```

## Resource types

- `partner`
- `lead`
- `review_item`
- `audit_log`
- `tracking`
- `sync_job`
- `admin_user`
- `notification`
- `settings`

## Permission naming

Format: `resource:action`

Examples:

- `review:read`
- `review:update`
- `review:assign`
- `partner:read`
- `partner:update`
- `lead:read`
- `lead:decide`
- `audit:read`
- `admin:user_manage`
- `sync:retry`

## Default deny

If a permission is not explicitly granted by role or direct assignment, deny it. Admin ops is not a karaoke bar; not everyone gets the mic.
