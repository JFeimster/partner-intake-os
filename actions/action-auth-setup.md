# GPT Action Auth Setup

## Auth model

Use Bearer API key auth for Phase 24.

The same token must exist in two places:

```text
Vercel env var: PARTNER_INTAKE_ACTION_TOKEN
GPT Action auth value: YOUR_PRIVATE_ACTION_TOKEN
```

Do not commit the token. Do not paste it into docs. Do not put it in screenshots. Secrets are not confetti.

## Vercel env var

Set:

```text
PARTNER_INTAKE_ACTION_TOKEN=<private random token>
PARTNER_INTAKE_ENV=production
PARTNER_INTAKE_STORAGE_MODE=mock
```

Recommended first-pass storage mode:

```text
mock
```

Move to sandbox sync only during Phase 25.

## Token shape

Use a long random value, not a cute password.

Examples of acceptable shape:

```text
pios_live_64_random_chars_here
```

Do not use:

```text
password
moonshine
partner123
test
```

## ChatGPT Builder setup

1. Open the Partner Intake OS GPT.
2. Go to Configure.
3. Open Actions.
4. Import `/actions/openapi.yaml`.
5. Set Authentication to API key.
6. Choose Bearer auth.
7. Paste the token value.
8. Save.
9. Test `checkHealth`.
10. Test `classifyPartnerIntake`.

## Curl auth test

Good token:

```powershell
curl.exe -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/partners/classify" `
  -H "Authorization: Bearer YOUR_PRIVATE_ACTION_TOKEN" `
  -H "Content-Type: application/json" `
  -d "{\"intake\":{\"email\":\"test@example.com\",\"partner_type_claimed\":\"CPA\"}}"
```

Bad token:

```powershell
curl.exe -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/partners/classify" `
  -H "Authorization: Bearer wrong-token" `
  -H "Content-Type: application/json" `
  -d "{\"intake\":{\"email\":\"test@example.com\"}}"
```

Expected bad-token response:

```text
401
```

## Rotation procedure

1. Generate a new token.
2. Add it to Vercel as `PARTNER_INTAKE_ACTION_TOKEN`.
3. Redeploy or refresh env vars if required by current deployment.
4. Update the GPT Action auth value.
5. Test health and classify.
6. Retire the old token.
7. Log the rotation date in the internal ops notes, not in public docs.

## Common auth failures

| Symptom | Likely cause | Fix |
|---|---|---|
| 401 from all GPT calls | GPT token does not match Vercel env var | Re-paste token in GPT Action auth |
| Works in curl, fails in GPT | Action auth not saved or wrong auth type | Reconfigure as Bearer API key |
| Works locally, fails live | Vercel env var missing on production deployment | Add env var and redeploy |
| 405 | Wrong HTTP method | Use POST except for health |
| 500 | Endpoint code/env issue | Check Vercel logs and request ID |
