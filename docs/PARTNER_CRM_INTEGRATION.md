# Canonical Partner CRM integration — platform-core
Supabase project: `loaowmappekunngjknnx`. Canonical tables: `partner_applications`, `partner_intake_events`, `partner_follow_up_tasks`; existing `partners`, `referrals`, `tracking_links` remain unchanged.

Authenticated ingestion: `https://loaowmappekunngjknnx.supabase.co/functions/v1/partner-crm-ingest`.
Set `PARTNER_CRM_INGEST_URL` and `PARTNER_CRM_INGEST_TOKEN` **only in server-side Vercel environment**. In Supabase Edge Functions secrets set `PARTNER_CRM_INGEST_TOKEN` to the same value and `PARTNER_CRM_ORG_ID` to the intended organization UUID. Do not put the token in public JS or `NEXT_PUBLIC_*` variables. No live intake will be accepted until configured. Existing intake routes remain primary until successfully migrated.

Normalized POST body:
```json
{"source":"tally","submission_id":"source-event-id","email":"person@example.com","name":"Applicant Name","agency_name":"","applicant_type":"individual","form_id":"mOe658","answers":{}}
```
The endpoint requires a Bearer token, uses source and submission id for dedupe, records an intake event, and returns an application id. Funding borrower forms should **not** be sent here. Partner approval and public publication must remain operator-only; unauthenticated applicants cannot approve themselves.

Use the canonical API as the source of truth; HubSpot, Notion and Google Sheets are downstream adapters. Preserve the existing frontends and working routes. Do not pretend this connection is live before secrets and webhook/relay configuration are in place.
\nThis is currently a static MVP: introduce a server-side relay before wiring submitted data.\n