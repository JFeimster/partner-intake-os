# Permission Matrix

| Permission | owner | admin | reviewer | read_only | integration_service |
|---|---:|---:|---:|---:|---:|
| `admin:user_manage` | yes | no | no | no | no |
| `admin:read_self` | yes | yes | yes | yes | yes |
| `partner:read` | yes | yes | assigned | limited | sync-limited |
| `partner:update` | yes | yes | no | no | sync-limited |
| `lead:read` | yes | yes | assigned | limited | sync-limited |
| `lead:decide` | yes | yes | assigned-safe | no | no |
| `review:read` | yes | yes | assigned | limited | no |
| `review:update` | yes | yes | assigned-safe | no | no |
| `review:assign` | yes | yes | no | no | no |
| `audit:read` | yes | yes | no | no | no |
| `sync:read` | yes | yes | no | limited | yes |
| `sync:retry` | yes | yes | no | no | yes |
| `tracking:read` | yes | yes | summary | summary | no |
| `notifications:send_internal` | yes | yes | no | no | service-only |

## Assigned-safe

`assigned-safe` means the reviewer can work only items assigned to them and cannot make restricted decisions without admin escalation.
