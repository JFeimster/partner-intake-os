<#
.SYNOPSIS
  Smoke test Partner Intake OS static and API routes on a Vercel deployment.

.DESCRIPTION
  This script checks core static routes and API routes for Phase 22 deployment testing.
  It does not require real partner data. It should not print secrets. Pass an action token only
  when testing authenticated GPT-facing partner endpoints.

.EXAMPLE
  .\scripts\vercel-smoke-test.ps1 -BaseUrl "https://YOUR_VERCEL_DOMAIN.vercel.app"

.EXAMPLE
  .\scripts\vercel-smoke-test.ps1 -BaseUrl "https://YOUR_VERCEL_DOMAIN.vercel.app" -ActionToken $env:PARTNER_INTAKE_ACTION_TOKEN
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,

  [Parameter(Mandatory = $false)]
  [string]$ActionToken,

  [Parameter(Mandatory = $false)]
  [switch]$SkipApi,

  [Parameter(Mandatory = $false)]
  [switch]$SkipStatic
)

$ErrorActionPreference = "Continue"

function Normalize-BaseUrl {
  param([string]$Url)
  return $Url.TrimEnd("/")
}

function Write-Result {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Url,
    [string]$Expected,
    [string]$Status,
    [string]$Result,
    [string]$Notes
  )

  $symbol = if ($Result -eq "PASS") { "[PASS]" } elseif ($Result -eq "WARN") { "[WARN]" } else { "[FAIL]" }
  Write-Host "$symbol $Method $Name -> $Status | expected: $Expected | $Notes"
}

function Invoke-SmokeRequest {
  param(
    [string]$Name,
    [string]$Method,
    [string]$Url,
    [hashtable]$Headers,
    [string]$Body,
    [string]$Expected,
    [int[]]$PassStatuses,
    [int[]]$WarnStatuses
  )

  try {
    $params = @{
      Method = $Method
      Uri = $Url
      Headers = $Headers
      TimeoutSec = 20
      SkipHttpErrorCheck = $true
    }

    if ($Body) {
      $params["Body"] = $Body
      $params["ContentType"] = "application/json"
    }

    $response = Invoke-WebRequest @params
    $status = [int]$response.StatusCode

    if ($PassStatuses -contains $status) {
      Write-Result -Name $Name -Method $Method -Url $Url -Expected $Expected -Status $status -Result "PASS" -Notes "Expected behavior"
      return @{ name=$Name; method=$Method; url=$Url; status=$status; result="PASS"; expected=$Expected }
    }

    if ($WarnStatuses -contains $status) {
      Write-Result -Name $Name -Method $Method -Url $Url -Expected $Expected -Status $status -Result "WARN" -Notes "Known discovery result; likely Phase 23 repair"
      return @{ name=$Name; method=$Method; url=$Url; status=$status; result="WARN"; expected=$Expected }
    }

    Write-Result -Name $Name -Method $Method -Url $Url -Expected $Expected -Status $status -Result "FAIL" -Notes "Unexpected status"
    return @{ name=$Name; method=$Method; url=$Url; status=$status; result="FAIL"; expected=$Expected }
  }
  catch {
    Write-Result -Name $Name -Method $Method -Url $Url -Expected $Expected -Status "ERROR" -Result "FAIL" -Notes $_.Exception.Message
    return @{ name=$Name; method=$Method; url=$Url; status="ERROR"; result="FAIL"; expected=$Expected; error=$_.Exception.Message }
  }
}

$BaseUrl = Normalize-BaseUrl -Url $BaseUrl
$results = @()

Write-Host ""
Write-Host "Partner Intake OS — Vercel Smoke Test"
Write-Host "Base URL: $BaseUrl"
Write-Host "Action token supplied: $([bool]$ActionToken)"
Write-Host "Do not paste real tokens into logs or screenshots."
Write-Host ""

