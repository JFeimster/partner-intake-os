# Phase 31 Backlog

Prioritized backlog for the next build phase after controlled internal launch.

## P0 — Launch blockers / production hardening

1. **Production auth**
   - Replace token-only admin access with real identity provider.
   - Add MFA.
   - Add per-user sessions.
   - Add admin action audit trail.

2. **Real database**
   - Choose durable system of record.
   - Add partner table.
   - Add lead table.
   - Add activity event table.
   - Add tracking event table.
   - Add audit log table.

3. **Webhook idempotency**
   - Store Tally event IDs.
   - Prevent duplicate partner records.
   - Add replay-safe behavior.
   - Add duplicate-review queue.

4. **Audit logging**
   - Request ID persistence.
   - Admin action events.
   - GPT Action events.
   - Webhook processing events.
   - Sync attempt events.

5. **Rate limiting and abuse controls**
   - Rate-limit API routes.
   - Add request size limits.
   - Add spam/bot protection for public surfaces.

## P1 — Core operating workflow

6. **Partner portal**
   - Partner login.
   - Partner profile view.
   - Resource library.
   - Tracking links.
   - Submit lead page.
   - Campaign kits.

7. **Role-based admin access**
   - Owner.
   - Reviewer.
   - Read-only.
   - Integration service account.

8. **CRM automation**
   - Production HubSpot contact/company creation.
   - Deal/ticket pipeline mapping.
   - Task creation.
   - Safe duplicate matching.
   - Manual review before automation.

9. **Email notifications**
   - Internal alert for Tier 1 partner.
   - Internal alert for high-risk record.
   - Partner welcome draft, not auto-send at first.
   - Missing-info draft.

10. **Activity timeline**
   - Partner timeline.
   - Lead timeline.
   - Tracking event timeline.
   - Operator notes.

## P2 — Growth tools

11. **Analytics dashboard**
   - Partner volume.
   - Campaign performance.
   - Lead submissions.
   - Review queue aging.
   - Source/channel reporting.

12. **Partner resource library**
   - Resource cards.
   - Partner-type filtering.
   - Recommended resources.
   - Partner-ready links.

13. **Campaign kit generator**
   - Campaign themes.
   - Email/social copy.
   - Tracking link assignment.
   - Compliance review before publish.

14. **Partner onboarding checklist**
   - First 24 hours.
   - First 7 days.
   - First 30 days.
   - Required acknowledgments.
   - Resource completion.

15. **Partner status automation**
   - Needs info.
   - Watchlist.
   - Approved for onboarding.
   - Paused.
   - Archived.

## P3 — Monetization and advanced ops

16. **Payout/commission tracking**
   - Do not build until lead status, attribution, CRM sync, and compliance controls are durable.
   - Separate lead status from commission status.
   - Add manual reconciliation.
   - Add payout disclaimers.

17. **Marketplace module**
   - Partner offers.
   - Resource bundles.
   - Approved campaign kits.
   - Partner-specific recommendations.

18. **n8n/Activepieces workflows**
   - New partner intake.
   - Tier 1 alert.
   - Standard welcome draft.
   - Manual review queue.
   - Resource routing.
   - Campaign kit generation.

19. **Google Sheets export**
   - Read-only/reporting export.
   - Not primary database.
   - Operator-friendly QA sheet.

20. **Monitoring and incident response**
   - Error alerts.
   - Webhook failure alerts.
   - Sync failure alerts.
   - Admin login anomalies.

## Recommended Phase 31 title

```text
Phase 31 — Production Data Store + Audit Log Foundation
```

Why: without durable storage and audit logs, every higher-level feature becomes shaky. Do the boring foundation next. It will save you from building a shiny dashboard on wet cardboard. 🧱
