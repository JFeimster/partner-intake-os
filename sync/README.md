# Sync Layer — Sandbox Routing

Phase 25 adds the safe sandbox sync layer for Partner Intake OS.

## Purpose

Route classified partner records from the Partner Intake API into staging/review systems without creating uncontrolled production writes.

The sync layer supports:

- `mock` — no external calls; returns queued mock result.
- `notion` — Notion staging/review database sync.
- `hubspot` — HubSpot sandbox CRM/contact sync.
- `dual_sandbox` — Notion and HubSpot sandbox sync together.

## Critical warning

This phase is for sandbox/staging sync only.

Do not point this at a production Notion workspace or production HubSpot pipeline until:

1. Admin review flow is working.
2. Auth is protected.
3. Logging is redacted.
4. Duplicate handling is defined.
5. Property mapping has been tested.
6. Rollback is documented.

No secrets belong in this repo. No raw PII should be logged. No lead or partner should be treated as approved because a sync succeeded.

## Files

```text
/lib/storage/notion.ts
/lib/storage/hubspot.ts
/lib/storage/storage-router.ts
/lib/storage/sync-log.ts
/lib/storage/sync-types.ts
/sync/README.md
/sync/notion-sandbox-sync.md
/sync/hubspot-sandbox-sync.md
/sync/sync-routing-rules.md
/sync/sync-failure-handling.md
/sync/sample-sync-events.json
/tests/notion-hubspot-sandbox-sync-checklist.md
```

## Recommended first run

Use mock mode first:

```powershell
$env:PARTNER_INTAKE_STORAGE_MODE="mock"
$env:PARTNER_INTAKE_DRY_RUN="true"
```

Then test Notion dry-run:

```powershell
$env:PARTNER_INTAKE_STORAGE_MODE="notion"
$env:PARTNER_INTAKE_DRY_RUN="true"
$env:NOTION_API_KEY="secret_placeholder"
$env:NOTION_PARTNER_DATABASE_ID="database_placeholder"
```

Then HubSpot dry-run:

```powershell
$env:PARTNER_INTAKE_STORAGE_MODE="hubspot"
$env:PARTNER_INTAKE_DRY_RUN="true"
$env:HUBSPOT_ACCESS_TOKEN="secret_placeholder"
```

Then dual sandbox dry-run:

```powershell
$env:PARTNER_INTAKE_STORAGE_MODE="dual_sandbox"
$env:PARTNER_INTAKE_DRY_RUN="true"
```

## Env vars

```text
PARTNER_INTAKE_STORAGE_MODE=mock|notion|hubspot|dual_sandbox
PARTNER_INTAKE_DRY_RUN=true|false
NOTION_API_KEY=
NOTION_PARTNER_DATABASE_ID=
HUBSPOT_ACCESS_TOKEN=
HUBSPOT_PARTNER_PIPELINE_ID=
```

`PARTNER_INTAKE_DRY_RUN` defaults to `true`. Set it to `false` only during a supervised sandbox write test.

## Status outputs

The sync layer returns one of:

- `queued` — dry-run or mock event accepted for later review.
- `skipped` — target was not configured or mode does not apply.
- `synced` — target accepted the sandbox record.
- `failed` — target call failed or returned an error.
- `needs_review` — record should not sync automatically.

## Recommended integration point

After Phase 23 endpoint classification creates a partner profile, call:

```ts
import { routePartnerSync } from "../../lib/storage/storage-router";

await routePartnerSync({
  event_type: "partner_classified",
  source: "api",
  partner: classifiedPartner,
  scorecard,
  risk_flags,
  manual_review_required
});
```

Keep this behind storage mode and dry-run controls. The goal is boring reliability. Jazz hands are for marketing, not sync jobs.
