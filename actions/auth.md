# Partner Intake OS Action Auth

## Authentication model

Use a private Bearer token for the GPT Action Pack.

```txt
Authorization: Bearer YOUR_PARTNER_INTAKE_OS_ACTION_TOKEN
```

The Vercel API should validate the token against:

```txt
PARTNER_INTAKE_ACTION_TOKEN=
```

This is separate from:

```txt
TALLY_SIGNING_SECRET=
```

The GPT Action token is for ChatGPT → Vercel. The Tally signing secret is for Tally → Vercel. Do not reuse them. One key per door, because security by soup bowl is how systems get mugged.

## Generate a token locally

PowerShell:

```powershell
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$token = [Convert]::ToBase64String($bytes).Replace('+','-').Replace('/','_').TrimEnd('=')
$token
```

Node:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

## Add token to Vercel

Using Vercel CLI:

```bash
vercel env add PARTNER_INTAKE_ACTION_TOKEN production
vercel env add PARTNER_INTAKE_ACTION_TOKEN preview
vercel env add PARTNER_INTAKE_ACTION_TOKEN development
```

Recommended related env vars:

```txt
PARTNER_INTAKE_ENV=production
PARTNER_INTAKE_STORAGE_MODE=mock
TALLY_SIGNING_SECRET=replace_when_tally_webhook_secret_exists
```

For Batch 06 storage testing, keep this until you are ready for external writes:

```txt
PARTNER_INTAKE_ENABLE_LIVE_STORAGE_WRITES=false
```

## Configure auth inside the Custom GPT Action editor

1. Open the Partner Intake OS GPT editor.
2. Go to **Configure → Actions**.
3. Add or edit the Partner Intake OS Action.
4. Import `actions/openapi.yaml`.
5. Set **Authentication** to **API Key**.
6. Select **Bearer**.
7. Paste the token value from `PARTNER_INTAKE_ACTION_TOKEN`.
8. Save.
9. Test `checkHealth`.
10. Test `classifyPartnerIntake`.

## Local curl tests

Set token:

```bash
export PARTNER_INTAKE_ACTION_TOKEN="dev_partner_intake_token"
```

Health:

```bash
curl -s http://localhost:3000/api/health | jq
```

Classify:

```bash
curl -s -X POST "http://localhost:3000/api/partners/classify"   -H "Authorization: Bearer dev_partner_intake_token"   -H "Content-Type: application/json"   -d '{
    "context": "manual_review",
    "intake": {
      "first_name": "Dana",
      "last_name": "Brooks",
      "email": "dana@example.com",
      "company": "Books & Backoffice Co.",
      "partner_type_claimed": "cpa_bookkeeper",
      "audience": "service businesses and contractors",
      "funding_experience": "Refers clients who ask about working capital options.",
      "referral_volume_estimate": "2-5 per month",
      "desired_partner_role": "referral partner",
      "source": "manual",
      "submitted_at": "2026-07-06T12:00:00.000Z"
    }
  }' | jq
```

Bad auth test:

```bash
curl -i -X POST "http://localhost:3000/api/partners/classify"   -H "Authorization: Bearer wrong_token"   -H "Content-Type: application/json"   -d '{"intake":{"email":"test@example.com","source":"manual"}}'
```

Expected result: `401` with an API error body.

## Token rotation

1. Generate a new token.
2. Add the new token in Vercel.
3. Redeploy if your runtime requires env refresh.
4. Update the GPT Action Bearer token.
5. Test `checkHealth` and `classifyPartnerIntake`.
6. Remove the old token if your implementation supports only one active token.
7. Log the rotation as an admin/security event.

## Operational rules

- Never paste the token into docs committed to GitHub.
- Never expose `PARTNER_INTAKE_ACTION_TOKEN` in frontend JavaScript.
- Never reuse `TALLY_SIGNING_SECRET` for GPT Actions.
- Keep `/api/tally/partner-intake-webhook` out of `openapi.yaml` and `openapi.json`.
- Use separate Vercel env vars for production, preview, and development.
