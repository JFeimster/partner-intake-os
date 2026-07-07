# Batch 31 — Production Data Store + Audit Log Foundation

This folder introduces the production-ready data foundation for Partner Intake OS.

The goal is not to connect this chat to production. The goal is to provide Postgres-compatible SQL, seed files, database access helpers, and audit-log-safe API stubs that can be reviewed, copied into the repo, and executed later through your normal migration process.

## Source-of-truth hierarchy

Use this hierarchy for production behavior:

1. **Postgres-compatible database** — production source of truth.
   - Supabase, Neon, Railway Postgres, Render Postgres, or another Postgres provider can work.
   - This batch does not require any vendor-specific feature.
2. **HubSpot** — CRM and sales execution layer.
3. **Notion** — staging, review, and operator workspace.
4. **Google Sheets / JSON registry** — optional export or light ops support, not the source of truth.
5. **GitHub** — source code, docs, schemas, examples, and tests only.
6. **Tally** — intake source.
7. **Vercel** — API/runtime layer.
8. **Custom GPT Actions** — safe partner-ops interface.

## What this batch creates

- `partners`
- `leads`
- `partner_events`
- `tracking_links`
- `tracking_events`
- `admin_review_items`
- `sync_jobs`
- `audit_log`

It also creates a Postgres function-based audit insert pattern:

- Use `write_audit_log(...)` to append audit entries.
- Do not update or delete audit entries.
- `audit_log` has triggers that block update/delete operations.

## No raw sensitive data rule

Do **not** store raw sensitive borrower data in the audit log.

Allowed in `audit_log.metadata`:

- entity IDs
- field names changed
- previous status / next status
- non-sensitive operational reason codes
- source system names
- request IDs
- hashes of payloads
- reviewer/admin IDs

Not allowed in `audit_log.metadata`:

- borrower SSNs
- bank account numbers
- full DOB
- full credit reports
- bank statements
- tax documents
- API keys
- session tokens
- HubSpot / Notion / Tally secrets
- private borrower notes
- full lead intake payloads containing PII

If a payload needs to be referenced, store a payload hash and the safe entity ID instead. The audit log is the security camera, not the evidence locker.

## Required environment variables

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
PARTNER_INTAKE_STORAGE_MODE="postgres"
```

Optional but recommended for admin/API hardening in later batches:

```bash
PARTNER_INTAKE_ENV="development"
PARTNER_INTAKE_ADMIN_TOKEN="replace-with-server-side-secret"
```

Do not store tokens in browser localStorage. Do not commit `.env` files.

## Local review workflow

1. Read `database/schema.sql`.
2. Read migrations in order.
3. Review seed data.
4. Review TypeScript DB helpers.
5. Run SQL in a local disposable Postgres database first.
6. Only then promote into Supabase/Neon through your controlled migration process.

## Migration order

1. `database/migrations/001_initial_partner_intake.sql`
2. `database/migrations/002_audit_log.sql`
3. Optional seed files:
   - `database/seed/demo-partner-records.sql`
   - `database/seed/demo-lead-records.sql`

## Safety notes

- These files do not connect to production automatically.
- The TypeScript client only runs a DB query when an API/helper function calls it.
- `PARTNER_INTAKE_STORAGE_MODE` must be set to `postgres` before DB helpers execute.
- Admin endpoints should be protected by the RBAC/session layer from Batch 33 once that batch is installed.
- Do not expose admin endpoints to GPT Actions.