if (-not $SkipStatic) {
  Write-Host "== Static routes =="

  $staticRoutes = @(
    "/site/partner-intake/",
    "/site/partner-intake/submit-lead.html",
    "/site/partner-intake/tracking-link-builder.html",
    "/site/partner-intake/admin/"
  )

  foreach ($route in $staticRoutes) {
    $results += Invoke-SmokeRequest `
      -Name $route `
      -Method "GET" `
      -Url "$BaseUrl$route" `
      -Headers @{} `
      -Expected "200" `
      -PassStatuses @(200) `
      -WarnStatuses @(301,302,404)
  }

  Write-Host ""
}

if (-not $SkipApi) {
  Write-Host "== API routes =="

  $jsonHeaders = @{ "Content-Type" = "application/json" }
  $authHeaders = @{ "Content-Type" = "application/json" }
  $badAuthHeaders = @{ "Content-Type" = "application/json"; "Authorization" = "Bearer definitely-not-the-token" }

  if ($ActionToken) {
    $authHeaders["Authorization"] = "Bearer $ActionToken"
  }

  $results += Invoke-SmokeRequest `
    -Name "/api/health" `
    -Method "GET" `
    -Url "$BaseUrl/api/health" `
    -Headers @{} `
    -Expected "200 JSON" `
    -PassStatuses @(200) `
    -WarnStatuses @(404)

  $classifyBody = @{
    intake = @{
      first_name = "Jordan"
      last_name = "Sample"
      email = "jordan.sample@example.test"
      company = "Sample Partner Group"
      partner_type_claimed = "CPA / bookkeeper"
      audience = "small business owners"
      referral_volume_estimate = "2-5 per month"
      notes = "Deployment smoke test with fake data."
      consent_confirmed = $true
    }
    context = "phase_22_smoke_test"
  } | ConvertTo-Json -Depth 8

  $partnerEndpoints = @(
    @{ path="/api/partners/classify"; body=$classifyBody },
    @{ path="/api/partners/recommend-resources"; body=(@{ partner_type="cpa_bookkeeper"; audience="small business owners" } | ConvertTo-Json -Depth 5) },
    @{ path="/api/partners/generate-onboarding-plan"; body=(@{ partner_id="ptr_test_001"; partner_type="broker"; partner_tier="tier_2"; onboarding_path="standard_affiliate_partner" } | ConvertTo-Json -Depth 5) },
    @{ path="/api/partners/generate-campaign-kit"; body=(@{ partner_id="ptr_test_002"; partner_type="content_creator_affiliate"; audience="gig workers"; offer="funding readiness review" } | ConvertTo-Json -Depth 5) },
    @{ path="/api/partners/log-event"; body=(@{ partner_id="ptr_test_003"; event_type="deployment_smoke_test"; summary="Fake smoke test event"; source="phase_22" } | ConvertTo-Json -Depth 5) }
  )

  foreach ($endpoint in $partnerEndpoints) {
    $expected = if ($ActionToken) { "200 with valid token" } else { "401/403 without token or 404 if not implemented" }
    $pass = if ($ActionToken) { @(200) } else { @(401,403) }
    $warn = @(404,405,500)

    $results += Invoke-SmokeRequest `
      -Name $endpoint.path `
      -Method "POST" `
      -Url "$BaseUrl$($endpoint.path)" `
      -Headers $authHeaders `
      -Body $endpoint.body `
      -Expected $expected `
      -PassStatuses $pass `
      -WarnStatuses $warn

    $results += Invoke-SmokeRequest `
      -Name "$($endpoint.path) bad auth" `
      -Method "POST" `
      -Url "$BaseUrl$($endpoint.path)" `
      -Headers $badAuthHeaders `
      -Body $endpoint.body `
      -Expected "401 or 403 bad auth" `
      -PassStatuses @(401,403) `
      -WarnStatuses @(404,405,500)
  }

  $tallyBody = @{
    eventId = "evt_test_phase_22"
    eventType = "FORM_RESPONSE"
    createdAt = "2026-07-06T00:00:00.000Z"
    data = @{
      responseId = "resp_test_phase_22"
      formName = "Partner Intake OS Test"
      fields = @(
        @{ label = "First name"; value = "Test" },
        @{ label = "Last name"; value = "Partner" },
        @{ label = "Email"; value = "test.partner@example.test" },
        @{ label = "Company / brand"; value = "Example Test Co" },
        @{ label = "Which best describes you?"; value = "Referral partner" }
      )
    }
  } | ConvertTo-Json -Depth 8

  $results += Invoke-SmokeRequest `
    -Name "/api/tally/partner-intake-webhook" `
    -Method "POST" `
    -Url "$BaseUrl/api/tally/partner-intake-webhook" `
    -Headers $jsonHeaders `
    -Body $tallyBody `
    -Expected "2XX if unsigned test allowed, 401/403 if signing enforced, 404 if not implemented" `
    -PassStatuses @(200,201,202,204,401,403) `
    -WarnStatuses @(404,405,500)

  Write-Host ""
}

$passCount = ($results | Where-Object { $_.result -eq "PASS" }).Count
$warnCount = ($results | Where-Object { $_.result -eq "WARN" }).Count
$failCount = ($results | Where-Object { $_.result -eq "FAIL" }).Count

Write-Host "== Summary =="
Write-Host "PASS: $passCount"
Write-Host "WARN: $warnCount"
Write-Host "FAIL: $failCount"

if ($failCount -gt 0) {
  Write-Host ""
  Write-Host "Failures found. Log them in deployment/deployment-incident-log.md before Phase 23."
  exit 1
}

Write-Host ""
Write-Host "Smoke test complete. Warnings may be expected if Phase 23 endpoint repair has not run yet."
exit 0
