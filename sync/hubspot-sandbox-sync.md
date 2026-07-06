# HubSpot Sandbox Sync

## Role of HubSpot

HubSpot is the CRM/task pipeline layer for Partner Intake OS.

Use it for:

- Partner contact records.
- Partner task follow-up.
- Review pipeline stages.
- Internal operator workflow.

Do not use this phase for production partner activation, commission tracking, lender status, or automated outreach.

## Required env vars

```text
PARTNER_INTAKE_STORAGE_MODE=hubspot
PARTNER_INTAKE_DRY_RUN=true
HUBSPOT_ACCESS_TOKEN=
HUBSPOT_PARTNER_PIPELINE_ID=
```

For dual target testing:

```text
PARTNER_INTAKE_STORAGE_MODE=dual_sandbox
```

## Required private app scopes

Minimum practical sandbox scopes depend on your HubSpot object strategy, but for this Phase 25 contact-only sync, expect contact CRM write access.

Suggested sandbox-only starting point:

- CRM contacts read/write.
- CRM properties read.
- CRM objects read/write if custom objects are later used.

## Contact property mapping

The TypeScript mapping sends standard contact fields plus Partner Intake OS custom properties.

Standard fields:

| Property | Purpose |
|---|---|
| `email` | Contact identifier |
| `firstname` | Contact first/display fallback |
| `lastname` | Contact fallback |
| `company` | Company/brand |
| `phone` | Optional phone |

Custom fields expected later:

| Property | Purpose |
|---|---|
| `partner_id` | Stable Partner Intake OS ID |
| `partner_type` | Classification |
| `partner_tier` | Tier recommendation |
| `onboarding_path` | Partner onboarding path |
| `primary_audience` | Audience served |
| `risk_level` | Risk level |
| `partner_status` | Review/activation status |
| `partner_source` | Intake source |
| `next_action` | Operator action |
| `manual_review_required` | Review flag |
| `intake_event_type` | Sync event type |
| `intake_event_source` | Source system |

Create missing HubSpot custom properties before non-dry-run testing. Otherwise HubSpot will reject the payload. The robot is literal; it does not “know what you meant.”

## Dry-run first

Expected dry-run result:

```json
{
  "status": "queued",
  "target": "hubspot",
  "dry_run": true,
  "message": "Dry-run HubSpot sandbox sync queued. No HubSpot contact was created."
}
```

## Write test

Only after property mapping and private app scopes are confirmed:

```powershell
$env:PARTNER_INTAKE_DRY_RUN="false"
```

Submit one fake test partner. Verify:

- Contact appears in sandbox HubSpot.
- Custom fields map correctly.
- Risk/manual review partners do not auto-sync as normal active partners.
- No sensitive notes or raw payloads are written.

## Duplicate handling

Phase 25 does not perform dedupe search/update. It creates a minimal sync path only.

Before production, add:

1. Search by `partner_id`.
2. Fallback search by email.
3. Update existing contact instead of creating duplicates.
4. Immutable activity event logging.
5. Admin review for mismatched duplicate records.

## Failure handling

If HubSpot returns duplicate/contact/property errors, do not patch around it with garbage fields. Fix the property mapping and rerun dry-run first.
