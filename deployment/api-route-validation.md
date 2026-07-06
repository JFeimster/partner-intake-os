# API Route Validation

Use these checks after deployment. Replace placeholders before running.

## Terminal setup

PowerShell:

```powershell
$BASE_URL = "https://YOUR_VERCEL_DOMAIN.vercel.app"
$TOKEN = "YOUR_PARTNER_INTAKE_ACTION_TOKEN"
```

Bash:

```bash
export BASE_URL="https://YOUR_VERCEL_DOMAIN.vercel.app"
export TOKEN="YOUR_PARTNER_INTAKE_ACTION_TOKEN"
```

## 1. Health check

Expected: `200 OK`.

PowerShell:

```powershell
curl.exe -i "$BASE_URL/api/health"
```

Bash:

```bash
curl -i "$BASE_URL/api/health"
```

Expected fields may include:

```json
{
  "ok": true,
  "service": "partner-intake-os",
  "env": "production"
}
```

## 2. Classify partner intake

Expected with valid token: `200 OK`.

PowerShell:

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/classify" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  --data "{\"intake\":{\"first_name\":\"Maya\",\"last_name\":\"Brooks\",\"email\":\"maya@example.com\",\"company\":\"LedgerLine Advisory\",\"partner_type_claimed\":\"CPA/bookkeeper\",\"audience\":\"small business owners\",\"referral_volume_estimate\":\"3-5 per month\",\"notes\":\"Wants a clean referral path for clients who need working capital education.\"},\"context\":\"manual_review\"}"
```

Bash:

```bash
curl -i -X POST "$BASE_URL/api/partners/classify" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "intake": {
      "first_name": "Maya",
      "last_name": "Brooks",
      "email": "maya@example.com",
      "company": "LedgerLine Advisory",
      "partner_type_claimed": "CPA/bookkeeper",
      "audience": "small business owners",
      "referral_volume_estimate": "3-5 per month",
      "notes": "Wants a clean referral path for clients who need working capital education."
    },
    "context": "manual_review"
  }'
```

Expected response fields:

- `partner_type`
- `partner_tier`
- `onboarding_path`
- `risk_level`
- `scorecard`
- `next_action`

## 3. Recommend resources

Expected with valid token: `200 OK`.

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/recommend-resources" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  --data "{\"partner_type\":\"cpa_bookkeeper\",\"audience\":\"general_smb\",\"partner_tier\":\"tier_2\"}"
```

Expected response fields:

- `recommended_resources`
- `reason`
- `priority`
- `cta`

## 4. Generate onboarding plan

Expected with valid token: `200 OK`.

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/generate-onboarding-plan" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  --data "{\"partner_id\":\"partner_demo_001\",\"partner_type\":\"funding_broker\",\"partner_tier\":\"tier_2\",\"onboarding_path\":\"standard_affiliate_partner\"}"
```

Expected response fields:

- `first_24_hours`
- `first_7_days`
- `first_30_days`
- `required_assets`
- `next_action`

## 5. Generate campaign kit

Expected with valid token: `200 OK`.

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/generate-campaign-kit" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  --data "{\"partner_id\":\"partner_demo_002\",\"partner_type\":\"creator_affiliate\",\"audience\":\"ecommerce sellers\",\"campaign_goal\":\"drive funding readiness checks\"}"
```

Expected response fields:

- `campaign_name`
- `campaign_type`
- `offer`
- `cta`
- `suggested_channels`
- `tracking_notes`
- `copy_angle`

## 6. Log partner event

Expected with valid token: `200 OK` or `201 Created`.

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/log-event" `
  -H "Authorization: Bearer $TOKEN" `
  -H "Content-Type: application/json" `
  --data "{\"partner_id\":\"partner_demo_003\",\"event_type\":\"gpt_reviewed_intake\",\"event_source\":\"custom_gpt\",\"summary\":\"GPT reviewed intake and recommended standard onboarding.\",\"next_action\":\"send_welcome_resources\"}"
```

Expected response fields:

- `logged`
- `event_id`
- `partner_id`
- `created_at`

## 7. Tally webhook test

Expected: `2XX` with test payload. Signature validation may reject unsigned payloads if the endpoint requires a valid Tally signature.

Unsigned local smoke test:

```powershell
curl.exe -i -X POST "$BASE_URL/api/tally/partner-intake-webhook" `
  -H "Content-Type: application/json" `
  -H "X-Partner-Source: tally-test" `
  --data "{\"eventId\":\"evt_test_001\",\"eventType\":\"FORM_RESPONSE\",\"formId\":\"form_test_partner_intake\",\"responseId\":\"resp_test_001\",\"data\":{\"fields\":[{\"label\":\"First name\",\"value\":\"Jordan\"},{\"label\":\"Last name\",\"value\":\"Reed\"},{\"label\":\"Email\",\"value\":\"jordan@example.com\"},{\"label\":\"Company / brand\",\"value\":\"Reed Capital Referrals\"},{\"label\":\"Which best describes you?\",\"value\":\"Funding broker\"}]}}"
```

If signature validation is enforced, test through Tally instead of raw curl.

## Bad auth tests

Missing token:

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  --data "{\"intake\":{\"email\":\"test@example.com\"}}"
```

Expected: `401 Unauthorized`.

Bad token:

```powershell
curl.exe -i -X POST "$BASE_URL/api/partners/classify" `
  -H "Authorization: Bearer bad_token" `
  -H "Content-Type: application/json" `
  --data "{\"intake\":{\"email\":\"test@example.com\"}}"
```

Expected: `401 Unauthorized`.

## Validation notes

Do not proceed to GPT Action repair until:

- The deployed domain is final.
- Auth tests behave correctly.
- Tally webhook behavior is understood.
- The OpenAPI server URL matches the deployed domain.
