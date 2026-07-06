# Tally Webhook Setup

Purpose: document the intended Tally webhook setup for Partner Intake OS. This file does not create the webhook receiver and does not include API code. The actual Vercel endpoint is created in Batch 05.

## Recommended flow

```txt
Tally partner signup form
  -> FORM_RESPONSE webhook
  -> Vercel endpoint placeholder
  -> normalize with tally-field-map.json
  -> validate against schemas/intake.schema.json
  -> classify/score/store in later batches
```

## Webhook endpoint placeholder

Use this placeholder until the Batch 05 Vercel API scaffold exists:

```txt
https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
```

Do not expose this endpoint through GPT Actions. Tally posts to it. GPT Actions will use separate authenticated partner endpoints later.

## Recommended Tally event type

```txt
FORM_RESPONSE
```

## Signing secret

Recommended environment variable for the future Vercel API batch:

```txt
TALLY_SIGNING_SECRET=replace_with_random_secret
```

Recommended secret generation:

```bash
openssl rand -hex 32
```

PowerShell alternative:

```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

## Optional custom headers

Use headers to make logs and routing less dumb:

```txt
X-Partner-Source: tally
X-Partner-System: partner-intake-os
X-Partner-Environment: production
```

Do not put secrets in casual, client-visible form copy or public repo files. Secrets belong in Vercel environment variables.

## Expected request shape

The webhook should send JSON with:

- event ID
- event type
- created/submitted timestamp
- form ID
- form name
- response/submission ID
- respondent ID when available
- fields array
- raw payload

See `sample-tally-webhook-payload.json` for the local fixture.

## Expected response from future webhook receiver

The future endpoint should return quickly with a 2XX response. The response can be minimal:

```json
{
  "ok": true,
  "received": true,
  "event_id": "evt_tally_partner_20260706_001",
  "response_id": "resp_partner_20260706_001"
}
```

Do not do slow downstream work before acknowledging Tally. Let the robot clock in before making it organize the warehouse.

## Local testing notes

Before the API exists, use these files to test mapping logic manually:

1. Open `sample-tally-webhook-payload.json`.
2. Check each `fields[].label` against `tally-field-map.json`.
3. Confirm normalized values match `normalized-partner-intake-example.json`.
4. Validate the normalized object against `/schemas/intake.schema.json` from Batch 03.

Suggested JSON parse checks:

```bash
python -m json.tool tally/tally-field-map.json > /dev/null
python -m json.tool tally/sample-tally-webhook-payload.json > /dev/null
python -m json.tool tally/normalized-partner-intake-example.json > /dev/null
```

## Future curl test after Batch 05 exists

```bash
curl -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook" \
  -H "Content-Type: application/json" \
  -H "X-Partner-Source: tally" \
  --data-binary @tally/sample-tally-webhook-payload.json
```

If signature verification is enabled, the local test must include the same signature scheme implemented in Batch 05.

## Vercel deployment notes for later

Future Batch 05 should define:

```txt
TALLY_SIGNING_SECRET
PARTNER_INTAKE_ENV
PARTNER_INTAKE_STORAGE_MODE
```

Future storage batches may add:

```txt
NOTION_API_KEY
NOTION_PARTNER_DATABASE_ID
HUBSPOT_ACCESS_TOKEN
GOOGLE_SHEET_ID
```

## Security notes

- Treat Tally submissions as PII.
- Do not commit real partner submissions to GitHub.
- Keep raw webhook payloads out of public logs.
- Use a signing secret where available.
- Use separate tokens for Tally webhook verification and GPT Action authentication.
- Do not expose the Tally webhook endpoint in OpenAPI/GPT Actions.
- Keep approval, rejection, and risk decisions reviewable by a human until the workflow has proven itself.
- Never generate claims like guaranteed approvals, guaranteed funding amounts, lender certainty, credit repair promises, or fake testimonials.

## Manual review triggers

Flag the intake for manual review later when:

- partner type is `unknown` or `other`
- contact permission is missing
- partner acknowledgment is missing
- referral volume claim is unusually high without context
- notes include lead buying, scraped leads, guaranteed approvals, credit repair, pressure tactics, or “everyone qualifies” language
- audience is consumer-only instead of business-owner focused
- website/profile is missing for claimed high-volume partners
