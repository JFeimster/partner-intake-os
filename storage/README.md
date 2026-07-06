# Storage Connectors

Batch 06 creates the storage routing layer for Partner Intake OS.

This layer gives the Vercel API a clean place to send normalized partner records after intake, classification, resource routing, and admin review. It is intentionally safe by default: mock and JSON storage work locally; Notion, HubSpot, and Google Sheets are scaffolded with field mapping and dry-run outputs until you add tested live API calls.

## What this batch adds

```txt
/lib/storage/notion.ts
/lib/storage/hubspot.ts
/lib/storage/google-sheets.ts
/lib/storage/json-store.ts
/lib/storage/storage-router.ts
/storage/README.md
/storage/notion-database-fields.md
/storage/hubspot-properties.md
/storage/google-sheets-columns.md
/storage/sample-partner-record.json
```

## Supported storage modes

Set `PARTNER_INTAKE_STORAGE_MODE` to one of these values:

| Mode | Use case | Behavior |
|---|---|---|
| `mock` | Local testing and GPT Action dry runs | In-memory only; resets with runtime |
| `json` | Local fixture testing | Writes to `/tmp/partner-intake-os-store.json` by default |
| `notion` | Partner staging database | Dry-run scaffold unless extended with tested Notion API calls |
| `hubspot` | CRM contact/company/deal workflow | Dry-run scaffold unless extended with tested HubSpot API calls |
| `google_sheets` | Lightweight ops sheet / QA review | Dry-run scaffold unless extended with tested Sheets API calls |

## Required environment variables

Core env vars already introduced in Batch 05:

```txt
PARTNER_INTAKE_ACTION_TOKEN=
TALLY_SIGNING_SECRET=
PARTNER_INTAKE_ENV=development
PARTNER_INTAKE_STORAGE_MODE=mock
```

Batch 06 storage env vars:

```txt
NOTION_API_KEY=
NOTION_PARTNER_DATABASE_ID=
HUBSPOT_ACCESS_TOKEN=
HUBSPOT_PARTNER_PIPELINE_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_SHEET_ID=
```

Optional local JSON env vars:

```txt
PARTNER_INTAKE_JSON_STORE_PATH=/tmp/partner-intake-os-store.json
PARTNER_INTAKE_JSON_STORE_DISABLE_FILE=false
```

Optional safety switch for future live writes:

```txt
PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES=false
```

Keep this `false` until the connector is explicitly upgraded and tested. No surprise writes. No mystery CRM confetti cannon.

## Recommended MVP storage path

Use this order:

1. `mock` for local Vercel API testing.
2. `json` for saved local examples and schema validation.
3. `notion` for partner staging database once fields are created.
4. `hubspot` once you want CRM lifecycle ownership.
5. `google_sheets` for simple audit/export workflows or low-code automations.

## Router usage

Example usage inside a future endpoint or API handler:

```ts
import { createPartnerRecord, logPartnerEvent } from "../lib/storage/storage-router";

await createPartnerRecord(profile);

await logPartnerEvent({
  partner_id: profile.partner_id,
  event_type: "classification_completed",
  event_source: "api",
  summary: "Partner classified and stored.",
  status: "closed",
  created_by: "partner-intake-api"
});
```

## Safety rules

- Do not store API keys in source files.
- Do not store live partner PII in GitHub.
- Do not use GitHub as the live partner database.
- Do not log full webhook payloads with unnecessary PII.
- Keep partner approval human-reviewed until the scoring/risk workflow proves itself.
- Keep funding language readiness-based. No guaranteed approvals, no guaranteed funding amounts, no fake lender certainty, no credit repair claims.

## Production notes

For production storage, prefer Notion or HubSpot first. Google Sheets is fine for ops visibility, but it becomes duct tape with a grid if you ask it to behave like a CRM. Use it for review queues, exports, and simple workflows—not as the final partner brain.
