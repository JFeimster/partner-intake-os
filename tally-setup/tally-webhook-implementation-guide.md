# Tally Webhook Implementation Guide

## Purpose

This guide explains how to connect the existing Tally partner signup form to the existing Vercel webhook receiver for Partner Intake OS.

This batch is documentation only. It does not create or modify webhook API code. The Vercel API scaffold already exists from Batch 05.

The goal is simple:

```text
Tally partner signup form
→ Vercel webhook receiver
→ normalized intake
→ scoring and classification
→ storage router
→ admin / GPT review
```

This is how Partner Intake OS moves from manual paste-review into real intake automation without letting the robot touch the money drawer yet. Smart machine. Short leash. 🧾⚙️

## Prerequisites

Before configuring the webhook, confirm the following batches are already present in the repo:

- Batch 01 — GPT Foundation
- Batch 02 — Knowledge Base
- Batch 03 — JSON Schemas
- Batch 04 — Tally Mapping
- Batch 05 — Vercel API Scaffold
- Batch 06 — Storage Connectors
- Batch 07 — OpenAPI Action Pack
- Batch 08 — Custom GPT Setup Packet

## Required existing files from prior batches

The Tally webhook setup depends on these existing files and concepts:

```text
/tally/partner-intake-form-fields.md
/tally/tally-field-map.json
/tally/tally-webhook-setup.md
/tally/sample-tally-webhook-payload.json
/tally/normalized-partner-intake-example.json

/api/tally/partner-intake-webhook.ts
/lib/normalizers/normalize-tally-submission.ts
/lib/scoring/partner-score.ts
/lib/scoring/partner-tier.ts
/lib/scoring/risk-score.ts
/lib/recommendations/resource-router.ts
/lib/recommendations/campaign-router.ts
/lib/recommendations/onboarding-router.ts
/lib/storage/storage-router.ts

/actions/openapi.yaml or /actions/openapi.json
```

The exact filenames may reflect the shorter active file-path convention used in the current repo. Use the existing Batch 05 webhook file as the source of truth for the actual implementation.

## Vercel endpoint URL placeholder

