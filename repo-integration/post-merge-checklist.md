# Post-Merge Checklist

Use this after the Phase 21 PR is merged into `main`.

## Main branch pull

```powershell
git checkout main
git pull origin main
git status
```

- [ ] Main branch is current.
- [ ] Working tree is clean.
- [ ] Phase 21 files are present.

## Local server test

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/
http://localhost:8080/site/partner-intake/
http://localhost:8080/site/partner-intake/submit-lead.html
http://localhost:8080/site/partner-intake/tracking-link-builder.html
http://localhost:8080/site/partner-intake/admin/
```

- [ ] Root site still loads.
- [ ] Existing dashboard still loads.
- [ ] Partner Intake module paths load.
- [ ] Console is clean.

## Vercel deploy review

Do not assume deployment is live.

- [ ] Confirm Vercel auto-deploy behavior.
- [ ] Confirm whether deployment window is open or locked.
- [ ] Confirm no accidental production deployment occurred.
- [ ] Note current deployment URL if available.
- [ ] Do not start Phase 22 until requested.

## Static route review

- [ ] `/site/partner-intake/` route checked.
- [ ] Lead submission route checked.
- [ ] Tracking link builder route checked.
- [ ] Admin route checked.
- [ ] Mobile layout checked.
- [ ] Sample data only confirmed.

## API route smoke test

For Phase 21 only, do not expect new live API behavior.

Check current API docs/examples only:

- [ ] Existing `/api/README.md` still intact.
- [ ] Existing `.example.js` files still intact.
- [ ] No production API endpoint was introduced accidentally.
- [ ] No live webhook is exposed to GPT Actions.

Actual API repair begins in Phase 23.

## GPT Action schema review

- [ ] Existing OpenAPI docs/specs still intact.
- [ ] Partner Intake Action files are in `/actions/` if merged from prior batches.
- [ ] Tally webhook is not in GPT-facing OpenAPI.
- [ ] Bearer auth placeholders only.
- [ ] Operation IDs are consistent.

Actual live GPT Action import/repair begins in Phase 24.

## Notion/HubSpot setup status

- [ ] Notion setup docs present.
- [ ] HubSpot setup docs present.
- [ ] No real API keys committed.
- [ ] No production sync claimed.
- [ ] Sandbox/staging language is clear.

Actual sandbox sync begins in Phase 25.

## Issue creation for Phases 22–30

Create issues or checklist cards:

- [ ] Phase 22 — Vercel Deployment Test Window
- [ ] Phase 23 — API Endpoint Repair Against Live Vercel Routes
- [ ] Phase 24 — GPT Action Import/Test/Repair
- [ ] Phase 25 — Notion + HubSpot Real Sandbox Sync
- [ ] Phase 26 — Admin Auth and Protected Dashboard Route
- [ ] Phase 27 — Lead Submission API Implementation
- [ ] Phase 28 — Tracking Link API Implementation
- [ ] Phase 29 — End-to-End Tally → API → Review Queue Test
- [ ] Phase 30 — Internal Launch QA Packet

## Post-merge notes

```text
Merged PR:
Merge date:
Reviewer:
Deployment status:
Known issues:
Next phase:
```
