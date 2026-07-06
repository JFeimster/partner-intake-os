# Operator Runbook

This is the practical daily-use guide for Jason/admin.

## Operator role

The operator reviews intake, checks classifications, resolves missing data, approves next actions, and keeps the system inside compliance/safety boundaries.

The operator does **not** treat GPT/API output as a final approval, underwriting decision, lender decision, or payout decision.

## New partner intake review flow

1. New intake arrives from Tally or manual GPT review.
2. System normalizes fields.
3. System classifies partner type.
4. System recommends tier, onboarding path, resources, campaigns, and next action.
5. Operator reviews:
   - partner type
   - partner tier
   - risk level
   - missing fields
   - compliance issues
   - next action
6. Operator chooses one:
   - approve for onboarding
   - request more information
   - strategic review
   - watchlist/nurture
   - reject/archive
7. Operator logs decision.

## Lead submission review flow

1. Lead enters through API/widget/partner source.
2. API validates consent and required fields.
3. API returns `manual_review` / `needs_review` posture.
4. Operator reviews:
   - permission to submit
   - partner attribution
   - business/contact completeness
   - risk flags
   - sensitive-data issues
5. Operator decides next action:
   - request more info
   - internal review
   - safe handoff to existing funding process
   - archive/reject

Do not call a lead approved, pre-approved, funded, or submitted to lender unless that has actually happened in the real operating process.

## Tracking link creation flow

1. Operator identifies partner and campaign.
2. Create link through tracking API or dashboard tool.
3. Confirm:
   - partner ID
   - campaign name
   - destination URL
   - UTM source/medium/campaign/content/term
4. Copy generated URL into campaign kit.
5. Log campaign assignment.
6. Review clicks/leads manually until analytics layer exists.

Tracking links are attribution aids, not payout proof.

## Manual review flow

Manual review should trigger for:

- Low-info signup.
- High-risk lead seller.
- “Guaranteed results” copy.
- Unclear partner role.
- Missing consent.
- Sensitive data in notes.
- Unexpected webhook payload.
- Duplicate submission.
- Suspicious source/channel.
- Strategic partner needing human relationship review.

## Escalation rules

Escalate immediately if:

- Secret is exposed.
- Real sensitive data appears in logs.
- Admin route is publicly accessible.
- GPT Action exposes admin/Tally endpoints.
- API accepts bad auth.
- Tally sends data to wrong environment.
- Notion/HubSpot writes into production unintentionally.
- Partner-facing copy includes guarantees.

## What to do when something breaks

### API route fails

1. Confirm route path.
2. Confirm deploy succeeded.
3. Confirm env vars.
4. Check Vercel logs.
5. Test with curl.
6. Capture request ID.
7. Add issue to launch log.

### GPT Action fails

1. Check OpenAPI server URL.
2. Check operation ID.
3. Check Bearer token.
4. Run the same request with curl.
5. If curl passes and GPT fails, repair Action schema descriptions/auth.

### Tally webhook fails

1. Check webhook URL.
2. Check event type.
3. Check signing secret.
4. Test endpoint directly with fake payload.
5. Disable webhook if real submissions are at risk.

### Notion/HubSpot sync fails

1. Confirm dry-run setting.
2. Confirm token.
3. Confirm database/properties/pipeline.
4. Stop non-dry-run writes.
5. Fix mapping before retry.

### Admin dashboard fails

1. Check admin env vars.
2. Test `/api/admin/session`.
3. Test `/api/admin/review-queue` with Bearer token.
4. Clear browser cookies.
5. Try login again.

## Daily launch pilot routine

During Week 1:

1. Review new test records.
2. Run one GPT Action test.
3. Run one Tally webhook test.
4. Check Vercel logs.
5. Check admin review queue.
6. Check issue log.
7. Update Phase 31 backlog.
8. Keep the system boring, traceable, and review-first.
