# Admin Review Dashboard

The admin review dashboard is the internal control room for Partner Intake OS. It helps the operator review partner intakes, triage risk flags, confirm partner tiers, assign onboarding paths, review lead submission readiness, inspect tracking-link context, and decide the next action before anything gets pushed deeper into the Partner Command Center workflow.

## Who uses it

Primary users:

- Jason/admin
- Partner operations team
- Internal reviewers
- Future CRM or automation operators

This is not a public partner page. It is not a lender decisioning tool. It is an internal review layer for partner operations.

## How it connects

Current and future flow:

1. Tally receives partner signup.
2. Vercel webhook normalizes the intake.
3. Partner Intake OS scoring/classification logic produces a partner profile, scorecard, risk flags, and recommended next action.
4. Notion or HubSpot stores the staging/review record.
5. The admin dashboard reads review-ready records.
6. Admin approves, rejects, watchlists, requests more info, assigns resources, or sends to onboarding.
7. Future API actions sync the final decision back to HubSpot, Notion, Google Sheets, or the authenticated dashboard.

## What is static/demo now

The current `/site/partner-intake/admin/` dashboard is a static MVP. It loads `data/sample-review-queue.json` locally and simulates admin actions in the browser only.

It does not:

- authenticate users
- write to HubSpot
- write to Notion
- approve real partners
- send emails
- create real CRM tasks
- store real PII

## What becomes authenticated later

Future version should include:

- authenticated admin access
- role-based permissions
- audit logs
- API-backed review queue
- HubSpot/Notion sync
- action history
- secure partner record lookup
- decision logging

## PII and security warning

Do not commit real partner data, applicant data, private notes, API keys, signing secrets, access tokens, service-account keys, or raw webhook payloads. Use sanitized samples only.

Keep the Tally webhook endpoint separate from GPT Actions. GPT-facing Actions should use Bearer auth and only expose safe partner operations.
