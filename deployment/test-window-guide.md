# Phase 22 — Vercel Deployment Test Window Guide

## Purpose

A deployment test window is a controlled period where Partner Intake OS is intentionally allowed to deploy, be tested against expected static and API routes, and then be locked back down.

This packet exists because the Partner Command Center repo is moving from static/demo assets toward live API, GPT Action, Tally webhook, and admin-review behavior. That is where cowboy deployment habits go to start fires. The goal is to open the gate, test the road, then shut the gate before the goats get into production.

## What this phase does

Phase 22 creates a deployment control process for:

- Static route checks.
- API route smoke tests.
- Vercel environment variable verification.
- GPT-facing endpoint readiness.
- Tally webhook reachability.
- Deployment rollback notes.
- Deployment lockdown after testing.

## What this phase does not do

This phase does **not**:

- Implement or repair API endpoints.
- Modify `vercel.json`.
- Create secrets.
- Connect production Notion or HubSpot.
- Expose the Tally webhook to GPT Actions.
- Turn preview or production deployments on permanently.

## When to open a deployment test window

Open a deployment test window only when all of these are true:

1. Phase 21 merge validation passed.
2. The repo branch intended for deployment is known.
3. Expected routes are documented.
4. Vercel environment variables are reviewed.
5. No real PII is being used in test payloads.
6. Rollback path is clear.
7. Someone is watching the deploy logs.

## Who should perform it

Recommended operator:

- Jason/admin owner.
- Technical reviewer if available.
- No outside partner access during the first live test.

## Test-window checklist

Before opening:

- Confirm branch.
- Confirm target Vercel project.
- Confirm deployment source.
- Confirm env vars are placeholders or real values entered through Vercel only.
- Confirm no secrets are committed.
- Confirm test data is fake.
- Confirm auto-deploy behavior is understood.

During the window:

- Deploy intentionally.
- Check build/deploy logs.
- Run static route smoke tests.
- Run API smoke tests.
- Check error responses.
- Test bad-auth behavior.
- Confirm Tally webhook is not listed in GPT Actions.
- Capture screenshots and log issues.

After testing:

- Record deployment status.
- Record failures.
- Roll back if needed.
- Lock deployment behavior back down if that is the current repo policy.
- Create issues for Phase 23 repairs.

## Accidental deployment prevention

Use this rule:

> No deploy window, no production deploy.

Practical controls:

- Do not merge deployment branches casually.
- Avoid pushing directly to `main`.
- Keep Vercel Git integration settings documented.
- Keep production environment variables separate from preview/development.
- Do not keep temporary test tokens in docs, screenshots, or shell history.
- Make PR descriptions explicitly state whether deployment should happen.

## Window close criteria

Close the window when one of these is true:

- All smoke tests pass.
- A blocker is found and logged.
- API endpoints need Phase 23 repair.
- Vercel environment variables are incomplete.
- Static pages are broken.
- Unexpected production behavior appears.

## Deployment status labels

Use these labels in notes/issues:

- `deploy-window-open`
- `static-pass`
- `api-pass`
- `auth-fail`
- `env-missing`
- `route-missing`
- `rollback-needed`
- `deploy-window-closed`

## Safety notes

- Do not test with real partner or borrower PII.
- Do not paste real API tokens into Markdown.
- Do not store Tally signing secrets in source control.
- Do not expose admin or webhook endpoints in GPT Actions.
- Keep funding language readiness-based and non-guaranteed.
