# Repo Hardening Sprint 00 Checklist

Use this checklist to review the Source-of-Truth Repair PR before merge.

## Source-of-truth docs

- [ ] Root `README.md` describes the full repo, not only the static dashboard.
- [ ] `STATUS.md` clearly labels live, stub, planned, docs-only, demo-only, and deprecated areas.
- [ ] `docs/source-of-truth-map.md` states GitHub is source/docs/specs only, not live partner storage.
- [ ] `docs/live-vs-planned-routes.md` maps implemented and planned route truth.
- [ ] `docs/openapi-import-guide.md` explains which OpenAPI file to import into the production GPT.

## OpenAPI safety

- [ ] `actions/openapi.production.yaml` includes only six production-safe GPT routes.
- [ ] `actions/openapi.yaml` mirrors production-safe import behavior.
- [ ] Production specs do not include `/api/tally/`, `/api/admin/`, `/api/leads/`, `/api/tracking/`, `/api/sync/`, or `/api/security/`.
- [ ] Production specs do not include confusing `Lead Submission` or `Admin Review` tags.
- [ ] Partner/admin/dev specs are not used for production Custom GPT import.
- [ ] Placeholder server URLs are replaced only when ready for live GPT import.

## Route truth

- [ ] Canonical lead submission path is documented as `/api/leads/submit`.
- [ ] Canonical tracking link path is documented as `/api/tracking/create-link`.
- [ ] Canonical tracking event path is documented as `/api/tracking/log-event`.
- [ ] Older `/api/partners/submit-lead`, `/api/partners/create-tracking-link`, and `/api/partners/log-attribution-event` paths are marked deprecated/docs drift.

## GPT file naming

- [ ] Canonical concise GPT files exist:
  - [ ] `gpt/instructions.md`
  - [ ] `gpt/profile.md`
  - [ ] `gpt/output-formats.md`
  - [ ] `gpt/conversation-starters.md`
- [ ] Legacy `gpt/partner-intake-os.*.md` files are documented as legacy aliases.
- [ ] Legacy files are not deleted in this sprint.

## Webhook safety

- [ ] `docs/tally-webhook-safety.md` states Tally webhook is not a GPT Action.
- [ ] `TALLY_SIGNING_SECRET` requirement is documented.
- [ ] Raw-body signature limitation is documented.
- [ ] No raw Tally payload logging with PII is introduced.

## Static dashboard safety

- [ ] Main dashboard script avoids obvious data-driven `innerHTML` rendering.
- [ ] `docs/static-dashboard-safety.md` warns against raw `innerHTML` with API/user data.
- [ ] `localStorage` is not used for sensitive values.
- [ ] Static JSON and fallback data are labeled sample/demo only.

## Validation

- [ ] `package.json` exists.
- [ ] `tsconfig.json` exists.
- [ ] `scripts/validate-json.mjs` exists.
- [ ] `scripts/validate-openapi.mjs` exists.
- [ ] `npm install` completes.
- [ ] `npm run validate` completes, allowing placeholder URL warnings.

## Deployment safety

- [ ] `vercel.json` keeps `git.deploymentEnabled` set to `false`.
- [ ] Deployment readiness notes exist in `docs/deployment-readiness.md`.
- [ ] No production deployment setting is changed by this sprint.

## Compliance guardrails

- [ ] No new copy claims guaranteed approval, guaranteed funding, guaranteed commissions, instant approval, everyone qualifies, or guaranteed outcomes.
- [ ] Review-safe language is preserved.
- [ ] No secrets or sensitive data are committed.

## Stop condition

- [ ] This sprint is not named Batch 31.
- [ ] No new production database or audit-log files are created.
- [ ] The numbered roadmap resumes only after the user says `Continue Batch 31`.
