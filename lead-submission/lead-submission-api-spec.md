# Lead Submission API Spec

## Purpose

This document defines future-safe API endpoints for partner-submitted leads.

This batch does **not** create API code. It defines the contract so the API can be built cleanly later without duct-taping a CRM to a form like a raccoon built it.

## Auth model

Recommended for v1:

```http
Authorization: Bearer PARTNER_INTAKE_ACTION_TOKEN
```

For partner-facing dashboard use later:

- authenticated partner session
- partner ID from session, not user-editable form field
- rate limits by partner ID and IP
- CSRF protection if using browser session auth
- audit logs for submissions and updates

## Endpoint summary

| Method | Path | Purpose | Exposure |
|---|---|---|---|
| POST | `/api/leads/submit` | Submit a partner lead | Partner dashboard/API |
| GET | `/api/leads/:lead_id` | Retrieve a lead by ID | Admin/partner scoped |
| POST | `/api/leads/log-event` | Log lead activity | Internal/GPT Action later |

## POST `/api/leads/submit`

### Purpose

Accept a partner-submitted business funding lead, validate it, assign status/risk flags, and route it to staging systems.

### Request headers

```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

### Request body

```json
{
  "partner_id": "ptr_broker_1042",
  "tracking_id": "trk_broker_1042_working_capital",
  "campaign_id": "cmp_working_capital_2026q3",
  "referral_source": "tracking_link",
  "business_name": "Harbor City HVAC LLC",
  "owner_first_name": "Renee",
  "owner_last_name": "Maddox",
  "owner_email": "renee.maddox@example.com",
  "owner_phone": "+1-555-010-4920",
  "website": "https://harborcityhvac.example.com",
  "industry": "home_services",
  "location": "Baltimore, MD",
  "time_in_business": "2_to_5_years",
  "monthly_revenue_range": "50k_to_100k",
  "requested_amount_range": "50k_to_100k",
  "funding_purpose": ["equipment", "working_capital"],
  "urgency": "medium",
  "consent_confirmed": true,
  "acknowledgment_confirmed": true,
  "notes": "Owner requested a funding readiness review. No outcome promised."
}
```

### Success response

```json
{
  "ok": true,
  "lead_id": "lead_20260706_001",
  "status": "submitted",
  "routing": {
    "review_lane": "standard_review",
    "systems": ["notion", "hubspot"],
    "manual_review_required": true
  },
  "risk_flags": ["none"],
  "next_action": "admin_review"
}
```

### Validation error response

```json
{
  "ok": false,
  "error": "validation_error",
  "message": "Missing required field: consent_confirmed",
  "code": "LEAD_VALIDATION_FAILED",
  "details": [
    {
      "field": "consent_confirmed",
      "issue": "Consent must be confirmed before routing."
    }
  ]
}
```

### Recommended status codes

| Status | Meaning |
|---:|---|
| 200 | Accepted and routed |
| 201 | Created |
| 400 | Validation error |
| 401 | Missing or invalid auth |
| 403 | Partner not allowed |
| 409 | Possible duplicate |
| 422 | Consent/risk issue |
| 429 | Rate limit |
| 500 | Server error |

## GET `/api/leads/:lead_id`

### Purpose

Retrieve a single lead record.

### Scope rules

- Admin can retrieve any lead.
- Partner can retrieve only leads connected to their partner ID.
- GPT Actions should not expose this broadly until role checks exist.

### Success response

```json
{
  "ok": true,
  "lead": {
    "lead_id": "lead_20260706_001",
    "partner_id": "ptr_broker_1042",
    "business_name": "Harbor City HVAC LLC",
    "status": "needs_review",
    "risk_flags": ["none"],
    "next_action": "admin_review"
  }
}
```

### Not found response

```json
{
  "ok": false,
  "error": "not_found",
  "message": "Lead not found.",
  "code": "LEAD_NOT_FOUND"
}
```

## POST `/api/leads/log-event`

### Purpose

Log activity tied to a lead.

Examples:

- lead submitted
- status changed
- missing info requested
- admin note added
- routed to HubSpot
- routed to Notion
- duplicate flagged
- consent issue flagged

### Request body

```json
{
  "lead_id": "lead_20260706_001",
  "partner_id": "ptr_broker_1042",
  "event_type": "status_changed",
  "event_source": "admin_review",
  "summary": "Lead moved from submitted to needs_review.",
  "created_by": "admin",
  "metadata": {
    "previous_status": "submitted",
    "new_status": "needs_review"
  }
}
```

### Success response

```json
{
  "ok": true,
  "event_id": "evt_lead_20260706_001",
  "logged": true
}
```

## Rate-limit notes

Recommended:

- partner dashboard submissions: 10 per hour per partner ID until trust is established
- API token submissions: 60 per hour per token
- suspicious volume: route to partner manager review
- repeated validation failures: throttle and alert

## Validation rules

Reject or block routing when:

- consent is false or missing
- partner ID is missing or invalid
- owner email and phone are both unusable
- business name is missing
- funding purpose is missing
- risk flags require human review before follow-up

## Future GPT Action exposure recommendation

Do not expose lead submission to GPT Actions until:

- partner IDs are validated server-side
- role-based access exists
- consent handling is enforced
- duplicate checking exists
- rate limits are active
- audit logs exist

Safer GPT-facing future operation IDs:

```text
validateLeadSubmission
summarizeLeadForReview
logLeadReviewEvent
```

Avoid exposing unrestricted `submitLead` to GPT until controls are in place.
