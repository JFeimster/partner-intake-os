# Lead Submission API Implementation

Phase 27 implements the Partner Intake OS lead submission API for approved/internal partners to submit funding leads into a manual-review workflow.

This is not a loan application engine. It does not approve, pre-approve, underwrite, price, route to lenders, send email/SMS, or guarantee any outcome.

## Files

```text
/api/leads/submit.ts
/api/leads/[lead_id].ts
/api/leads/log-event.ts
/lib/leads/lead-id.ts
/lib/leads/validate-lead.ts
/lib/leads/lead-router.ts
/lib/leads/lead-risk.ts
/lib/leads/lead-events.ts
/lead-submission/api-test-payloads.json
/tests/lead-submission-api-checklist.md
```

## Endpoint map

| Endpoint | Method | Purpose | Auth |
|---|---:|---|---|
| `/api/leads/submit` | POST | Submit a partner-attributed lead for manual review | Bearer |
| `/api/leads/[lead_id]` | GET | Return a review-safe lead lookup stub | Bearer |
| `/api/leads/log-event` | POST | Log a review-safe lead activity event | Bearer |

## Authentication

Use Bearer auth.

The endpoint checks:

```text
PARTNER_INTAKE_ACTION_TOKEN
```

Fallback:

```text
PARTNER_LEAD_SUBMISSION_TOKEN
```

Do not expose this token in static files, screenshots, GPT Knowledge, GitHub issues, client-side JavaScript, or partner-facing docs.

## Required lead submission fields

The conceptual contract follows the prior lead schema:

```json
{
  "partner_id": "partner_abc123",
  "tracking_id": "trk_partner_campaign",
  "referral_source": "partner_dashboard",
  "source": "partner_api",
  "business": {
    "name": "Example Business LLC",
    "industry": "Contracting",
    "monthly_revenue_estimate": 85000,
    "time_in_business": "3 years"
  },
  "contact": {
    "name": "Authorized Contact",
    "email": "contact@example.com",
    "phone": "555-0100"
  },
  "funding": {
    "requested_amount_estimate": 75000,
    "use_of_funds": "Equipment and working capital",
    "timeline": "30 days"
  },
  "consent_confirmed": true,
  "consent": {
    "confirmed": true,
    "method": "partner_form_checkbox",
    "captured_at": "2026-07-06T12:00:00.000Z"
  },
  "notes": "Optional review notes. No sensitive data."
}
```

## Validation rules

The API requires:

- `partner_id`
- `business.name`
- `contact.name`
- valid `contact.email` when provided
- `consent_confirmed=true`
- `consent.confirmed=true`
- non-negative numeric estimates

The API rejects malformed JSON and unsupported methods.

## Default review behavior

Every submitted lead returns:

```text
status=manual_review
review_status=needs_review
manual_review_required=true
```

This is intentional. A lead submission is an intake event, not a decision.

## Compliance-safe response copy

Use this response message:

> Lead received for manual review. Submission does not guarantee approval, funding, rates, terms, timelines, lender review, or commissions.

Avoid:

- approved
- pre-approved
- guaranteed
- qualified
- lender-ready
- everyone qualifies
- instant funding
- risk-free

## Partner attribution

The API attaches:

- `partner_id`
- `tracking_id`
- `referral_source`
- `source`
- `external_reference`

## Duplicate handling notes

Duplicate handling is not fully implemented in this phase.

Future duplicate detection should compare:

- `external_reference`
- `partner_id`
- normalized business name
- normalized contact email
- normalized phone
- recent submission timestamp

Duplicates should create a `duplicate_review` event, not overwrite existing records.

## Future Notion/HubSpot sync hooks

`queueLeadForReview()` includes handoff comments for:

- Notion staging/review record creation
- HubSpot contact/company/deal/task creation
- idempotency checks
- immutable activity events
- redacted logs

Do not sync high-risk or sensitive-data submissions without operator review.

## No email/SMS in Phase 27

This phase does not send:

- welcome emails
- lead receipt emails
- SMS confirmations
- CRM task notifications
- partner alerts

Those belong in a later automation phase after review, consent, and storage behavior are stable.
