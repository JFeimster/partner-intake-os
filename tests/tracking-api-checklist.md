# Tracking API Checklist

Use this checklist before merging Phase 28.

## Scope

- [ ] Only Phase 28 files were added.
- [ ] No external shortlink provider was added.
- [ ] No external analytics provider was added.
- [ ] No production storage write is claimed.
- [ ] No sensitive personal data is tracked.
- [ ] No commission or payout logic was added.

## File placement

- [ ] `/api/tracking/create-link.ts` exists.
- [ ] `/api/tracking/[tracking_id].ts` exists.
- [ ] `/api/tracking/log-event.ts` exists.
- [ ] `/api/tracking/partner/[partner_id].ts` exists.
- [ ] `/lib/tracking/tracking-id.ts` exists.
- [ ] `/lib/tracking/campaign-id.ts` exists.
- [ ] `/lib/tracking/utm-builder.ts` exists.
- [ ] `/lib/tracking/validate-tracking-link.ts` exists.
- [ ] `/lib/tracking/tracking-events.ts` exists.
- [ ] `/tracking/api-implementation.md` exists.
- [ ] `/tracking/api-test-payloads.json` exists.

## Auth

- [ ] Missing Bearer token returns `401`.
- [ ] Bad Bearer token returns `401`.
- [ ] Valid Bearer token allows request.
- [ ] Token is read from environment variables only.
- [ ] No token is committed in sample files.

## Create link endpoint

- [ ] `POST /api/tracking/create-link` accepts a valid payload.
- [ ] Missing `partner_id` returns validation error.
- [ ] Missing `destination_url` returns validation error.
- [ ] Invalid destination URL returns validation error.
- [ ] Localhost destination URL is rejected.
- [ ] Sensitive metadata keys are rejected or stripped.
- [ ] Response includes `tracking_id`.
- [ ] Response includes `partner_id`.
- [ ] Response includes `campaign_id`.
- [ ] Response includes `generated_url`.
- [ ] Response includes `destination_url_with_utm`.
- [ ] Response includes UTM object.
- [ ] Response says storage is stubbed/not persisted.

## Tracking record endpoint

- [ ] `GET /api/tracking/[tracking_id]` requires auth.
- [ ] Invalid tracking ID returns `400`.
- [ ] Valid tracking ID returns stub record.
- [ ] Stub record contains no sensitive personal data.

## Tracking event endpoint

- [ ] `POST /api/tracking/log-event` requires auth.
- [ ] Allowed event type `click` works.
- [ ] Allowed event type `lead_started` works.
- [ ] Allowed event type `lead_submitted` works.
- [ ] Allowed event type `manual_review` works.
- [ ] Unknown event type returns validation error.
- [ ] Metadata is sanitized.
- [ ] Response says event is not persisted in Phase 28.

## Partner records endpoint

- [ ] `GET /api/tracking/partner/[partner_id]` requires auth.
- [ ] Missing `partner_id` returns validation error.
- [ ] Valid `partner_id` returns stub tracking records.
- [ ] Response does not expose private lead data.

## Privacy and compliance

- [ ] No SSN, bank, tax, credential, underwriting, or lender data appears in samples.
- [ ] No promise of commission attribution finality.
- [ ] No claim that click tracking equals payout eligibility.
- [ ] No hidden behavioral tracking is introduced.
- [ ] No external analytics scripts were added.

## Deployment

- [ ] Add env var `PARTNER_INTAKE_ACTION_TOKEN` or `PARTNER_TRACKING_API_TOKEN`.
- [ ] Add optional `TRACKING_BASE_URL`.
- [ ] Add optional `PARTNER_BASE_URL`.
- [ ] Smoke test on Vercel preview before production.
- [ ] Document failures before moving to Phase 29.
