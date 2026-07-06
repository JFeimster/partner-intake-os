# Preview and Production Deployment Rules

Partner Intake OS should deploy like a controlled system, not a piñata at a lender convention.

## Recommended preview deployment policy

Use preview deployments for:

- Testing static dashboard changes.
- Testing endpoint routing.
- Testing environment variable presence.
- Testing GPT Action server URL changes before production.
- Testing Tally webhook with test forms only.

Avoid preview deployments for:

- Real partner PII.
- Real Tally production webhook traffic.
- Live HubSpot/Notion writes unless intentionally configured.
- Public launch testing without auth.

Recommended preview env values:

```bash
PARTNER_INTAKE_ENV=preview
PARTNER_INTAKE_STORAGE_MODE=mock
```

## Recommended production deployment policy

Use production only after:

- API health endpoint passes.
- Protected endpoints reject missing/bad tokens.
- Protected endpoints accept correct token.
- Tally webhook test returns 2XX.
- OpenAPI server URL is updated.
- GPT Action tests pass.
- No real secrets are committed.
- Static dashboard does not expose real partner records.

Recommended production env values:

```bash
PARTNER_INTAKE_ENV=production
PARTNER_INTAKE_STORAGE_MODE=mock
```

Switch storage mode away from `mock` only after the destination storage setup is complete.

## Disabling or limiting auto-deploys

This batch includes a conservative root `vercel.json` with:

```json
"git": {
  "deploymentEnabled": false
}
```

Intent:

- Prevent surprise Git-triggered deployments.
- Force controlled/manual deployment windows.
- Avoid accidental production updates while API routes, webhook auth, and GPT Actions are being tested.

Important: verify the Vercel dashboard project settings after committing. Project-level Git/deployment settings may also need review. Treat the config file as repo-level guardrails, not a substitute for dashboard verification.

## Branch control recommendations

Recommended branch names:

```text
batch-14-vercel-deployment-config
deployment/vercel-config
chore/batch-14-vercel-config
```

Branch policy:

- Keep Batch 14 separate.
- Do not include Batch 15 validation files.
- Do not mix UI/dashboard additions into this PR.
- Do not edit OpenAPI files unless only documenting server URL instructions.
- Do not commit secrets.

## Manual deploy workflow

When auto deployments are disabled:

1. Merge PR only after checklist passes.
2. Confirm env vars in Vercel.
3. Trigger deployment manually from Vercel dashboard or CLI.
4. Watch deployment logs.
5. Run smoke tests.
6. Update GPT Action server URL only after deployment domain is verified.

CLI pattern:

```powershell
vercel --prod
```

Only run this from the intended repo root.

## Safety warning

Never point a test Tally form with fake data at a production webhook that writes into live CRM without review.

Never point a production Tally form at a preview domain if the preview environment logs verbose data.

Never expose `/api/tally/partner-intake-webhook` through GPT Actions. GPT Actions should use only the safe partner endpoints.
