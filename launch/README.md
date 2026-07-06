# Internal Launch QA Packet

## Purpose

This packet is the final Phase 30 launch-control layer for Partner Intake OS. It gives Jason/admin a practical way to review, test, deploy, and use the system internally without pretending the stack is a finished enterprise platform.

The system is ready for controlled internal use when the launch checklists pass, the API routes are deployed behind environment-managed secrets, the GPT Action Pack imports cleanly, Tally test submissions reach the webhook, and review queue behavior is understood.

## What “internal launch” means

Internal launch means:

- Use fake or low-risk sandbox records first.
- Route partner signups into review, not automatic approval.
- Keep admin/operator decisions human-reviewed.
- Treat Notion and HubSpot sync as sandbox/staging until explicitly approved.
- Use the GPT for classification, summaries, CRM-ready fields, resource recommendations, campaign recommendations, and next actions.
- Keep partner-facing claims conservative and readiness-based.

Internal launch does **not** mean:

- Public partner portal launch.
- Automated partner approval.
- Automated lender routing.
- Production payout or commission tracking.
- Guaranteed funding, guaranteed approval, guaranteed earnings, or guaranteed partner revenue.
- Real underwriting or lender decisioning.

## What is ready

| Area | Internal launch posture |
| --- | --- |
| Repo integration | Ready for PR-based merge validation. |
| Vercel test window | Ready for controlled deploy testing. |
| API routes | Ready for mock/sandbox testing after env vars are set. |
| GPT Actions | Ready for import and live endpoint testing. |
| Tally webhook | Ready for fake submission testing. |
| Notion sync | Ready for sandbox/dry-run test. |
| HubSpot sync | Ready for sandbox/dry-run test. |
| Admin route | Ready for lightweight internal access testing. |
| Lead submission API | Ready for review-first fake lead submission testing. |
| Tracking API | Ready for deterministic tracking link generation testing. |
| E2E harness | Ready for Tally-to-review-queue validation. |

## What is not ready

- Enterprise identity and RBAC.
- Production database of record.
- Full audit log store.
- Automated partner approval.
- Automated lender submission.
- Real commission reconciliation.
- Public marketplace launch.
- Production analytics dashboard.
- Partner self-service account management.

## Required pre-launch checks

1. Merge/review Phase 21–30 files in order.
2. Confirm no nested batch folders were committed.
3. Confirm no secrets were committed.
4. Confirm Vercel env vars are set in the correct environment.
5. Confirm GPT Actions expose only safe partner endpoints.
6. Confirm Tally webhook endpoint is not exposed to GPT Actions.
7. Confirm admin route requires token/cookie auth.
8. Run smoke tests and the Phase 29 E2E harness.
9. Run compliance copy review.
10. Decide whether Notion/HubSpot remain dry-run or sandbox-write enabled.

## First users

Use internally first with:

- Jason/admin operator.
- One trusted internal tester.
- One trusted fake partner profile set.
- One controlled Tally test form.
- No real borrower/private financial records.

## Launch posture

The correct posture is: **controlled internal pilot**.

The wrong posture is: “turn it all on and let the robots run partner ops.” That is how small mistakes become production goblins. 🧪⚙️
