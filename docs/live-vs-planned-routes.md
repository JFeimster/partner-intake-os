# Live vs Planned Routes

Use this file before wiring Custom GPT Actions, Tally, dashboards, partner portal flows, or admin workflows.

Status values:

```text
live | stub | planned | docs-only | demo-only | deprecated
```

GPT Action safety values:

```text
yes | no | internal-only | future-only
```

| Route | Method | Status | Auth | GPT Action safe | Implementation file | Notes |
|---|---:|---|---|---|---|---|
| `/api/health` | GET | live | none | yes | `api/health.ts` | Safe health/status route. |
| `/api/partners/classify` | POST | live | Bearer `PARTNER_INTAKE_ACTION_TOKEN` | yes | `api/partners/classify.ts` | Core GPT-facing classification route. |
| `/api/partners/recommend-resources` | POST | stub | route-level auth needs normalization | yes, after auth QA | `api/partners/recommend-resources.ts` | Implemented resource output path; confirm auth consistency before live GPT import. |
| `/api/partners/generate-onboarding-plan` | POST | live | Bearer `PARTNER_INTAKE_ACTION_TOKEN` | yes | `api/partners/generate-onboarding-plan.ts` | Core GPT-facing onboarding plan route. |
| `/api/partners/generate-campaign-kit` | POST | stub | route-level auth needs normalization | yes, after auth QA | `api/partners/generate-campaign-kit.ts` | Implemented campaign kit path; confirm auth consistency before live GPT import. |
| `/api/partners/log-event` | POST | stub | Bearer `PARTNER_INTAKE_ACTION_TOKEN` | yes | `api/partners/log-event.ts` | Accepts/logs event response but does not persist. |
| `/api/tally/partner-intake-webhook` | POST | live inbound infrastructure | Tally signature when configured | no | `api/tally/partner-intake-webhook.ts` | Public Tally webhook. Never expose through GPT Actions. |
| `/api/leads/submit` | POST | live review-based | endpoint-specific validation; not production GPT import by default | no | `api/leads/submit.ts` | Lead received for review only. No approval/funding/lender outcome implied. |
| `/api/partners/submit-lead` | POST | deprecated/docs drift | n/a | no | none | Prior spec path drift. Canonical implemented path is `/api/leads/submit`. |
| `/api/tracking/create-link` | POST | stub | Bearer `PARTNER_INTAKE_ACTION_TOKEN` or `PARTNER_TRACKING_API_TOKEN` | no | `api/tracking/create-link.ts` | Generates deterministic tracking link but does not persist. |
| `/api/partners/create-tracking-link` | POST | deprecated/docs drift | n/a | no | none | Prior spec path drift. Canonical implemented path is `/api/tracking/create-link`. |
| `/api/tracking/log-event` | POST | stub | Bearer `PARTNER_INTAKE_ACTION_TOKEN` or `PARTNER_TRACKING_API_TOKEN` | no | `api/tracking/log-event.ts` | Accepts event but does not persist attribution. |
| `/api/partners/log-attribution-event` | POST | deprecated/docs drift | n/a | no | none | Prior spec path drift. Canonical implemented path is `/api/tracking/log-event`. |
| `/api/admin/review-queue` | GET | demo-only | admin auth/session helper | internal-only | `api/admin/review-queue.ts` | Protected route returning sample/demo review records only. |
| `/api/admin/*` | varies | planned/internal | admin auth required | internal-only | varies | Never expose admin routes through production partner/operator GPT Actions unless a separate internal admin GPT is intentionally configured. |
| `/api/sync/*` | varies | planned | service auth required | no | none or future files | Future storage/CRM sync routes. Not GPT import safe. |
| `/api/security/*` | varies | planned | service/admin auth required | no | none or future files | Future security/admin routes. Not GPT import safe. |

## Route naming decision

This sprint chooses **Option A — spec follows implementation**.

Canonical implemented paths:

```text
/api/leads/submit
/api/tracking/create-link
/api/tracking/log-event
```

Do not keep using the older planned/spec-only paths as canonical:

```text
/api/partners/submit-lead
/api/partners/create-tracking-link
/api/partners/log-attribution-event
```

Compatibility wrappers were not added in this sprint because that would create new route files and expand surface area. The safer stabilization move is to document route truth and keep the production GPT spec narrow.

## Hard safety flags

- Tally webhook = not GPT Action safe.
- Admin routes = not GPT Action safe.
- Planned routes = not production import safe.
- Docs-only routes = not implemented.
- Stub routes = implemented but not persisted.
- Static dashboard pages = not API routes.
- Sample fixtures = not production records.
