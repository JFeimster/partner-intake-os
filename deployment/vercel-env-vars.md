# Vercel Environment Variables

This file defines the Partner Intake OS environment variables for Vercel. Use placeholders locally. Store real values only in Vercel, secret management, or trusted local `.env` files that are ignored by Git.

## Required variables

| Variable | Required | Scope | Purpose | Example placeholder |
|---|---:|---|---|---|
| `PARTNER_INTAKE_ACTION_TOKEN` | Yes | Production, Preview, Development | Bearer token used by Custom GPT Actions | `replace_with_long_random_token` |
| `TALLY_SIGNING_SECRET` | Yes | Production, Preview, Development | Verifies Tally webhook signatures | `replace_with_tally_signing_secret` |
| `PARTNER_INTAKE_ENV` | Yes | Production, Preview, Development | Runtime environment marker | `production`, `preview`, `development` |
| `PARTNER_INTAKE_STORAGE_MODE` | Yes | Production, Preview, Development | Chooses storage connector mode | `mock`, `json`, `notion`, `hubspot`, `google_sheets` |

Recommended MVP value:

```text
PARTNER_INTAKE_STORAGE_MODE=mock
```

Move to `notion`, `hubspot`, or `google_sheets` only after the matching setup batch is complete and tested.

## Storage variables

| Variable | Required when | Purpose |
|---|---|---|
| `NOTION_API_KEY` | Storage mode `notion` | Notion integration token |
| `NOTION_PARTNER_DATABASE_ID` | Storage mode `notion` | Partner staging database ID |
| `HUBSPOT_ACCESS_TOKEN` | Storage mode `hubspot` | HubSpot private app access token |
| `HUBSPOT_PARTNER_PIPELINE_ID` | Storage mode `hubspot` | Partner pipeline ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Storage mode `google_sheets` | Google service account client email |
| `GOOGLE_PRIVATE_KEY` | Storage mode `google_sheets` | Google service account private key |
| `GOOGLE_SHEET_ID` | Storage mode `google_sheets` | Destination Google Sheet ID |

## Dashboard and tracking placeholders

| Variable | Required | Purpose |
|---|---:|---|
| `PARTNER_BASE_URL` | Optional | Base URL for Partner Command Center dashboard |
| `PARTNER_SIGNUP_URL` | Optional | Tally or public partner signup URL |
| `PARTNER_LEAD_SUBMISSION_URL` | Optional | Future lead submission module URL |
| `TRACKING_BASE_URL` | Optional | Future tracking link base URL |

## Local `.env.example` format

Create this as `.env.example` only. Do not commit `.env`.

```bash
# Partner Intake OS required
PARTNER_INTAKE_ACTION_TOKEN=replace_with_long_random_token
TALLY_SIGNING_SECRET=replace_with_tally_signing_secret
PARTNER_INTAKE_ENV=development
PARTNER_INTAKE_STORAGE_MODE=mock

# Notion storage
NOTION_API_KEY=replace_with_notion_api_key
NOTION_PARTNER_DATABASE_ID=replace_with_database_id

# HubSpot storage
HUBSPOT_ACCESS_TOKEN=replace_with_hubspot_private_app_token
HUBSPOT_PARTNER_PIPELINE_ID=replace_with_pipeline_id

# Google Sheets storage
GOOGLE_SERVICE_ACCOUNT_EMAIL=replace_with_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace_with_key\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=replace_with_google_sheet_id

# Dashboard / tracking placeholders
PARTNER_BASE_URL=https://YOUR_VERCEL_DOMAIN.vercel.app/site/partner-intake/
PARTNER_SIGNUP_URL=https://tally.so/r/YOUR_FORM_ID
PARTNER_LEAD_SUBMISSION_URL=https://YOUR_VERCEL_DOMAIN.vercel.app/site/partner-intake/submit-lead.html
TRACKING_BASE_URL=https://YOUR_VERCEL_DOMAIN.vercel.app
```

## Vercel dashboard setup steps

1. Open the Vercel project.
2. Go to **Settings**.
3. Go to **Environment Variables**.
4. Add each required variable.
5. Assign environments:
   - Production
   - Preview
   - Development
6. Save changes.
7. Redeploy manually after env vars are saved.
8. Smoke-test endpoints.

## Vercel CLI examples

Install/login outside this packet if needed.

```powershell
vercel env add PARTNER_INTAKE_ACTION_TOKEN production
vercel env add TALLY_SIGNING_SECRET production
vercel env add PARTNER_INTAKE_ENV production
vercel env add PARTNER_INTAKE_STORAGE_MODE production
```

Preview:

```powershell
vercel env add PARTNER_INTAKE_ACTION_TOKEN preview
vercel env add TALLY_SIGNING_SECRET preview
vercel env add PARTNER_INTAKE_ENV preview
vercel env add PARTNER_INTAKE_STORAGE_MODE preview
```

Development:

```powershell
vercel env add PARTNER_INTAKE_ACTION_TOKEN development
vercel env add TALLY_SIGNING_SECRET development
vercel env add PARTNER_INTAKE_ENV development
vercel env add PARTNER_INTAKE_STORAGE_MODE development
```

Pull env vars locally only when needed:

```powershell
vercel env pull .env.local
```

Confirm `.env.local` is ignored by Git before creating it.

## Token generation

PowerShell:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

Node:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Use separate tokens for production and preview when possible.

## Token rotation notes

Rotate immediately when:

- A token may have been exposed.
- A teammate leaves.
- A GPT Action configuration was shared too broadly.
- Logs accidentally captured Authorization headers.
- You move from preview to production.

Rotation flow:

1. Generate a new token.
2. Update Vercel env var.
3. Redeploy.
4. Update GPT Action auth secret.
5. Test `GET /api/health`.
6. Test one protected endpoint.
7. Remove old token from password managers and docs.
