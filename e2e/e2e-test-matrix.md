# E2E Test Matrix

Use this matrix with `/e2e/sample-tally-e2e-payloads.json` and `/e2e/expected-review-queue-results.json`.

| Case ID | Scenario | Endpoint expectation | Review posture | Primary risk being tested |
| --- | --- | --- | --- | --- |
| `tier1-strategic-partner` | Strategic partner | 202 accepted | Fast-track after operator review | Big opportunity still requires review |
| `tier2-broker` | Funding broker | 202 accepted | Conditional approval review | Broker volume/disclosure validation |
| `cpa-bookkeeper` | CPA/bookkeeper | 202 accepted | Approve after manual review | Trusted COI with resource path |
| `business-attorney` | Business attorney | 202 accepted | Approve after manual review | Acquisition/business owner fit |
| `veteran-community-connector` | Veteran/community connector | 202 accepted | Nurture/resource path | Community referral expectations |
| `content-creator-affiliate` | Creator/affiliate | 202 accepted | Disclosure review | Affiliate disclosure and claims control |
| `low-info-signup` | Sparse intake | 202 accepted | Needs info | Incomplete profile handling |
| `high-risk-lead-seller` | Lead seller/high-volume claims | 202 accepted | Blocked pending risk review | Consent, lead quality, guarantee language |
| `duplicate-submission` | Duplicate response ID/email | 202 accepted or duplicate-safe | Duplicate review | Idempotency/retry behavior |
| `malformed-payload` | Invalid JSON | 400 rejected | Not created | Bad body handling |

## Required assertions

For each valid case:

- [ ] Webhook accepts payload with a 2XX response.
- [ ] Returned source is `tally`.
- [ ] Returned classification includes tier/onboarding/manual-review posture.
- [ ] Manual review is required before activation.
- [ ] Storage mode is `mock` or sandbox.
- [ ] No approval/funding/commission guarantee language appears.

For invalid cases:

- [ ] Invalid JSON returns 400.
- [ ] Method mismatch returns 405.
- [ ] Protected endpoints reject bad/missing auth.
- [ ] Duplicate submission does not create multiple active records.

## Evidence to collect

- Request timestamp.
- Endpoint called.
- HTTP status.
- Case ID.
- Request ID if returned.
- Tier/risk/manual-review result.
- Storage mode.
- Admin queue access result.

Do not collect raw body, real email, real phone, bank data, tax data, or private documents.
