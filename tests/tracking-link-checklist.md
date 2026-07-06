# Tracking Link Checklist

Use this checklist before merging Batch 19.

## File presence

| Pass/Fail | Check |
|---|---|
|  | `/tracking/README.md` exists. |
|  | `/tracking/tracking-link-spec.md` exists. |
|  | `/tracking/utm-rules.md` exists. |
|  | `/tracking/partner-id-rules.md` exists. |
|  | `/tracking/campaign-id-rules.md` exists. |
|  | `/tracking/tracking-link.schema.json` exists. |
|  | `/tracking/sample-tracking-links.json` exists. |
|  | `/tracking/tracking-event.schema.json` exists. |
|  | `/tracking/tracking-api-spec.md` exists. |
|  | `/tracking/link-builder-copy.md` exists. |
|  | `/site/partner-intake/tracking-link-builder.html` exists. |
|  | `/site/partner-intake/tracking-link-builder.css` exists. |
|  | `/site/partner-intake/tracking-link-builder.js` exists. |
|  | `/site/partner-intake/data/sample-tracking-links.json` exists. |

## Schema checks

| Pass/Fail | Check |
|---|---|
|  | `tracking-link.schema.json` uses JSON Schema Draft 2020-12. |
|  | `tracking-link.schema.json` includes required fields: `tracking_id`, `partner_id`, `campaign_id`, `destination_url`, `generated_url`, `source`, `medium`, `campaign`, `content`, `term`, `created_at`, `status`, `notes`. |
|  | `tracking-event.schema.json` uses JSON Schema Draft 2020-12. |
|  | `tracking-event.schema.json` includes required fields: `event_id`, `tracking_id`, `partner_id`, `campaign_id`, `event_type`, `event_source`, `landing_url`, `referrer`, `timestamp`, `metadata`. |
|  | Sample tracking links include at least 8 records. |
|  | Samples cover broker, CPA/bookkeeper, attorney, business broker, veteran/community connector, affiliate/content creator, strategic fintech partner, and watchlist/test partner. |

## Static page checks

| Pass/Fail | Check |
|---|---|
|  | Page loads at `/site/partner-intake/tracking-link-builder.html`. |
|  | Sample presets load from `/site/partner-intake/data/sample-tracking-links.json`. |
|  | Form generates a URL client-side. |
|  | URL includes `partner_id`, `campaign_id`, `tracking_id`, `referral_source`, and UTM parameters. |
|  | Copy generated URL button works. |
|  | Copy JSON button works. |
|  | Reset button works. |
|  | Mobile layout is usable. |
|  | Page clearly says static/demo MVP. |

## Compliance checks

| Pass/Fail | Check |
|---|---|
|  | No fake approval claims. |
|  | No guaranteed funding claims. |
|  | No credit repair framing. |
|  | No invented testimonials. |
|  | No real PII in sample URLs. |
|  | No secret keys or API tokens in static files. |
|  | Copy treats attribution as source routing, not legal proof of compensation. |

## Future API checks

| Pass/Fail | Check |
|---|---|
|  | API spec is documented as future-only. |
|  | No API code was created in this batch. |
|  | No real shortlink API is used. |
|  | No live tracking backend is implied. |
|  | Future GPT Action exposure is limited to safe authenticated endpoints. |
