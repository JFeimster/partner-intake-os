# Root Folder Audit

## Purpose

Use this checklist before merging Batches 13–20 into `partner-command-center`.

This is a repo placement audit, not a feature QA pass.

## Connector snapshot

GitHub connector access confirmed the target repo is:

```text
JFeimster/partner-command-center
default branch: main
visibility: public
```

Current repo signals observed during connector inspection:

- Static-first architecture is already documented.
- Existing `/api/` files appear to be example-only serverless/API files.
- Existing `/admin/` files appear to be a static admin prototype.
- Existing `/integrations/` files include OpenAPI/GPT/Tally/Notion/CRM-style documentation.
- No direct `/site/partner-intake/` results were found by connector search at the time of this packet.
- `vercel.json` is documented as part of target structure, but connector search should be rechecked locally before merging.

## Audit: `/github/`

- [ ] Folder exists or will be created.
- [ ] Contains PR checklist or repo integration packet only.
- [ ] Does not duplicate `/repo-integration/` docs unless intentionally cross-linked.
- [ ] No secrets.
- [ ] No project-name spam in filenames.

Notes:

```text
```

## Audit: `/deployment/`

- [ ] Folder exists or will be created.
- [ ] Contains deployment docs, Vercel checklist, and config notes.
- [ ] Does not include real Vercel tokens.
- [ ] Does not accidentally enable auto-deploys.
- [ ] `vercel.json` handled separately and reviewed before merge.

Notes:

```text
```

## Audit: `/actions/`

- [ ] Folder exists or will be created.
- [ ] Contains GPT Action OpenAPI specs and setup docs.
- [ ] Does not expose `/api/tally/partner-intake-webhook`.
- [ ] Uses Bearer auth placeholders only.
- [ ] Uses clear operation IDs.

Notes:

```text
```

## Audit: `/notion/`

- [ ] Folder exists or will be created.
- [ ] Contains setup packet, property map, database checklist.
- [ ] No real Notion API keys.
- [ ] No real partner PII.
- [ ] Staging/review language is clear.

Notes:

```text
```

## Audit: `/hubspot/`

- [ ] Folder exists or will be created.
- [ ] Contains property/pipeline setup docs.
- [ ] No real HubSpot access tokens.
- [ ] No production write claims.
- [ ] Safe sandbox-first sync language.

Notes:

```text
```

## Audit: `/lead-submission/`

- [ ] Folder exists or will be created.
- [ ] Contains module docs, schemas, payload examples.
- [ ] Does not claim leads are approved, pre-approved, qualified, or guaranteed.
- [ ] Consent handling is documented.
- [ ] Future CRM sync hooks are noted but not overpromised.

Notes:

```text
```

## Audit: `/tracking/`

- [ ] Folder exists or will be created.
- [ ] Contains tracking link builder docs/contracts.
- [ ] Uses deterministic demo links if implementation exists.
- [ ] Does not call external shortlink APIs unless future phase explicitly adds that.
- [ ] Does not track sensitive personal data.

Notes:

```text
```

## Audit: `/admin-review/`

- [ ] Folder exists or will be created.
- [ ] Contains admin review dashboard docs/packets.
- [ ] Uses mock/sample queue data only.
- [ ] Does not imply real auth is complete.
- [ ] Clear manual review rules.

Notes:

```text
```

## Audit: `/site/partner-intake/`

- [ ] Folder exists or will be created.
- [ ] Contains module-specific static dashboard files.
- [ ] Plain HTML/CSS/JS only.
- [ ] No build step.
- [ ] Uses relative links.
- [ ] Does not interfere with root `dashboard.html`.

Required paths:

```text
/site/partner-intake/
/site/partner-intake/submit-lead.html
/site/partner-intake/tracking-link-builder.html
/site/partner-intake/admin/
```

Notes:

```text
```

## Audit: `/site/partner-intake/admin/`

- [ ] Folder exists or will be created.
- [ ] Static MVP only unless later phase adds admin auth.
- [ ] No real partner PII in sample data.
- [ ] Route can be tested locally.
- [ ] Future Phase 26 auth hardening noted.

Notes:

```text
```

## Audit: `/tests/`

- [ ] Folder exists or will be created.
- [ ] Contains pass/fail checklists.
- [ ] Does not require production credentials.
- [ ] Clear manual test owner and date fields.
- [ ] Includes no-secrets/no-PII checks.

Notes:

```text
```

## Audit: `/scripts/`

- [ ] Folder exists.
- [ ] Validation script added.
- [ ] Script is non-destructive.
- [ ] Script prints pass/fail results.
- [ ] Script does not call external services or expose credentials.

Notes:

```text
```

## Merge readiness score

Score each area:

```text
0 = missing or blocked
1 = present but needs cleanup
2 = ready to merge
```

| Area | Score | Notes |
|---|---:|---|
| GitHub packet |  |  |
| Deployment packet |  |  |
| Actions packet |  |  |
| Notion packet |  |  |
| HubSpot packet |  |  |
| Lead submission packet |  |  |
| Tracking packet |  |  |
| Admin review packet |  |  |
| Static routes |  |  |
| Tests |  |  |
| Scripts |  |  |
