# Batch 31 Validation — Database + Audit Log Checklist

Use this checklist before applying the Batch 31 files to the live repo or a hosted Postgres database.

## File presence

- [ ] `database/README.md`
- [ ] `database/schema.sql`
- [ ] `database/migrations/001_initial_partner_intake.sql`
- [ ] `database/migrations/002_audit_log.sql`
- [ ] `database/seed/demo-partner-records.sql`
- [ ] `database/seed/demo-lead-records.sql`
- [ ] `lib/db/client.ts`
- [ ] `lib/db/partners.ts`
- [ ] `lib/db/leads.ts`
- [ ] `lib/db/events.ts`
- [ ] `lib/db/audit-log.ts`
- [ ] `api/admin/audit-log.ts`
- [ ] `api/partners/[partner_id].ts`

## SQL review

- [ ] SQL is Postgres-compatible.
- [ ] SQL avoids vendor-specific Supabase-only or Neon-only assumptions.
- [ ] `partners` table exists.
- [ ] `leads` table exists.
- [ ] `partner_events` table exists.
- [ ] `tracking_links` table exists.
- [ ] `tracking_events` table exists.
- [ ] `admin_review_items` table exists.
- [ ] `sync_jobs` table exists.
- [ ] `audit_log` table exists.
- [ ] Tables have `created_at` where relevant.
- [ ] Mutable tables have `updated_at` where relevant.
- [ ] `set_updated_at()` trigger function exists.
- [ ] Audit log update/delete prevention triggers exist.
- [ ] `write_audit_log(...)` append-only insert function exists.

## Safety review

- [ ] No real partner PII is present in seed files.
- [ ] No real borrower/lead PII is present in seed files.
- [ ] No API keys, tokens, or secrets are present.
- [ ] Audit metadata rules exclude raw sensitive borrower data.
- [ ] Admin audit endpoint is not exposed to GPT Actions.
- [ ] Tally webhook endpoint remains separate from GPT Actions.

## Environment variables

- [ ] `DATABASE_URL` is configured only in local/Vercel environment settings.
- [ ] `PARTNER_INTAKE_STORAGE_MODE=postgres` is set only when testing the DB layer.
- [ ] `PARTNER_INTAKE_ADMIN_TOKEN` is configured before production admin endpoint use.
- [ ] `.env` is not committed.

## Local database smoke test

Run against a disposable local database first:

```powershell
psql $env:DATABASE_URL -f database/migrations/001_initial_partner_intake.sql
psql $env:DATABASE_URL -f database/migrations/002_audit_log.sql
psql $env:DATABASE_URL -f database/seed/demo-partner-records.sql
psql $env:DATABASE_URL -f database/seed/demo-lead-records.sql
```

Then verify:

```sql
SELECT COUNT(*) FROM partners;
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM partner_events;
SELECT COUNT(*) FROM audit_log;
SELECT write_audit_log('system', NULL, 'smoke_test', 'system', NULL, 'manual_test', NULL, NULL, NULL, NULL, '{"safe":true}'::JSONB);
```

Attempted mutation should fail:

```sql
UPDATE audit_log SET action = 'edited' WHERE audit_id = (SELECT audit_id FROM audit_log LIMIT 1);
DELETE FROM audit_log WHERE audit_id = (SELECT audit_id FROM audit_log LIMIT 1);
```

Expected result: both mutation commands fail because `audit_log` is immutable.

## TypeScript review

- [ ] `lib/db/client.ts` does not connect at import time.
- [ ] Dynamic `pg` import is used.
- [ ] DB helpers require `PARTNER_INTAKE_STORAGE_MODE=postgres`.
- [ ] Audit writes call `write_audit_log`.
- [ ] Audit metadata filter blocks obvious sensitive keys.
- [ ] API files return JSON errors instead of leaking stack traces.

## Deployment notes

- [ ] Install `pg` before using DB helpers:
  ```powershell
  npm install pg
  npm install -D @types/pg
  ```
- [ ] Confirm Vercel Functions can bundle dynamic `pg` import.
- [ ] Add RBAC from Batch 33 before production admin usage.
- [ ] Keep the database source of truth in Postgres, not GitHub.