Use this endpoint placeholder until the production Vercel domain is known:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
```

Replace `YOUR_VERCEL_DOMAIN` with the deployed Partner Command Center / Partner Intake OS Vercel domain.

Example:

```text
https://partner-command-center.vercel.app/api/tally/partner-intake-webhook
```

## Tally webhook event type recommendation

Recommended event type:

```text
FORM_RESPONSE
```

This keeps the webhook limited to actual partner signup submissions instead of form edits, test metadata, or non-intake events.

## Tally signing secret setup

Use a signing secret for the Tally webhook.

Recommended Vercel environment variable:

```text
TALLY_SIGNING_SECRET=replace_with_random_secret
```

Guidelines:

- Generate a long random value.
- Store it in Vercel, not in GitHub.
- Paste the same secret into the Tally webhook configuration.
- Do not reuse the GPT Action token as the Tally signing secret.
- Rotate it if it is exposed, copied into a public issue, pasted into a screenshot, or shared with someone who no longer needs access.

A practical local generation command:

```bash
openssl rand -hex 32
```

PowerShell option:

```powershell
[Convert]::ToHexString((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Optional custom headers

Recommended custom header:

```text
X-Partner-Source: tally
```

Optional additional header for routing or environment labeling:

```text
X-Partner-Intake-Env: production
```

Do not put secrets in optional custom headers unless the webhook receiver explicitly expects them. Signature verification should use `TALLY_SIGNING_SECRET`.

## Expected request method and content type

Expected method:

```text
POST
```

Expected content type:

```text
application/json
```

The webhook receiver should parse the JSON payload, verify the signature when configured, normalize the Tally fields, and return a successful `2XX` response quickly.

## Expected API response behavior

The webhook should return a compact response that confirms receipt and avoids leaking sensitive partner details.

Recommended successful response shape:

```json
{
  "ok": true,
  "received": true,
  "source": "tally",
  "environment": "production",
  "storage_mode": "mock",
  "request_id": "req_20260706_001",
  "partner_id": "ptr_abc123",
  "message": "Partner intake received."
}
```

Recommended failed signature response:

```json
{
  "ok": false,
  "error": "invalid_signature",
  "message": "Webhook signature verification failed.",
  "request_id": "req_20260706_002"
}
```

Recommended unsupported method response:

```json
{
  "ok": false,
  "error": "method_not_allowed",
  "message": "Use POST for Tally webhook submissions.",
  "request_id": "req_20260706_003"
}
```

## Required environment variables

Use the existing expected variables from prior batches:

```text
PARTNER_INTAKE_ACTION_TOKEN=
TALLY_SIGNING_SECRET=
PARTNER_INTAKE_ENV=production
PARTNER_INTAKE_STORAGE_MODE=mock
```

Suggested values by environment:

| Variable | Local | Preview | Production | Notes |
|---|---:|---:|---:|---|
| `PARTNER_INTAKE_ACTION_TOKEN` | required for GPT-facing endpoints | required | required | Used by GPT Actions, not Tally webhook signatures. |
| `TALLY_SIGNING_SECRET` | optional for raw local payload tests, recommended for signature tests | required | required | Used only for verifying Tally webhook authenticity. |
| `PARTNER_INTAKE_ENV` | `local` | `preview` | `production` | Use in logs and responses. |
| `PARTNER_INTAKE_STORAGE_MODE` | `mock` or `json` | `mock` or `json` | `notion`, `hubspot`, `google_sheets`, or chosen mode | Match existing storage router support. |

## How to configure the webhook in Tally

1. Open the existing partner signup form in Tally.
2. Go to the form integration / webhook settings.
3. Add a new webhook subscriber.
4. Set the webhook URL:

   ```text
   https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
   ```

5. Select the event type:

   ```text
   FORM_RESPONSE
   ```

6. Enable signing secret.
7. Paste the same value stored in Vercel as:

   ```text
   TALLY_SIGNING_SECRET
   ```

8. Add optional custom header:

   ```text
   X-Partner-Source: tally
   ```

9. Save the webhook.
10. Submit a controlled test response using the samples in:

   ```text
   /tally-setup/tally-sample-test-submissions.md
   ```

## How to test a webhook submission

Use a test submission that clearly identifies itself as a test record.

Recommended test note:

```text
TEST SUBMISSION — Batch 09 webhook setup validation. Safe to delete after verification.
```

Test order:

1. Submit a low-info signup.
2. Submit a clean funding broker signup.
3. Submit a CPA/bookkeeper referral partner signup.
4. Submit a high-risk lead seller signup.
5. Confirm each submission receives a `2XX` response in Tally.
6. Confirm the API logs show the request.
7. Confirm normalized intake was created.
8. Confirm classification, scorecard, risk flags, onboarding path, resources, and campaign recommendation were generated.
9. Confirm storage behavior matches `PARTNER_INTAKE_STORAGE_MODE`.

## How to confirm the webhook returns a 2XX response

Check Tally webhook delivery logs.

Successful delivery should show a response code such as:

```text
200 OK
201 Created
202 Accepted
204 No Content
```

Recommended for this MVP:

```text
202 Accepted
```

That tells Tally: “We got it.” The internal pipeline can still decide whether the partner is accepted, rejected, routed to review, or sent to the digital swamp where shady lead sellers go to exfoliate. 🐊

## How to confirm normalized intake was created

Check the selected storage mode:

### Mock mode

Confirm the webhook response includes a normalized object or request identifier. Mock mode may not persist records.

```text
PARTNER_INTAKE_STORAGE_MODE=mock
```

Use mock mode only for smoke testing behavior.

### JSON mode

Confirm the JSON store wrote the partner record to the configured local or temporary file path if supported by the existing Batch 06 connector.

```text
PARTNER_INTAKE_STORAGE_MODE=json
```

### Notion mode

Confirm a new Notion partner staging database item was created.

```text
PARTNER_INTAKE_STORAGE_MODE=notion
```

### HubSpot mode

Confirm the expected contact, company, deal, or task record exists.

```text
PARTNER_INTAKE_STORAGE_MODE=hubspot
```

### Google Sheets mode

Confirm a new row was added to the intended partner intake sheet.

```text
PARTNER_INTAKE_STORAGE_MODE=google_sheets
```

## Local testing notes

Local testing is useful for payload shape, normalization, and basic status behavior.

Start the Vercel dev server from the repo root:

```bash
vercel dev
```

Send a local test payload without signature enforcement only if the local implementation allows it:

```bash
curl -i -X POST "http://localhost:3000/api/tally/partner-intake-webhook" \
  -H "Content-Type: application/json" \
  -H "X-Partner-Source: tally" \
  --data-binary @tally/sample-tally-webhook-payload.json
```

If local signature verification is required, use the signing method expected by the existing Batch 05 webhook implementation. Do not disable signature verification in production just because local testing is annoying. That is how gremlins get admin privileges.

## Vercel deployment notes

Set environment variables in Vercel before connecting the live Tally form:

```bash
vercel env add PARTNER_INTAKE_ACTION_TOKEN production
vercel env add TALLY_SIGNING_SECRET production
vercel env add PARTNER_INTAKE_ENV production
vercel env add PARTNER_INTAKE_STORAGE_MODE production
```

Recommended production values:

```text
PARTNER_INTAKE_ENV=production
PARTNER_INTAKE_STORAGE_MODE=notion
```

Use `mock` or `json` first if you want to validate traffic before writing into Notion, HubSpot, or Google Sheets.

After setting environment variables, redeploy the project:

```bash
vercel deploy --prod
```

Then run the health check from Batch 05:

```bash
curl -i "https://YOUR_VERCEL_DOMAIN.vercel.app/api/health"
```

## Environment variable setup notes

Keep the two secrets separate:

- `TALLY_SIGNING_SECRET` verifies inbound requests from Tally.
- `PARTNER_INTAKE_ACTION_TOKEN` authenticates GPT Actions calling safe partner endpoints.

Do not use the same value for both. One is a front-door bouncer. The other is a staff badge. Same key for both is lazy security cosplay.

## Troubleshooting notes

### Tally shows webhook failure

Check:

- URL typo.
- Missing `/api/tally/partner-intake-webhook` path.
- Vercel deployment not live.
- Function crashed because an environment variable is missing.
- Signature secret mismatch.
- Request body parsing error.
- Webhook receiver did not return a `2XX` response quickly.

### Vercel logs show invalid signature

Check:

- Same `TALLY_SIGNING_SECRET` in Tally and Vercel.
- No extra spaces at beginning or end of the secret.
- Secret was added to the correct Vercel environment.
- Production webhook is pointing to production deployment, not a stale preview URL.

### Normalized intake is missing fields

Check:

- Tally field labels still match `/tally/tally-field-map.json`.
- Form field was renamed after Batch 04 mapping.
- New field was added in Tally but not mapped.
- Multi-select fields are being converted into arrays or strings consistently.

### Classification looks wrong

Check:

- `partner_type_claimed` is not blindly trusted.
- Audience, referral volume, tools, notes, and funding experience are being considered.
- Risk flags override happy-path tiering when needed.
- Low-info signups route to `request_more_info` instead of fake confidence.

### Storage record not created

Check:

- `PARTNER_INTAKE_STORAGE_MODE` value is supported.
- Required connector credentials exist for the selected storage mode.
- Storage connector errors are logged with request ID, not full PII payload.

## Security notes

- Keep the Tally webhook endpoint out of GPT Actions.
- Use Tally signature verification for inbound form submissions.
- Use Bearer token auth for GPT-facing partner endpoints.
- Never commit `.env` files or copied Vercel secret values.
- Do not log full payloads in production.
- Do not log phone numbers, emails, raw notes, or full free-text submissions unless explicitly needed for debugging in a protected environment.
- Use manual review for high-risk partners, lead sellers, unverifiable claims, guarantee language, aggressive commission language, or anything that smells like a funnel wearing a trench coat.

## What not to expose to GPT Actions

Do not expose this endpoint in the OpenAPI Action Pack:

```text
POST /api/tally/partner-intake-webhook
```

GPT Actions should only expose safe, token-protected partner intelligence endpoints such as:

```text
GET /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

The Tally webhook is for Tally only. The GPT does not need to impersonate Tally, replay raw webhook payloads, or trigger intake submissions directly.
