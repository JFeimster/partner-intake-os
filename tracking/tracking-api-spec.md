# Tracking API Spec

## Status

This file documents future API endpoints. Batch 19 does **not** create API code. The static builder generates demo links client-side only.

## Auth model

Recommended auth:

```text
Authorization: Bearer PARTNER_INTAKE_ACTION_TOKEN
```

Future admin-only endpoints should use stronger role-based access before handling real partner data or analytics.

## Rate-limit notes

Recommended limits for future API:

| Endpoint | Suggested limit | Reason |
|---|---:|---|
| `POST /api/tracking/create-link` | 60/min/admin | Prevent link spam. |
| `GET /api/tracking/:tracking_id` | 120/min | Dashboard/UI reads. |
| `POST /api/tracking/log-event` | 600/min | Click/event ingestion may spike. |
| `GET /api/tracking/partner/:partner_id` | 60/min/admin | Reporting query. |

Do not expose raw event logs publicly. Attribution data is operational intelligence, not lobby art.

---

## `POST /api/tracking/create-link`

Creates a tracking link record and returns the generated URL.

### Request

```http
POST /api/tracking/create-link
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "partner_id": "ptr_cpa_ledgerlane",
  "campaign_id": "ck_cpa_cashflow_gap_2026q3",
  "destination_url": "https://distilledfunding.com/partner-intake/submit-lead",
  "source": "partner",
  "medium": "newsletter",
  "campaign": "cpa_cashflow_gap_2026q3",
  "content": "monthly_client_note",
  "term": "cash_flow",
  "notes": "CPA newsletter campaign link."
}
```

### Response `201`

```json
{
  "ok": true,
  "tracking_link": {
    "tracking_id": "trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter",
    "partner_id": "ptr_cpa_ledgerlane",
    "campaign_id": "ck_cpa_cashflow_gap_2026q3",
    "destination_url": "https://distilledfunding.com/partner-intake/submit-lead",
    "generated_url": "https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_cpa_ledgerlane&campaign_id=ck_cpa_cashflow_gap_2026q3&tracking_id=trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter&referral_source=coi&utm_source=partner&utm_medium=newsletter&utm_campaign=cpa_cashflow_gap_2026q3&utm_content=monthly_client_note&utm_term=cash_flow",
    "source": "partner",
    "medium": "newsletter",
    "campaign": "cpa_cashflow_gap_2026q3",
    "content": "monthly_client_note",
    "term": "cash_flow",
    "created_at": "2026-07-06T14:00:00Z",
    "status": "active",
    "notes": "CPA newsletter campaign link."
  }
}
```

### Validation errors `400`

```json
{
  "ok": false,
  "error": "validation_error",
  "message": "partner_id, campaign_id, destination_url, source, medium, campaign, and content are required."
}
```

---

## `GET /api/tracking/:tracking_id`

Returns one tracking link record.

### Request

```http
GET /api/tracking/trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter
Authorization: Bearer YOUR_TOKEN
```

### Response `200`

```json
{
  "ok": true,
  "tracking_link": {
    "tracking_id": "trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter",
    "partner_id": "ptr_cpa_ledgerlane",
    "campaign_id": "ck_cpa_cashflow_gap_2026q3",
    "status": "active",
    "generated_url": "https://distilledfunding.com/partner-intake/submit-lead?..."
  }
}
```

### Not found `404`

```json
{
  "ok": false,
  "error": "not_found",
  "message": "Tracking link not found."
}
```

---

## `POST /api/tracking/log-event`

Logs a click, lead form event, conversion-style event, or admin tracking note.

### Request

```http
POST /api/tracking/log-event
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

```json
{
  "tracking_id": "trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter",
  "partner_id": "ptr_cpa_ledgerlane",
  "campaign_id": "ck_cpa_cashflow_gap_2026q3",
  "event_type": "link_clicked",
  "event_source": "server",
  "landing_url": "https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_cpa_ledgerlane",
  "referrer": "https://ledgerlane.example/newsletter",
  "metadata": {
    "note": "No PII stored in tracking metadata."
  }
}
```

### Response `202`

```json
{
  "ok": true,
  "event_id": "evt_trk_ptr_cpa_ledgerlane_2026q3_click_001",
  "logged": true
}
```

---

## `GET /api/tracking/partner/:partner_id`

Returns tracking links and rollup metrics for one partner.

### Request

```http
GET /api/tracking/partner/ptr_cpa_ledgerlane
Authorization: Bearer YOUR_TOKEN
```

### Response `200`

```json
{
  "ok": true,
  "partner_id": "ptr_cpa_ledgerlane",
  "summary": {
    "links_total": 3,
    "active_links": 2,
    "events_total": 42,
    "lead_submissions_attributed": 4
  },
  "links": [
    {
      "tracking_id": "trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter",
      "campaign_id": "ck_cpa_cashflow_gap_2026q3",
      "status": "active"
    }
  ]
}
```

## Privacy notes

- Store only attribution data required for operations.
- Do not store applicant PII in tracking-event metadata.
- Do not expose partner-level analytics publicly without authentication.
- Treat event data as internal business intelligence.
- Use audit logs when admins create, pause, or retire links.

## Future GPT Action recommendation

Expose only safe admin/helper endpoints to GPT Actions after the backend exists:

- `createPartnerTrackingLink`
- `getPartnerTrackingLink`
- `logPartnerTrackingEvent`
- `listPartnerTrackingLinks`

Do **not** expose unauthenticated click ingestion endpoints to GPT Actions. GPT Actions should create and inspect tracking records, not pretend to be Google Analytics in a trench coat.
