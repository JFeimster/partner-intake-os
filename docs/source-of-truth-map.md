# Source-of-Truth Map

Partner Intake OS should behave like a controlled partner-ops pipeline, not a pile of files pretending to be a database.

## System ownership map

| System | Source-of-truth role | What belongs there | What does not belong there |
|---|---|---|---|
| GitHub | Source code, docs, schemas, specs, static demo files | API code, OpenAPI specs, JSON schemas, GPT instructions, setup docs, sample fixtures, static dashboard source | Live partner records, borrower/lead PII, secrets, admin sessions, private notes, audit logs, approval decisions, commission data |
| Vercel | API/runtime layer | Serverless route execution, webhook receiver, GPT Action endpoints, environment-variable-backed runtime behavior | Permanent system-of-record data unless connected to approved storage |
| Tally | Intake source | Partner signup form and inbound webhook submissions | GPT Action surface, live database, admin review system |
| Postgres/Supabase/Neon | Future production source of truth | Partner records, event/audit logs, lead intake records, attribution records, review decisions, sync state | Static demo fixtures, public repo content |
| HubSpot | CRM/sales execution layer | Contacts, companies, deals/pipeline stages, tasks, partner sales workflows | Raw webhook payload dumps, secrets, unauthorized PII exports |
| Notion | Review/ops workspace | Partner review queues, operator notes, onboarding checklists, lightweight ops dashboards | Auth/session secrets, raw sensitive payload logs, guaranteed-outcome claims |
| Google Sheets | Optional reporting/export layer | Lightweight exports, QA review sheets, non-sensitive operational reporting | Primary production database, secrets, sensitive raw payload archives |
| Custom GPT Actions | Safe operator interface | Classification, recommendations, onboarding plans, campaign kits, safe event logging | Tally webhook, admin endpoints, raw storage mutation, secret management |
| Partner Dashboard | Display/workflow layer | Partner/admin UI, review cards, onboarding status, resource/campaign display | Secrets, admin sessions in browser storage, live PII in static JSON |

## Canonical GPT files

Canonical concise GPT filenames are:

```text
gpt/instructions.md
gpt/profile.md
gpt/output-formats.md
gpt/conversation-starters.md
```

Legacy aliases that may remain for historical continuity:

```text
gpt/partner-intake-os.instructions.md
gpt/partner-intake-os.profile.md
gpt/partner-intake-os.output-formats.md
gpt/partner-intake-os.conversation-starters.md
```

Use the concise files going forward. Do not delete the legacy aliases unless the repo owner explicitly requests cleanup.

## Route truth

Canonical implemented route paths are documented in:

```text
docs/live-vs-planned-routes.md
```

Key route naming decisions:

- Canonical lead submission path: `/api/leads/submit`
- Canonical tracking link path: `/api/tracking/create-link`
- Canonical tracking event path: `/api/tracking/log-event`
- Production GPT import routes: only the six safe routes in `actions/openapi.production.yaml`

## Non-negotiables

- Do not store live partner records in GitHub.
- Do not store borrower/lead PII in static JSON.
- Do not store secrets or sessions in `localStorage`.
- Do not treat sample fixtures as production records.
- Do not expose the Tally webhook endpoint to GPT Actions.
- Do not expose admin endpoints to partner-facing or production operator GPT Actions unless a separate internal admin Action pack is intentionally built.
- Do not treat GitHub as the live partner database.

## Sample data policy

Static data under `/site/partner-intake/data/` and fallback records in dashboard scripts are demo fixtures only. They can support UI testing, but they are not partner records, CRM records, audit logs, or production review data.

## Future production storage

Production datastore and audit log work belongs to the numbered production roadmap. This hardening sprint does not create the Batch 31 production datastore or audit log foundation.
