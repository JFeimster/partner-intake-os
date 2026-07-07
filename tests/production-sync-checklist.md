# Production Sync Checklist

## File checks

- [ ] `/sync/production-sync-policy.md` defines database as source of truth.
- [ ] `/sync/field-locking.md` defines locked fields.
- [ ] `/sync/retry-queue.md` defines retry states and backoff.
- [ ] `/sync/sync-conflict-resolution.md` defines manual conflict resolution.
- [ ] Sync helpers do not hardcode HubSpot or Notion secrets.
- [ ] Admin endpoints require `PARTNER_INTAKE_ADMIN_TOKEN`.

## Safety checks

- [ ] No API keys, tokens, partner PII, borrower PII, or lead PII in static files.
- [ ] No external overwrite of locked production fields.
- [ ] Failed syncs are visible to admin dashboard.
- [ ] Manual retries create audit-log-ready metadata.

## Local checks

```powershell
npm run typecheck
git grep -n "guaranteed approval\|everyone qualifies\|guaranteed commission"
```

## Endpoint smoke tests

```powershell
curl -H "Authorization: Bearer $env:PARTNER_INTAKE_ADMIN_TOKEN" `
  http://localhost:3000/api/admin/sync-status
```
