# Static Dashboard Safety

The static dashboard under `/site/partner-intake/` is useful for UI proof, but it must stay clearly separated from production records and authenticated workflows.

## Current dashboard status

| Area | Status | Notes |
|---|---|---|
| `/site/partner-intake/` | demo-only | Loads local sample JSON files. |
| `/site/partner-intake/admin/` | demo/sample protected shell | Uses `/api/admin/review-queue` and static fallback fixture. |
| `/site/partner-intake/admin-v2/` | demo/planned shell | Future API module surface; fallback/mock data only. |
| `/site/partner-intake/portal/` | planned/demo shell | Partner portal pages are not proof of production partner auth. |

## Rendering rules

Static demo data can be tolerated temporarily. API-backed or user-provided data should not be rendered with raw `innerHTML`.

Prefer:

- `textContent`
- DOM creation helpers
- `replaceChildren()`
- well-reviewed sanitization if HTML is truly needed

Avoid:

- raw `innerHTML` with API data
- string templates that interpolate partner, lead, borrower, or admin values
- storing sensitive state in browser storage

## localStorage rules

Do not store sensitive values in `localStorage`, including:

- API keys or tokens
- admin sessions
- partner PII
- borrower or lead PII
- contact records
- private notes
- audit logs
- approval/rejection decisions
- commission or payout data

If browser persistence is needed for a demo, keep it non-sensitive and label it as demo-only.

## Admin data rules

- Do not expose real admin review data publicly.
- Do not place production partner records in static JSON.
- Admin routes should use HTTP-only cookie/session patterns or server-side auth.
- API/admin responses should use no-store headers.
- Fallback records must stay obviously fake/sample.

## Patch note from Repo Hardening Sprint 00

The main dashboard script was repaired to avoid obvious data-driven `innerHTML` use for score rows, timeline items, resource cards, and campaign cards.

The older admin shell still uses escaped HTML construction in one render function, and admin-v2 contains fallback-safe shell rendering. Before production API-backed admin use, replace these with DOM construction helpers too. The demo goblin is fenced, not domesticated. 🧌
