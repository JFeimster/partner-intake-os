# Admin Review Dashboard Checklist

Use this checklist before merging or deploying the Batch 20 admin review dashboard.

## Static page

- [ ] `/site/partner-intake/admin/index.html` loads locally.
- [ ] `/site/partner-intake/admin/styles.css` loads without console errors.
- [ ] `/site/partner-intake/admin/script.js` loads without console errors.
- [ ] `data/sample-review-queue.json` loads successfully.
- [ ] Static MVP note is visible.

## Sample queue

- [ ] Sample queue includes at least 8 records.
- [ ] Includes Tier 1 strategic partner.
- [ ] Includes Tier 2 broker.
- [ ] Includes Tier 2 CPA/bookkeeper.
- [ ] Includes Tier 3 new affiliate.
- [ ] Includes watchlist partner.
- [ ] Includes high-risk lead seller.
- [ ] Includes missing-info signup.
- [ ] Includes rejected/general consumer.

## Filters

- [ ] Status filter works.
- [ ] Risk filter works.
- [ ] Tier filter works.
- [ ] Search filter works.
- [ ] Reset button clears filters.

## Detail panel

- [ ] Selecting a card opens detail panel.
- [ ] Detail panel shows partner ID.
- [ ] Detail panel shows partner type.
- [ ] Detail panel shows score.
- [ ] Detail panel shows tier.
- [ ] Detail panel shows onboarding path.
- [ ] Detail panel shows risk flags.
- [ ] Detail panel shows recommended next action.
- [ ] Detail panel shows reviewer notes.

## Demo admin controls

- [ ] Approve demo button displays demo-only status.
- [ ] Request info demo button displays demo-only status.
- [ ] Watchlist demo button displays demo-only status.
- [ ] Reject demo button displays demo-only status.
- [ ] Sync demo button displays demo-only status.
- [ ] No button writes to a backend.
- [ ] No button claims real CRM sync.

## Mobile layout

- [ ] Page works at desktop width.
- [ ] Page works at tablet width.
- [ ] Page works at mobile width.
- [ ] Filters remain usable on mobile.
- [ ] Detail panel remains readable on mobile.

## Security and compliance

- [ ] No real API keys are present.
- [ ] No real webhook signing secrets are present.
- [ ] No real partner PII is present.
- [ ] No lender certainty is claimed.
- [ ] No funding approval is claimed.
- [ ] No guaranteed funding amounts are claimed.
- [ ] No credit repair language appears.
- [ ] Future API hooks are clearly marked as future/spec only.

## Future readiness

- [ ] Admin API spec exists.
- [ ] Admin review schema exists.
- [ ] Review workflow doc exists.
- [ ] Queue rules doc exists.
- [ ] Admin actions doc exists.
- [ ] Sample queue matches schema concepts.
