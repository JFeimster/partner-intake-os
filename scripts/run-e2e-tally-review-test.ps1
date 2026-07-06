<#
.SYNOPSIS
  Runs Partner Intake OS Phase 29 E2E tests from Tally-style fixtures through API/review-queue checks.

.DESCRIPTION
  This script uses only fixture payloads by default. It posts Tally-style JSON payloads to
  /api/tally/partner-intake-webhook, optionally validates /api/partners/classify with Bearer auth,
  and optionally checks /api/admin/review-queue with the admin token.

  It writes a redacted results file. It does not log raw payloads or real PII.
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,

  [string]$ActionToken = $env:PARTNER_INTAKE_ACTION_TOKEN,

  [string]$AdminToken = $env:PARTNER_ADMIN_TOKEN,

  [string]$PayloadFile = ".\e2e\sample-tally-e2e-payloads.json",

  [string]$ExpectedFile = ".\e2e\expected-review-queue-results.json",

  [string]$OutputPath = ".\e2e\results\e2e-tally-review-results.json",

  [switch]$SkipWebhook,

  [switch]$SkipClassify,

  [switch]$SkipAdminQueue,

  [switch]$IncludeMalformed
)

$ErrorActionPreference = "Stop"

function Normalize-BaseUrl {
  param([string]$Url)
  return $Url.TrimEnd("/")
}

function Ensure-File {
  param([string]$Path)
  if (-not (Test-Path $Path)) {
    throw "Required file not found: $Path"
  }
}

function New-JsonHeaders {
  param([string]$BearerToken)
  $headers = @{ "Content-Type" = "application/json" }
  if ($BearerToken) {
    $headers["Authorization"] = "Bearer $BearerToken"
  }
  return $headers
}

function Invoke-JsonRequest {
  param(
    [string]$Method,
    [string]$Uri,
    [hashtable]$Headers,
    [string]$Body
  )

  try {
    $response = Invoke-WebRequest -Method $Method -Uri $Uri -Headers $Headers -Body $Body -ContentType "application/json" -UseBasicParsing
    $content = $response.Content
    $json = $null
    if ($content) {
      try { $json = $content | ConvertFrom-Json -Depth 50 } catch { $json = $null }
    }
    return [pscustomobject]@{
      ok = $true
      status_code = [int]$response.StatusCode
      body = $json
      raw_length = if ($content) { $content.Length } else { 0 }
    }
  } catch {
    $status = 0
    $content = ""
    if ($_.Exception.Response) {
      try { $status = [int]$_.Exception.Response.StatusCode.value__ } catch { $status = 0 }
      try {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $content = $reader.ReadToEnd()
      } catch { $content = "" }
    }
    $json = $null
    if ($content) {
      try { $json = $content | ConvertFrom-Json -Depth 50 } catch { $json = $null }
    }
    return [pscustomobject]@{
      ok = $false
      status_code = $status
      body = $json
      raw_length = if ($content) { $content.Length } else { 0 }
      error = $_.Exception.Message
    }
  }
}

function Convert-TallyPayloadToIntake {
  param($Payload)

  $map = @{
    "First name" = "first_name"
    "Last name" = "last_name"
    "Email" = "email"
    "Phone" = "phone"
    "Company / brand" = "company"
    "Website" = "website"
    "Which best describes you?" = "partner_type_claimed"
    "Who do you serve?" = "audience"
    "What type of businesses do you usually work with?" = "industry"
    "Estimated monthly referral volume" = "referral_volume_estimate"
    "What tools do you use?" = "current_tools"
    "Are you interested in affiliate, referral, broker, or strategic partnership?" = "desired_partner_role"
    "Anything else we should know?" = "notes"
  }

  $intake = [ordered]@{ source = "tally_e2e_fixture" }
  $fields = @()
  if ($Payload.data -and $Payload.data.fields) { $fields = $Payload.data.fields }
  foreach ($field in $fields) {
    $label = [string]$field.label
    $key = $map[$label]
    if (-not $key) {
      $key = ($label.ToLower() -replace "[^a-z0-9]+", "_").Trim("_")
    }
    if ($key) { $intake[$key] = $field.value }
  }
  return $intake
}

