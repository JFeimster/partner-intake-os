# GPT Action Test Repair Guide

## Purpose

Use this when the Partner Intake OS Action Pack fails during schema import, GPT Builder testing, curl testing, or Vercel endpoint execution.

The goal is not to “make the error go away.” The goal is to repair the contract between:

```text
Custom GPT Action schema → Vercel API endpoint → JSON response → GPT usable output
```

## Common GPT Action import errors

### Error: OpenAPI schema cannot be parsed

Likely causes:

- Invalid YAML indentation
- Invalid JSON commas or quotes
- OpenAPI version missing
- Unsupported schema keyword
- Duplicate path or duplicate operation ID

Repair:

1. Run syntax validation:
   ```powershell
   python -m json.tool actions/openapi.json > $null
   ```
2. For YAML:
   ```powershell
   python - <<'PY'
   import yaml
   yaml.safe_load(open("actions/openapi.yaml", encoding="utf-8"))
   print("YAML OK")
   PY
   ```
3. Remove duplicate `operationId` values.
4. Keep schemas simple and explicit.
5. Re-import.

### Error: Missing operationId

Likely causes:

- A path/method exists but no `operationId` is defined.
- Operation ID is nested incorrectly.

Repair:

Add one of the approved operation IDs:

```text
checkHealth
classifyPartnerIntake
recommendPartnerResources
generatePartnerOnboardingPlan
generatePartnerCampaignKit
logPartnerEvent
```

### Error: Server URL invalid

Likely causes:

- `localhost`
- Placeholder Vercel domain
- Trailing slash issues
- Missing `https://`

Repair:

Use a production Vercel domain:

```text
https://YOUR_DEPLOYED_DOMAIN.vercel.app
```

Do not use:

```text
http://localhost:3000
https://YOUR_VERCEL_DOMAIN.vercel.app/
```

## Common auth errors

### Error: 401 Unauthorized

Likely causes:

- Token missing in GPT Action auth config
- Token mismatch between GPT builder and Vercel env var
- API expects a different header
- Vercel env var not deployed to production

Repair:

1. Confirm Vercel env var:
   ```powershell
   vercel env ls
   ```
2. Confirm the function checks:
   ```http
   Authorization: Bearer <token>
   ```
3. In GPT Builder, set:
   ```text
   Authentication: API Key
   Auth Type: Bearer
   ```
4. Redeploy after changing env vars.
5. Run bad-token and good-token curl tests.

### Error: 403 Forbidden

Likely causes:

- Endpoint distinguishes authenticated but not allowed.
- Wrong environment token.
- Admin-only endpoint accidentally exposed.

Repair:

- Confirm the endpoint is meant to be GPT-facing.
- Do not expose admin endpoints in the public Action Pack.
- Remove any role-based/admin-only paths from the GPT schema unless a later admin Action Pack explicitly supports them.

## Common server URL errors

### Error: Vercel 404

Likely causes:

- File path does not map to route
- Wrong deployed branch
- API route not present in production
- Static folder path confused with API route path
- Using `/site/api/...` instead of `/api/...`

Repair:

1. Visit:
   ```text
   https://YOUR_DOMAIN.vercel.app/api/health
   ```
2. Confirm repo contains:
   ```text
   /api/health.ts
   ```
3. Confirm production deployment includes the commit.
4. Confirm `vercel.json` did not rewrite `/api/*` away.

### Error: Vercel 405

Likely causes:

- Wrong HTTP method
- GET used for POST endpoint
- Endpoint does not handle OPTIONS or method validation cleanly

Repair:

Use correct methods:

| Endpoint | Method |
|---|---|
| `/api/health` | GET |
| `/api/partners/classify` | POST |
| `/api/partners/recommend-resources` | POST |
| `/api/partners/generate-onboarding-plan` | POST |
| `/api/partners/generate-campaign-kit` | POST |
| `/api/partners/log-event` | POST |

### Error: Vercel 500

Likely causes:

- Missing env var
- Unhandled body parsing issue
- Storage connector throwing instead of failing gracefully
- JSON response not returned
- Runtime mismatch

Repair:

1. Check Vercel function logs.
2. Confirm required env vars.
3. Add safe fallback behavior for mock mode.
4. Return structured error JSON:
   ```json
   {
     "error": "server_error",
     "message": "Unexpected server error.",
     "code": "SERVER_ERROR",
     "request_id": "req_example"
   }
   ```

## Common schema reference errors

### Error: unresolved `$ref`

Likely causes:

- Component name typo
- Referencing external file not included in schema
- JSON/YAML mismatch

Repair:

- Prefer inline schemas for GPT Action MVP.
- Keep shared schemas under `components.schemas`.
- Ensure references look like:
  ```yaml
  $ref: "#/components/schemas/PartnerIntakeRequest"
  ```

### Error: response schema too vague

Likely causes:

- `type: object` with no properties
- Missing examples
- Array/object mismatch

Repair:

Add explicit fields and examples. GPT Actions work better when the API contract tells the model what “good” looks like.

## Common response shape errors

### Problem: GPT receives a response but gives weak output

Likely causes:

- API response lacks `summary`, `next_action`, or typed fields.
- Response uses inconsistent keys.
- Error returns plain text instead of JSON.

Repair:

Use consistent response envelopes:

```json
{
  "ok": true,
  "result": {},
  "request_id": "req_example"
}
```

For errors:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Missing required field: email"
  },
  "request_id": "req_example"
}
```

## Common GPT Builder test issues

### GPT says it cannot access the endpoint

Repair:

- Confirm Action Pack imported.
- Confirm auth configured.
- Confirm server URL is deployed and public.
- Confirm endpoint does not require browser cookies.
- Confirm Vercel protection is not blocking API calls.

### GPT calls the wrong action

Repair:

- Make operation descriptions sharper.
- Use distinct operation IDs.
- Avoid overlapping descriptions.
- Add examples showing when to call each endpoint.

### GPT tries to call Tally webhook

Repair:

- Remove the Tally webhook from OpenAPI.
- Add explicit Action Pack note: Tally webhook is inbound-only and never GPT-facing.
- Add a test case verifying no Tally webhook path exists.

## What to change: OpenAPI vs API code

| Symptom | Change OpenAPI | Change API code |
|---|---:|---:|
| Import fails | Yes | Maybe |
| GPT sends wrong body | Yes | Maybe |
| 401 on valid token | Maybe | Yes |
| 404 route missing | No | Yes |
| 405 method mismatch | Maybe | Yes |
| Response is hard for GPT to use | Yes | Yes |
| Endpoint works in curl but not GPT | Yes | Maybe |
| GPT Action has wrong server URL | Yes | No |

## Repair sequence

1. Fix syntax.
2. Fix server URL.
3. Fix auth.
4. Fix operation IDs.
5. Fix request schemas.
6. Fix response schemas.
7. Curl test.
8. GPT Builder test.
9. Update `/tests/gpt-action-test-log.md`.

## Do not do these

- Do not expose `/api/tally/partner-intake-webhook`.
- Do not paste real API tokens into docs, screenshots, examples, or GitHub.
- Do not weaken auth to “make the test work.”
- Do not claim funding approval, lender certainty, or guaranteed outcomes in response examples.
- Do not add future Batch 16–20 endpoints to the Action Pack during this repair batch.
