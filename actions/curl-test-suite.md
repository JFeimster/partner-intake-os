# Curl Test Suite

## Purpose

Use these curl tests to validate the deployed Partner Intake OS Vercel API before and after importing the OpenAPI schema into the Custom GPT builder.

Run these from PowerShell.

## Environment variables

Set your deployed base URL and private action token:

```powershell
$BASE_URL = "https://YOUR_DOMAIN.vercel.app"
$TOKEN = "YOUR_PARTNER_INTAKE_ACTION_TOKEN"
```

Do not commit the real token. Do not paste it into GitHub issues, screenshots, docs, or test logs.

## 1. Health check

```powershell
curl.exe -s "$BASE_URL/api/health" `
  -H "Accept: application/json"
```

Expected status:

```text
200 OK
```

Expected fields:

```text
status
service
environment
timestamp
```

## 2. Bad token test: classify

```powershell
curl.exe -i -s -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer bad-token" `
  -d "{"intake":{"first_name":"Test","email":"test@example.com"},"context":"bad_auth_test"}"
```

Expected status:

```text
401 Unauthorized
```

Expected response fields:

```text
ok=false
error.code=UNAUTHORIZED
```

## 3. Missing token test: classify

```powershell
curl.exe -i -s -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  -d "{"intake":{"first_name":"Test","email":"test@example.com"},"context":"missing_auth_test"}"
```

Expected status:

```text
401 Unauthorized
```

## 4. Valid broker classification test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "intake": {
    "first_name": "Marcus",
    "last_name": "Reed",
    "email": "marcus.reed@example.com",
    "phone": "202-555-0198",
    "company": "Reed Funding Advisors",
    "website": "https://example.com",
    "partner_type_claimed": "funding broker",
    "audience": "contractors and local service businesses",
    "industry": "business finance",
    "location": "Washington, DC",
    "funding_experience": "3 years",
    "current_tools": ["HubSpot", "Google Sheets"],
    "traffic_or_network_size": "small but active book of referral clients",
    "referral_volume_estimate": "5-10 per month",
    "desired_partner_role": "send qualified funding referrals",
    "notes": "Needs a clean referral workflow and campaign support.",
    "source": "manual_test"
  },
  "context": "curl_test_broker"
}
"@
```

Expected status:

```text
200 OK
```

Expected response fields:

```text
partner_type
partner_tier
onboarding_path
risk_level
scorecard
next_action
manual_review_required
```

## 5. Low-info intake test

```powershell
curl.exe -i -s -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "intake": {
    "first_name": "Taylor",
    "email": "taylor@example.com",
    "partner_type_claimed": "affiliate",
    "notes": "Interested."
  },
  "context": "curl_test_low_info"
}
"@
```

Expected result:

- Status may be `200` if the API classifies with missing-info status.
- Status may be `400` if strict validation is enabled.
- In either case, output should identify missing fields and recommend `request_more_info`.

Expected safe decision:

```text
manual_review_required: true
next_action: request_more_info
```

## 6. High-risk lead seller test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/classify" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "intake": {
    "first_name": "Blake",
    "last_name": "Stone",
    "email": "blake@example.com",
    "company": "Instant Approval Leads",
    "partner_type_claimed": "lead seller",
    "audience": "any business owner who needs cash fast",
    "referral_volume_estimate": "hundreds per week",
    "funding_experience": "lead generation",
    "desired_partner_role": "sell aged leads",
    "notes": "Claims all leads are pre-approved and wants fastest payout possible.",
    "source": "manual_test"
  },
  "context": "curl_test_high_risk"
}
"@
```

Expected result:

```text
risk_level: high
manual_review_required: true
partner_tier: reject or tier_4
next_action: manual_review_or_reject
risk_flags include prohibited_claims or lead_quality_risk
```

## 7. Recommend resources test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/recommend-resources" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "partner_type": "cpa_bookkeeper",
  "audience": "restaurants and local service businesses",
  "partner_tier": "tier_2",
  "context": "curl_test_resources"
}
"@
```

Expected fields:

```text
recommended_resources
priority
reason
cta
```

## 8. Generate onboarding plan test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/generate-onboarding-plan" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "partner_id": "ptr_demo_attorney_001",
  "partner_type": "business_attorney",
  "partner_tier": "tier_2",
  "onboarding_path": "referral_only",
  "audience": "acquisition entrepreneurs and SMB owners",
  "context": "curl_test_onboarding"
}
"@
```

Expected fields:

```text
first_24_hours
first_7_days
first_30_days
required_assets
recommended_training
recommended_campaign
next_action
owner
```

## 9. Generate campaign kit test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/generate-campaign-kit" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "partner_id": "ptr_demo_veteran_001",
  "partner_type": "veteran_community_connector",
  "partner_tier": "tier_2",
  "audience": "veteran-owned businesses",
  "offer": "funding readiness education",
  "channels": ["email", "community event", "LinkedIn"],
  "context": "curl_test_campaign"
}
"@
```

Expected fields:

```text
campaign_name
campaign_type
audience
offer
cta
suggested_channels
copy_angle
tracking_notes
```

Compliance expectation:

- No guaranteed approvals.
- No guaranteed funding amounts.
- No fake lender certainty.
- No deceptive urgency.

## 10. Log event test

```powershell
curl.exe -s -X POST "$BASE_URL/api/partners/log-event" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN" `
  -d @"
{
  "event": {
    "partner_id": "ptr_demo_001",
    "event_type": "gpt_review_completed",
    "event_source": "custom_gpt",
    "summary": "Reviewed broker intake and recommended Tier 2 standard onboarding.",
    "next_action": "send_welcome_and_schedule_intro_call",
    "created_by": "partner_intake_os"
  },
  "context": "curl_test_log_event"
}
"@
```

Expected fields:

```text
logged
event_id
partner_id
status
request_id
```

## 11. Missing body test

```powershell
curl.exe -i -s -X POST "$BASE_URL/api/partners/recommend-resources" `
  -H "Content-Type: application/json" `
  -H "Authorization: Bearer $TOKEN"
```

Expected status:

```text
400 Bad Request
```

Expected response:

```text
validation error or missing body error
```

## 12. Confirm Tally webhook is not GPT-facing

This is not a GPT Action test. It is a schema audit test.

```powershell
Select-String -Path "actions\*.yaml","actions\*.json" -Pattern "/api/tally/partner-intake-webhook"
```

Expected:

```text
No results.
```

## Status code expectations

| Scenario | Expected |
|---|---:|
| Health works | 200 |
| Bad token | 401 |
| Missing token | 401 |
| Valid classify | 200 |
| Missing body | 400 |
| Wrong method | 405 |
| Unhandled server error | 500 with JSON error |
| Missing route | 404 |

## Test record

After running tests, log results in:

```text
/tests/gpt-action-test-log.md
/tests/openapi-validation-checklist.md
```
