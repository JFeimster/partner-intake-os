# Developer API Auth

## Auth model

Use scoped API keys or future OAuth. For this batch, use Bearer API keys.

```http
Authorization: Bearer PARTNER_DEVELOPER_API_KEY
```

## Required headers

```http
Content-Type: application/json
X-Partner-Integration: your-integration-name
```

## Scopes

- `webhooks:register`
- `events:read`
- `partner:read_basic`
- `lead:submit`
- `resources:read`
- `campaigns:generate`

## Do not expose

- Admin API tokens
- Tally signing secrets
- HubSpot tokens
- Notion tokens
- database URLs
- session cookies
- audit-log internals

## Rotation

API keys should be rotatable without deleting partner records. Store only hashed key values in production.
