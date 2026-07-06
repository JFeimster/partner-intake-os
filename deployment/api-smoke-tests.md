# API Smoke Tests

## Purpose

Run fast live checks against Partner Intake OS Vercel API routes without testing real partner data, writing production CRM records, or exposing secrets.

## Base URL

```powershell
$BaseUrl = "https://YOUR_VERCEL_DOMAIN.vercel.app"
$Token = "YOUR_TEST_ACTION_TOKEN"
```

Do not paste real tokens into Markdown or screenshots.

## Expected GPT-facing endpoints

These are allowed in GPT Actions:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

## Endpoint that must not be exposed in GPT Actions

```text
POST /api/tally/partner-intake-webhook
```

The Tally webhook is for Tally only. Do not put it in OpenAPI Action schemas.

## Headers

For GPT-facing endpoints:

```powershell
$Headers = @{
  "Authorization" = "Bearer $Token"
  "Content-Type"  = "application/json"
}
```

For bad-auth tests:

```powershell
$BadHeaders = @{
  "Authorization" = "Bearer definitely-not-the-token"
  "Content-Type"  = "application/json"
}
```

## `GET /api/health`

```powershell
Invoke-RestMethod -Method GET -Uri "$BaseUrl/api/health"
```

Expected:

- `200`
- JSON response.
- Includes service/status/environment/timestamp once Phase 23 repairs are complete.

## `POST /api/partners/classify`

```powershell
$Body = @{
  intake = @{
    first_name = "Jordan"
    last_name = "Sample"
    email = "jordan.sample@example.test"
    company = "Sample Partner Group"
    partner_type_claimed = "CPA / bookkeeper"
    audience = "small business owners with cash flow questions"
    referral_volume_estimate = "2-5 per month"
    notes = "Wants a safe referral path for business funding readiness conversations."
    consent_confirmed = $true
  }
  context = "deployment_smoke_test"
} | ConvertTo-Json -Depth 6

Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/partners/classify" -Headers $Headers -Body $Body
```

Expected:

- `200` when token valid.
- Partner profile/classification-like output.
- No approval guarantee copy.
- No real CRM write unless storage mode intentionally configured.

Bad auth:

```powershell
Invoke-WebRequest -Method POST -Uri "$BaseUrl/api/partners/classify" -Headers $BadHeaders -Body $Body -SkipHttpErrorCheck
```

Expected:

- `401` or `403`.

Missing body:

```powershell
Invoke-WebRequest -Method POST -Uri "$BaseUrl/api/partners/classify" -Headers $Headers -Body "{}" -SkipHttpErrorCheck
```

Expected:

- `400` or safe validation error.

## `POST /api/partners/recommend-resources`

```powershell
$Body = @{
  partner_type = "cpa_bookkeeper"
  audience = "small business owners"
  use_case = "funding readiness referral"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/partners/recommend-resources" -Headers $Headers -Body $Body
```

Expected:

- Resource recommendations.
- Safe educational framing.

## `POST /api/partners/generate-onboarding-plan`

```powershell
$Body = @{
  partner_id = "ptr_test_001"
  partner_type = "broker"
  partner_tier = "tier_2"
  onboarding_path = "standard_affiliate_partner"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/partners/generate-onboarding-plan" -Headers $Headers -Body $Body
```

Expected:

- First 24 hours.
- First 7 days.
- First 30 days.
- Required assets.
- Owner/next action.

## `POST /api/partners/generate-campaign-kit`

```powershell
$Body = @{
  partner_id = "ptr_test_002"
  partner_type = "content_creator_affiliate"
  audience = "gig workers and indie founders"
  offer = "funding readiness review"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/partners/generate-campaign-kit" -Headers $Headers -Body $Body
```

Expected:

- Campaign concept.
- CTA.
- Channel suggestions.
- Tracking notes.
- Copy angle.
- No deceptive urgency or guaranteed outcomes.

## `POST /api/partners/log-event`

```powershell
$Body = @{
  partner_id = "ptr_test_003"
  event_type = "deployment_smoke_test"
  summary = "Smoke test event. No real partner data."
  source = "phase_22"
} | ConvertTo-Json -Depth 5

Invoke-RestMethod -Method POST -Uri "$BaseUrl/api/partners/log-event" -Headers $Headers -Body $Body
```

Expected:

- Stub/log confirmation.
- No raw PII in response.
- No production write unless intentionally configured.

## `POST /api/tally/partner-intake-webhook`

Use fake data only:

```powershell
$TallyBody = @{
  eventId = "evt_test_phase_22"
  eventType = "FORM_RESPONSE"
  createdAt = "2026-07-06T00:00:00.000Z"
  data = @{
    responseId = "resp_test_phase_22"
    formName = "Partner Intake OS Test"
    fields = @(
      @{ label = "First name"; value = "Test" }
      @{ label = "Last name"; value = "Partner" }
      @{ label = "Email"; value = "test.partner@example.test" }
      @{ label = "Company / brand"; value = "Example Test Co" }
      @{ label = "Which best describes you?"; value = "Referral partner" }
    )
  }
} | ConvertTo-Json -Depth 8

Invoke-WebRequest -Method POST -Uri "$BaseUrl/api/tally/partner-intake-webhook" -ContentType "application/json" -Body $TallyBody -SkipHttpErrorCheck
```

Expected:

- `2XX` for acceptable test behavior.
- If signing is enforced, unsigned request may return `401`/`403`.
- It must not require the GPT Action Bearer token.
- It must not be exposed in OpenAPI.

## No Tally webhook exposure in GPT Actions

Check:

```powershell
Select-String -Path ".ctions\openapi.yaml" -Pattern "tally|partner-intake-webhook" -SimpleMatch
Select-String -Path ".ctions\openapi.json" -Pattern "tally|partner-intake-webhook" -SimpleMatch
```

Expected:

- No GPT Action exposure.
- If these strings appear in docs/comments, confirm they are not under `paths`.

## Status code expectations

| Test | Expected |
|---|---|
| Health route | `200` |
| Partner endpoint valid auth | `200` |
| Partner endpoint bad auth | `401` or `403` |
| Partner endpoint missing body | `400` |
| Tally webhook valid/signed payload | `2XX` |
| Tally webhook unsigned when signing enforced | `401` or `403` |
| Wrong method | `405` after Phase 23 repair |

## Notes

If endpoints do not exist yet, `404` is a valid discovery result for Phase 22. Log it and repair in Phase 23.
