# Rollback Plan

Rollback is not failure. Rollback is adult supervision with a keyboard.

## When to rollback

Rollback when any of these happen:

- Root site fails to load after deployment.
- `/site/partner-intake/` fails to load.
- `GET /api/health` fails in production.
- Protected endpoints accept missing/bad tokens.
- GPT Actions start calling wrong endpoints.
- Tally webhook returns repeated non-2XX responses.
- Vercel logs expose secrets or partner PII.
- Production starts writing bad records to Notion, HubSpot, Sheets, or another storage system.
- `vercel.json` breaks existing routing behavior.

## Vercel dashboard rollback

1. Open the Vercel project.
2. Go to **Deployments**.
3. Find the last known-good production deployment.
4. Open the deployment.
5. Use **Promote to Production** or equivalent rollback/promote control.
6. Re-test:
   - Root site
   - `/site/partner-intake/`
   - `/api/health`
   - one protected endpoint
7. Check logs for errors.

## GitHub PR revert

If Batch 14 caused the issue:

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"

git checkout main
git pull origin main

# Replace <merge_commit_sha> with the merge commit SHA.
git revert -m 1 <merge_commit_sha>

git push origin main
```

If the PR was squash-merged:

```powershell
git revert <squash_commit_sha>
git push origin main
```

Create a short revert PR if branch protection requires review.

## Disable Tally webhook temporarily

In Tally:

1. Open the partner intake form.
2. Go to integrations/webhooks.
3. Disable the webhook or remove the endpoint URL.
4. Save changes.
5. Submit a test form to confirm it no longer hits the endpoint.

Alternative emergency move:

- Rotate `TALLY_SIGNING_SECRET` so bad webhook calls fail verification.
- Add a temporary storage mode of `mock` if the API supports it.

## Rotate action token

1. Generate a new token.
2. Update `PARTNER_INTAKE_ACTION_TOKEN` in Vercel.
3. Redeploy or promote updated env.
4. Update the Custom GPT Action auth secret.
5. Test:
   - `GET /api/health`
   - `POST /api/partners/classify`
6. Confirm old token fails.

## Restore previous OpenAPI schema

1. Find the last known-good `/actions/openapi.yaml` or `/actions/openapi.json`.
2. Re-import into GPT Builder Actions.
3. Confirm server URL.
4. Confirm Bearer auth.
5. Test operation IDs:
   - `checkHealth`
   - `classifyPartnerIntake`
   - `recommendPartnerResources`
   - `generatePartnerOnboardingPlan`
   - `generatePartnerCampaignKit`
   - `logPartnerEvent`
6. Confirm Tally webhook remains absent from the Action schema.

## Data cleanup after rollback

If bad records were written:

- Mark records as test/invalid in Notion or HubSpot.
- Do not delete immediately if audit history matters.
- Preserve failed payload examples without PII where possible.
- Add notes to the test log before retrying production deployment.

## Rollback communication template

```text
Rollback completed.

Reason:
- [brief issue]

Restored to:
- [deployment or commit]

Validation passed:
- Root site:
- Partner Intake dashboard:
- API health:
- Protected endpoint auth:
- Tally webhook:

Follow-up fix:
- [next action]
```
