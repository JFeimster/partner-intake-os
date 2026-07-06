# QA Master Checklist

Use this checklist before internal launch. Mark each item as `Pass`, `Fail`, `Blocked`, or `Not Applicable`.

## Repo QA

| Check | Status | Notes |
| --- | --- | --- |
| Phase 21–30 files are present in root-level functional folders. |  |  |
| No `/modules/partner-intake-os/` paths were introduced. |  |  |
| No nested `batch-*` folders were committed. |  |  |
| No `.env`, token, key, webhook secret, or private credential was committed. |  |  |
| `manifest.phase-XX.json` files, if copied, are named clearly. |  |  |
| README/docs explain internal-only launch posture. |  |  |

## Vercel QA

| Check | Status | Notes |
| --- | --- | --- |
| Project points to the correct repo. |  |  |
| Deployment window was intentionally opened. |  |  |
| Preview/production deploy behavior matches current policy. |  |  |
| Env vars are set in the intended environment only. |  |  |
| Logs do not expose tokens or raw payloads. |  |  |
| Rollback path is documented. |  |  |
| Deployment lockdown plan is complete. |  |  |

## API QA

| Endpoint | Expected | Status | Notes |
| --- | --- | --- | --- |
| `GET /api/health` | 200 JSON status. |  |  |
| `POST /api/partners/classify` | Requires Bearer token. |  |  |
| `POST /api/partners/recommend-resources` | Requires Bearer token. |  |  |
| `POST /api/partners/generate-onboarding-plan` | Requires Bearer token. |  |  |
| `POST /api/partners/generate-campaign-kit` | Requires Bearer token. |  |  |
| `POST /api/partners/log-event` | Requires Bearer token. |  |  |
| `POST /api/leads/submit` | Review-first response. |  |  |
| `GET /api/leads/[lead_id]` | Requires Bearer token. |  |  |
| `POST /api/tracking/create-link` | Validates URL and auth. |  |  |
| `GET /api/tracking/[tracking_id]` | Requires Bearer token. |  |  |

## GPT Actions QA

| Check | Status | Notes |
| --- | --- | --- |
| OpenAPI YAML imports without schema error. |  |  |
| Bearer token configured. |  |  |
| `checkHealth` passes. |  |  |
| `classifyPartnerIntake` passes. |  |  |
| `recommendPartnerResources` passes. |  |  |
| `generatePartnerOnboardingPlan` passes. |  |  |
| `generatePartnerCampaignKit` passes. |  |  |
| `logPartnerEvent` passes. |  |  |
| Tally webhook is not exposed. |  |  |
| Admin endpoints are not exposed. |  |  |

## Tally webhook QA

| Check | Status | Notes |
| --- | --- | --- |
| Webhook URL points to intended Vercel domain. |  |  |
| Event type is configured for form responses. |  |  |
| Signing secret policy is documented. |  |  |
| Test submission returns 2XX quickly. |  |  |
| Duplicate submission behavior is documented. |  |  |
| Malformed payload behavior returns safe error. |  |  |
| Logs do not expose raw sensitive data. |  |  |

## Notion QA

| Check | Status | Notes |
| --- | --- | --- |
| Sandbox database exists. |  |  |
| Property names match docs. |  |  |
| Property types match docs. |  |  |
| Dry-run mode tested. |  |  |
| Sandbox write tested only with fake records. |  |  |
| Failed writes return actionable error. |  |  |

## HubSpot QA

| Check | Status | Notes |
| --- | --- | --- |
| Sandbox account or safe test environment confirmed. |  |  |
| Custom properties exist. |  |  |
| Pipeline/stage mapping checked. |  |  |
| Dry-run mode tested. |  |  |
| Sandbox write tested only with fake records. |  |  |
| No production contacts polluted by fake data. |  |  |

## Lead submission QA

| Check | Status | Notes |
| --- | --- | --- |
| Valid fake lead returns review status. |  |  |
| Missing consent fails. |  |  |
| Bad auth fails. |  |  |
| Sensitive fields trigger review or rejection. |  |  |
| Response does not promise approval/funding/commission. |  |  |

## Tracking link QA

| Check | Status | Notes |
| --- | --- | --- |
| Valid tracking link generates deterministic record. |  |  |
| Invalid URL fails. |  |  |
| Bad auth fails. |  |  |
| UTM parameters are applied correctly. |  |  |
| Metadata is sanitized. |  |  |
| No payout/commission claim is made. |  |  |

## Admin review dashboard QA

| Check | Status | Notes |
| --- | --- | --- |
| Login page loads. |  |  |
| Invalid token fails. |  |  |
| Valid token creates protected session. |  |  |
| Review queue is protected. |  |  |
| Logout clears session. |  |  |
| Sample data is clearly labeled. |  |  |
| Real data boundaries are documented. |  |  |
