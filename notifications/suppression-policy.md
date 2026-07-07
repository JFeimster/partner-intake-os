# Notification Suppression Policy

## Suppression keys

Use this pattern:

`notification_type:entity_type:entity_id:recipient`

## Default windows

| Type | Window |
|---|---:|
| new partner needs review | 4 hours |
| high-risk partner flagged | 1 hour |
| lead submitted | 2 hours |
| duplicate detected | 4 hours |
| sync failure | 30 minutes |
| admin decision needed | 2 hours |
| partner-facing received-for-review | 24 hours |

## Reasons to suppress

- duplicate notification in active window
- recipient opted out where applicable
- partner-facing messages disabled
- admin route lacks permission
- record archived
- missing safe recipient