function New-RedactedCaseResult {
  param(
    $Case,
    $Expected,
    $WebhookResult,
    $ClassifyResult,
    $AdminResult
  )

  $actualTier = $null
  $actualPartnerType = $null
  $actualManualReview = $null
  $actualRiskFlags = @()

  if ($WebhookResult -and $WebhookResult.body -and $WebhookResult.body.data -and $WebhookResult.body.data.classification) {
    $actualTier = $WebhookResult.body.data.classification.tier
    $actualManualReview = $WebhookResult.body.data.classification.manual_review_required
    $actualRiskFlags = @($WebhookResult.body.data.classification.risk_flags)
    $actualPartnerType = $WebhookResult.body.data.classification.partner_type
  } elseif ($WebhookResult -and $WebhookResult.body -and $WebhookResult.body.classification) {
    $actualTier = $WebhookResult.body.classification.tier
    $actualManualReview = $WebhookResult.body.classification.manual_review_required
    $actualRiskFlags = @($WebhookResult.body.classification.risk_flags)
    $actualPartnerType = $WebhookResult.body.classification.partner_type
  }

  $httpPass = $false
  if ($WebhookResult) { $httpPass = ([int]$WebhookResult.status_code -eq [int]$Expected.expected_http_status) }

  $manualPass = $true
  if ($null -ne $Expected.expected_manual_review_required -and $null -ne $actualManualReview) {
    $manualPass = ([bool]$actualManualReview -eq [bool]$Expected.expected_manual_review_required)
  }

  return [pscustomobject]@{
    case_id = $Case.case_id
    description = $Case.description
    expected_http_status = $Expected.expected_http_status
    actual_http_status = if ($WebhookResult) { $WebhookResult.status_code } else { $null }
    expected_partner_type = $Expected.expected_partner_type
    actual_partner_type = $actualPartnerType
    expected_tier = $Expected.expected_tier
    actual_tier = $actualTier
    expected_manual_review_required = $Expected.expected_manual_review_required
    actual_manual_review_required = $actualManualReview
    risk_flag_count = if ($actualRiskFlags) { $actualRiskFlags.Count } else { 0 }
    webhook_http_pass = $httpPass
    manual_review_pass = $manualPass
    classify_checked = [bool]$ClassifyResult
    classify_status = if ($ClassifyResult) { $ClassifyResult.status_code } else { $null }
    admin_queue_checked = [bool]$AdminResult
    admin_queue_status = if ($AdminResult) { $AdminResult.status_code } else { $null }
    pass = ($httpPass -and $manualPass)
  }
}

$base = Normalize-BaseUrl $BaseUrl
Ensure-File $PayloadFile
Ensure-File $ExpectedFile

$payloadDoc = Get-Content $PayloadFile -Raw | ConvertFrom-Json -Depth 100
$expectedDoc = Get-Content $ExpectedFile -Raw | ConvertFrom-Json -Depth 100
$expectedByCase = @{}
foreach ($item in $expectedDoc.expected_results) { $expectedByCase[$item.case_id] = $item }

$outputDir = Split-Path $OutputPath -Parent
if ($outputDir -and -not (Test-Path $outputDir)) { New-Item -ItemType Directory -Path $outputDir -Force | Out-Null }

$results = @()
foreach ($case in $payloadDoc.cases) {
  if ($case.case_id -eq "malformed-payload" -and -not $IncludeMalformed) { continue }

  Write-Host "Testing case: $($case.case_id)" -ForegroundColor Cyan
  $expected = $expectedByCase[$case.case_id]
  if (-not $expected) { throw "Missing expected result for case_id: $($case.case_id)" }

  $webhookResult = $null
  if (-not $SkipWebhook) {
    if ($case.case_id -eq "malformed-payload") {
      $body = [string]$case.malformed_body
    } else {
      $body = $case.payload | ConvertTo-Json -Depth 100
    }
    $webhookResult = Invoke-JsonRequest -Method "POST" -Uri "$base/api/tally/partner-intake-webhook" -Headers (New-JsonHeaders "") -Body $body
  }

  $classifyResult = $null
  if (-not $SkipClassify -and $ActionToken -and $case.payload) {
    $intake = Convert-TallyPayloadToIntake -Payload $case.payload
    $classifyBody = @{ intake = $intake; context = "phase_29_e2e" } | ConvertTo-Json -Depth 100
    $classifyResult = Invoke-JsonRequest -Method "POST" -Uri "$base/api/partners/classify" -Headers (New-JsonHeaders $ActionToken) -Body $classifyBody
  }

  $adminResult = $null
  if (-not $SkipAdminQueue -and $AdminToken) {
    $adminResult = Invoke-JsonRequest -Method "GET" -Uri "$base/api/admin/review-queue" -Headers (New-JsonHeaders $AdminToken) -Body $null
  }

  $results += New-RedactedCaseResult -Case $case -Expected $expected -WebhookResult $webhookResult -ClassifyResult $classifyResult -AdminResult $adminResult
}

$summary = [ordered]@{
  generated_at = (Get-Date).ToUniversalTime().ToString("o")
  base_url = $base
  payload_file = $PayloadFile
  expected_file = $ExpectedFile
  no_real_pii = $true
  raw_payload_logged = $false
  total_cases_run = $results.Count
  total_passed = @($results | Where-Object { $_.pass }).Count
  total_failed = @($results | Where-Object { -not $_.pass }).Count
  results = $results
}

$summary | ConvertTo-Json -Depth 100 | Set-Content -Path $OutputPath -Encoding UTF8

Write-Host "E2E results written to $OutputPath" -ForegroundColor Green
Write-Host "Passed: $($summary.total_passed) / $($summary.total_cases_run)" -ForegroundColor Green
if ($summary.total_failed -gt 0) {
  Write-Host "Failed: $($summary.total_failed). Review redacted results before proceeding." -ForegroundColor Yellow
  exit 1
}
