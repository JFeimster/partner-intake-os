# Admin Review API Spec

This document describes future admin-only API endpoints for the Partner Intake OS review dashboard. This is a specification, not implementation code.

## Auth model

Recommended model:

- Admin-only Bearer token for MVP internal tools
- Later role-based access control
- Require HTTPS in production
- Never expose these endpoints through public GPT Actions
- Log every decision and sync attempt

Example header:

```http
Authorization: Bearer YOUR_ADMIN_REVIEW_TOKEN
Content-Type: application/json
```

## GET /api/admin/review-queue

Returns review queue records.

### Query parameters

| Parameter | Type | Example | Notes |
|---|---:|---|---|
| status | string | needs_review | Optional filter |
| risk_level | string | high | Optional filter |
| partner_tier | string | tier_1 | Optional filter |
| assigned_owner | string | Jason/Admin | Optional filter |
| limit | number | 50 | Default 50 |

### Response example

```json
{
  "ok": true,
  "count": 2,
  "records": [
    {
      "review_id": "rev_2026_0001",
      "partner_id": "prt_strat_fintech_001",
      "display_name": "Morgan Ellis",
      "company": "LedgerBridge Labs",
      "partner_type": "strategic_fintech_partner",
      "partner_tier": "tier_1",
      "risk_level": "medium",
      "score": 92,
      "review_status": "needs_review",
      "next_action": "schedule_partnership_call"
    }
  ]
}
```

## GET /api/admin/review/:review_id

Returns one full review record.

### Response example

```json
{
  "ok": true,
  "record": {
    "review_id": "rev_2026_0006",
    "partner_id": "prt_risk_006",
    "partner_type": "lead_seller",
    "risk_level": "high",
    "risk_flags": ["bulk_lead_seller", "consent_unclear", "aggressive_claims"],
    "recommended_decision": "reject",
    "review_status": "needs_review"
  }
}
```

## POST /api/admin/review/:review_id/decision

Submits an admin decision.

### Request example

```json
{
  "decision": "approve_with_conditions",
  "partner_tier": "tier_2",
  "onboarding_path": "fast_track_revenue_partner",
  "next_action": "send_broker_welcome_and_resource_pack",
  "reviewer": "Jason/Admin",
  "notes": "Approved after manual review. No risky claims detected."
}
```

### Response example

```json
{
  "ok": true,
  "review_id": "rev_2026_0002",
  "review_status": "approved",
  "updated_at": "2026-07-06T10:00:00-04:00",
  "audit_event_id": "audit_2026_0002"
}
```

## POST /api/admin/review/:review_id/note

Adds a reviewer note.

### Request example

```json
{
  "author": "Partner Ops",
  "note": "Requested missing audience details and website proof.",
  "visibility": "internal"
}
```

### Response example

```json
{
  "ok": true,
  "review_id": "rev_2026_0007",
  "note_id": "note_2026_0007",
  "updated_at": "2026-07-06T10:05:00-04:00"
}
```

## POST /api/admin/review/:review_id/sync

Syncs reviewed record to selected systems.

### Request example

```json
{
  "systems": ["notion", "hubspot"],
  "sync_mode": "reviewed_record_only",
  "requested_by": "Jason/Admin"
}
```

### Response example

```json
{
  "ok": true,
  "review_id": "rev_2026_0003",
  "sync_results": [
    { "system": "notion", "status": "success", "external_id": "notion_page_demo" },
    { "system": "hubspot", "status": "success", "external_id": "hubspot_deal_demo" }
  ]
}
```

## Admin-only notes

These endpoints should never be exposed in partner-facing dashboards without authentication. They should not be exposed as Custom GPT Actions unless the GPT is explicitly internal/admin-only and protected by a separate admin token.

## Role-based access notes

Future roles:

- owner_admin: all actions
- partner_ops: approve Tier 2/3, request info, watchlist, notes
- reviewer: view, note, recommend decision
- read_only: view only

## Audit log notes

Audit events should record:

- action type
- reviewer
- timestamp
- previous status
- new status
- systems touched
- IP/session if available
- note or reason

Never log raw secrets, private keys, or sensitive webhook headers.
