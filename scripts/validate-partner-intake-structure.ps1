param(
  [string]$Root = ".",
  [switch]$Strict
)

$ErrorActionPreference = "Stop"

function Test-ExpectedPath {
  param(
    [string]$Path,
    [string]$Type = "Any"
  )

  $FullPath = Join-Path $Root $Path
  $Exists = $false

  if ($Type -eq "Directory") {
    $Exists = Test-Path $FullPath -PathType Container
  } elseif ($Type -eq "File") {
    $Exists = Test-Path $FullPath -PathType Leaf
  } else {
    $Exists = Test-Path $FullPath
  }

  if ($Exists) {
    Write-Host "[PASS] $Path" -ForegroundColor Green
    return $true
  }

  Write-Host "[FAIL] $Path" -ForegroundColor Red
  return $false
}

Write-Host ""
Write-Host "Partner Intake OS Structure Validation" -ForegroundColor Cyan
Write-Host "Root: $((Resolve-Path $Root).Path)"
Write-Host ""

$Expected = @(
  @{ Path = "github"; Type = "Directory" },
  @{ Path = "deployment"; Type = "Directory" },
  @{ Path = "actions"; Type = "Directory" },
  @{ Path = "notion"; Type = "Directory" },
  @{ Path = "hubspot"; Type = "Directory" },
  @{ Path = "lead-submission"; Type = "Directory" },
  @{ Path = "tracking"; Type = "Directory" },
  @{ Path = "admin-review"; Type = "Directory" },
  @{ Path = "site\partner-intake"; Type = "Directory" },
  @{ Path = "site\partner-intake\submit-lead.html"; Type = "File" },
  @{ Path = "site\partner-intake\tracking-link-builder.html"; Type = "File" },
  @{ Path = "site\partner-intake\admin\index.html"; Type = "File" },
  @{ Path = "tests"; Type = "Directory" }
)

$Passed = 0
$Failed = 0

foreach ($Item in $Expected) {
  if (Test-ExpectedPath -Path $Item.Path -Type $Item.Type) {
    $Passed++
  } else {
    $Failed++
  }
}

Write-Host ""
Write-Host "Convention checks" -ForegroundColor Cyan

$BadModulePaths = Get-ChildItem -Path $Root -Recurse -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -match "\\modules(\\|$)" -or $_.FullName -match "modules[\\/]partner-intake-os" }

if ($BadModulePaths.Count -gt 0) {
  Write-Host "[FAIL] Found disallowed /modules/ path(s):" -ForegroundColor Red
  $BadModulePaths | ForEach-Object { Write-Host "  $($_.FullName)" -ForegroundColor Red }
  $Failed++
} else {
  Write-Host "[PASS] No disallowed /modules/ paths found" -ForegroundColor Green
  $Passed++
}

$NestedBatchFolders = Get-ChildItem -Path $Root -Recurse -Directory -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "^batch-(13|14|15|16|17|18|19|20)$" -or $_.Name -match "partner-intake-os-batches" }

if ($NestedBatchFolders.Count -gt 0) {
  Write-Host "[FAIL] Found nested batch package folder(s):" -ForegroundColor Red
  $NestedBatchFolders | ForEach-Object { Write-Host "  $($_.FullName)" -ForegroundColor Red }
  $Failed++
} else {
  Write-Host "[PASS] No nested batch package folders found" -ForegroundColor Green
  $Passed++
}

Write-Host ""
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "Passed: $Passed"
Write-Host "Failed: $Failed"

if ($Failed -gt 0) {
  if ($Strict) {
    Write-Host "Validation failed in strict mode." -ForegroundColor Red
    exit 1
  }

  Write-Host "Validation found missing paths. This may be expected before Batches 13-20 are fully merged." -ForegroundColor Yellow
  exit 0
}

Write-Host "Structure validation passed." -ForegroundColor Green
exit 0
