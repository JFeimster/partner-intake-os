# Lead Submission API Checklist

Use this checklist before merging or deploying Phase 27.

## Repo checks

- [ ] Files are copied to root-level `/api/leads/`, `/lib/leads/`, `/lead-submission/`, and `/tests/`.
- [ ] No files are placed under `/modules/`.
- [ ] No project-name prefixes are added to filenames.
- [ ] TypeScript imports resolve from `/api/leads/*` to `/lib/leads/*`.
- [ ] No secrets are committed.
- [ ] No real PII is committed in sample payloads.

## Environment checks

- [ ] `PARTNER_INTAKE_ACTION_TOKEN` is set for internal/API test.
- [ ] Optional `PARTNER_LEAD_SUBMISSION_TOKEN` is set only if separate lead-submit auth is desired.
- [ ] `PARTNER_INTAKE_STORAGE_MODE=mock` for first run.
- [ ] `PARTNER_INTAKE_DRY_RUN=true` for first run.

## Endpoint checks

### POST `/api/leads/submit`

- [ ] `GET` returns `405 METHOD_NOT_ALLOWED`.
- [ ] Missing Bearer token returns `401 UNAUTHORIZED`.
- [ ] Bad Bearer token returns `401 UNAUTHORIZED`.
- [ ] Invalid JSON returns `400 INVALID_JSON`.
- [ ] Missing `partner_id` returns `400 VALIDATION_ERROR`.
- [ ] Missing `business.name` returns `400 VALIDATION_ERROR`.
- [ ] Missing `contact.name` returns `400 VALIDATION_ERROR`.
- [ ] Invalid email returns `400 VALIDATION_ERROR`.
- [ ] `consent_confirmed=false` returns `400 VALIDATION_ERROR`.
- [ ] Valid payload returns `202`.
- [ ] Valid payload returns `status=manual_review`.
- [ ] Valid payload returns `review_status=needs_review`.
- [ ] Valid payload returns `manual_review_required=true`.
- [ ] Valid payload includes `partner_id`, `tracking_id`, and `referral_source`.

### GET `/api/leads/[lead_id]`

- [ ] Missing/bad Bearer token returns `401`.
- [ ] Invalid lead ID returns `400 INVALID_LEAD_ID`.
- [ ] Valid `lead_*` ID returns `200`.
- [ ] Response does not claim approval, qualification, or lender status.

### POST `/api/leads/log-event`

- [ ] Missing/bad Bearer token returns `401`.
- [ ] Invalid JSON returns `400`.
- [ ] Invalid `event_type` returns `400`.
- [ ] Missing `summary` returns `400`.
- [ ] Valid event returns `202`.
- [ ] Event metadata is sanitized.

## Compliance checks

- [ ] Response copy does not say approved.
- [ ] Response copy does not say pre-approved.
- [ ] Response copy does not say guaranteed.
- [ ] Response copy does not say qualified.
- [ ] Response copy does not imply lender review has occurred.
- [ ] Response copy clearly says manual review.
- [ ] Sensitive data is not requested.
- [ ] Sensitive data terms trigger risk flags when present.

## Storage/sync checks

- [ ] No real Notion write occurs in mock/dry-run mode.
- [ ] No real HubSpot write occurs in mock/dry-run mode.
- [ ] Queue output clearly reports storage mode.
- [ ] Future Notion/HubSpot handoff comments exist.
- [ ] Duplicate-handling comments exist.

## No automation checks

- [ ] No email sending code exists.
- [ ] No SMS sending code exists.
- [ ] No webhook fan-out exists.
- [ ] No lender routing code exists.
- [ ] No commission/payout logic exists.

## Sign-off

- [ ] Local endpoint tests pass.
- [ ] Vercel preview endpoint tests pass.
- [ ] Manual review copy is acceptable.
- [ ] Admin/operator understands this is not production underwriting.
