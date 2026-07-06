# Tracking Link API Implementation

Phase 28 implements the Partner Intake OS tracking link API.

## Purpose

Create partner and campaign tracking links, retrieve demo tracking records, and log basic attribution events without overbuilding analytics.

This is not a shortlink service, attribution warehouse, commission engine, payout engine, or behavioral tracking platform.

## Routes

```text
POST /api/tracking/create-link
GET  /api/tracking/[tracking_id]
POST /api/tracking/log-event
GET  /api/tracking/partner/[partner_id]
```

## Auth

All tracking routes require Bearer auth.

The API checks:

```text
PARTNER_INTAKE_ACTION_TOKEN
PARTNER_TRACKING_API_TOKEN
```

`PARTNER_INTAKE_ACTION_TOKEN` is preferred when the tracking routes are used by internal GPT Actions or internal operators. `PARTNER_TRACKING_API_TOKEN` can be added later for partner portal or dashboard usage.

## Storage behavior

Phase 28 does not persist tracking records.

Response payloads include:

```json
{
  "saved": false,
  "mode": "mock"
}
```

That is intentional. Real storage belongs in a later hardening phase after database, admin audit logging, and partner permissions are stable.

## Generated URL behavior

The create-link endpoint returns:

- `tracking_id`
- `partner_id`
- `campaign_id`
- `generated_url`
- `destination_url`
- `destination_url_with_utm`
- `utm`

Generated URLs are deterministic demo URLs. The same partner, campaign, destination, and channel should produce the same tracking ID.

## UTM rules

The system preserves and applies:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`

Defaults:

```text
utm_source   = partner_id
utm_medium   = referral
utm_campaign = campaign_id
```

## Event types

Allowed event stubs:

```text
click
lead_started
lead_submitted
manual_review
```

Do not submit sensitive data in event metadata. Keep metadata limited to safe routing context such as page, channel, campaign surface, or component.

## Not included in Phase 28

- No Bitly
- No Rebrandly
- No TinyURL
- No external API calls
- No browser fingerprinting
- No behavioral profiling
- No commission calculations
- No payout calculations
- No real analytics dashboard
- No real database persistence
- No sensitive personal data tracking

## Future handoff points

Later phases can wire:

1. Tracking record persistence.
2. Event timeline persistence.
3. Partner dashboard reporting.
4. Admin audit review.
5. CRM activity sync.
6. Commission-safe attribution reporting.
7. Role-based partner access.
