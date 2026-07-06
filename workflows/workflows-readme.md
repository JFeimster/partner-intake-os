# Partner Intake OS Workflows README

## Purpose

This folder documents the Batch 12 automation workflows for Partner Intake OS.

These files explain how Tally, Vercel, Notion, HubSpot, Google Sheets, n8n, Activepieces, Custom GPT Actions, and the future Partner Command Center dashboard should work together after the intake/API/dashboard MVP foundation is in place.

This batch creates documentation only. It does not create live automations, API code, dashboard UI, storage code, or OpenAPI specs.

## Files included

| File | Job |
|---|---|
| `new-partner-intake.md` | Main Tally → Vercel → normalize → classify → store → review flow |
| `tier-1-partner-alert.md` | Alerts Jason/admin for high-value strategic/channel partners |
| `standard-welcome-sequence.md` | Welcome/resource flow for approved Tier 2/Tier 3 partners |
| `manual-review-queue.md` | Review queue for risky, incomplete, unclear, Tier 1, or reject partners |
| `resource-recommendation-routing.md` | Assigns resource packs by partner type, audience, path, and risk |
| `campaign-kit-generation.md` | Generates/assigns campaign kit and tracking placeholder |
| `partner-approved-flow.md` | Converts approved partner into activated/onboarding state |
| `partner-watchlist-flow.md` | Routes not-ready partners into nurture/watchlist |
| `hubspot-sync-flow.md` | Maps partner profile to HubSpot contact/company/deal/task fields |
| `notion-sync-flow.md` | Maps partner profile to Notion database fields |
| `n8n-activepieces-flow.md` | Low-code automation blueprint for n8n or Activepieces |

## Recommended implementation order

1. **New Partner Intake**
   - Confirm Tally can hit the Vercel webhook.
   - Confirm normalized intake is created.
   - Confirm classification, scoring, resources, campaigns, and storage behavior.

2. **Manual Review Queue**
   - Build review safety before automating approvals.
   - This catches high-risk partners, incomplete records, Tier 1 candidates, and reject/watchlist cases.

3. **Notion Sync**
   - Use Notion as the first staging/review database if you want fast operational visibility.
   - Best early choice for manual review views and simple admin tracking.

4. **HubSpot Sync**
   - Add once partner records need CRM follow-up, tasks, pipelines, owner routing, and lifecycle tracking.

5. **Tier 1 Partner Alert**
   - Add after review queue exists.
   - High-value partners should get fast attention but not automatic approval.

6. **Resource Recommendation Routing**
   - Attach the right resource pack by partner type and audience.

7. **Campaign Kit Generation**
   - Add only after resources and approval logic are stable.
   - Campaign copy should respect compliance guardrails.

8. **Standard Welcome Sequence**
   - Start with drafts or approval-required sends.
   - Move to auto-send only for low-risk approved partners.

9. **Partner Approved Flow**
   - Use this to create onboarding checklists, dashboard placeholders, and activation tasks.

10. **Partner Watchlist Flow**
    - Route not-ready partners into nurture instead of letting the CRM become a junk drawer.

11. **n8n / Activepieces Low-Code Flow**
    - Use this to orchestrate cross-tool automations once the fields/statuses are stable.

## Core workflow map

```text
Tally FORM_RESPONSE
  ↓
Vercel webhook
  ↓
Signature verification
  ↓
Normalize intake
  ↓
Score + classify
  ↓
Route by tier/risk/status
  ├─ manual review queue
  ├─ Tier 1 alert
  ├─ approved partner flow
  ├─ watchlist/nurture
  └─ reject/manual risk review
  ↓
Sync to Notion / HubSpot / Google Sheets / JSON
  ↓
Assign resources + campaign kit
  ↓
Admin/GPT review
  ↓
Future Partner Command Center dashboard
```

## Status values to keep consistent

Recommended lifecycle statuses:

- `new`
- `normalized`
- `classified`
- `manual_review`
- `priority_review`
- `approved`
- `approved_pending_info`
- `activated_pending`
- `active`
- `watchlist`
- `rejected`
- `archived`

## Risk levels

Use:

- `low`
- `medium`
- `high`

High-risk records should not trigger auto-welcome, auto-resource delivery, campaign generation for external use, or partner approval.

## Partner tiers

Use:

- `tier_1`
- `tier_2`
- `tier_3`
- `tier_4`
- `reject`

Tier 1 is high-value but still requires review. High value does not equal safe. That is how systems get spicy in court.

## Automation guardrails

Do not automate:

- final approval for Tier 1 partners
- approval for high-risk partners
- outbound marketing copy with claims about guaranteed funding or approvals
- credit repair messaging
- commission or payout promises
- dashboard access for unapproved partners
- partner-facing messaging when email/contact info is incomplete

## What should be ready after Batch 12

- Custom GPT setup packet from prior batch
- Tally webhook setup packet from prior batch
- Vercel API scaffold from prior batch
- Storage connector stubs/specs from prior batch
- OpenAPI Action Pack from prior batch
- Dashboard data contracts from prior batch
- Static dashboard MVP from prior batch
- Workflow documentation from this batch

## Next recommended build phase

Do not continue without explicit instruction.

Suggested next phase if requested:

1. Batch 13 — GitHub repo integration and PR checklist
2. Batch 14 — Vercel deployment config
3. Batch 15 — OpenAPI validation and GPT Action test repair
4. Batch 16 — Notion database creation packet
5. Batch 17 — HubSpot property and pipeline setup packet
6. Batch 18 — Partner lead submission module
7. Batch 19 — Partner tracking link builder
8. Batch 20 — Admin review dashboard

## Final warning

Workflow automation is leverage, not magic. The safe sequence is:

```text
Classify → Review → Approve → Activate → Automate
```

Do not invert that unless you enjoy operational clown fires.


## Compliance guardrails

- Do not state or imply guaranteed approvals, guaranteed funding amounts, guaranteed credit outcomes, or lender certainty.
- Do not use credit repair positioning.
- Do not use deceptive urgency, fake scarcity, invented testimonials, or “everyone qualifies” language.
- Keep partner communications educational, readiness-based, and operational.
- Escalate anything that smells like bought leads, scraped data, misleading marketing, pressure tactics, or unauthorized financial advice.

## Notes

This is a workflow specification only. It does not create API code, dashboard UI, schemas, storage connectors, or live automations.
