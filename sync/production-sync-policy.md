# Production Sync Policy

Batch 39 upgrades sandbox Notion and HubSpot sync into a production-ready policy.

## Source-of-truth hierarchy

1. **Postgres / Supabase / Neon** — production source of truth.
2. **HubSpot** — CRM and sales execution layer.
3. **Notion** — staging, review, and operator workspace.
4. **GitHub** — source code, docs, schemas, and sample payloads only.
5. **Tally** — intake source.
6. **Vercel** — API/runtime layer.
7. **Custom GPT Actions** — safe partner-ops interface.

## Sync principles

- Never treat Notion or HubSpot as the canonical record when the database has a newer locked field.
- Never overwrite live data without field-level source-of-truth rules.
- Sync jobs must be idempotent.
- Sync jobs should write status updates back to `sync_jobs` and audit-log events.
- Failed syncs should be visible to admins before retry escalation becomes automation spaghetti with a badge.

## Allowed sync directions

| Data type | Canonical source | HubSpot | Notion |
|---|---|---|---|
| Partner identity | Database | Mirror for CRM | Mirror for review |
| Review status | Database | Mirror selected fields | Mirror full operator context |
| CRM owner | HubSpot, if field unlocked | Canonical when locked to CRM | Read-only mirror |
| Operator notes | Database | Optional summary only | Mirror for review |
| Compliance flags | Database | Mirror high-level flag only | Mirror detailed queue |
| Sync status | Database | No | Optional dashboard view |

## Prohibited behavior

- Do not push borrower PII into Notion unless explicitly approved by policy.
- Do not write API keys, session data, tokens, webhook secrets, or audit logs to external tools.
- Do not overwrite `partner_tier`, `risk_level`, or `review_status` from HubSpot or Notion without an admin decision.
- Do not imply funding, approval, lender review, commissions, income, or outcome certainty in synced notes.

## Minimum sync-job fields

- `sync_job_id`
- `record_type`
- `record_id`
- `target_system`
- `operation`
- `status`
- `attempt_count`
- `last_error`
- `next_retry_at`
- `created_at`
- `updated_at`

## Recommended rollout

1. Read-only sync status dashboard.
2. Manual retry endpoint.
3. Safe one-way DB → Notion review workspace.
4. Safe one-way DB → HubSpot CRM properties.
5. Conflict review queue.
6. Limited two-way locked fields only after operators trust it.
