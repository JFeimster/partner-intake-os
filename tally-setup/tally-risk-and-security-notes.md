# Tally Risk and Security Notes

## Purpose

This file defines the security, privacy, and compliance guardrails for the Tally webhook setup.

The operating principle is blunt: collect enough information to classify and activate the right partners, but do not turn the intake pipeline into a public PII confetti cannon. 🎯

## PII handling rules

Partner submissions may include personally identifiable information and sensitive business context.

Treat the following as protected operational data:

- First name
- Last name
- Email
- Phone
- Company
- Website
- Location
- Free-text notes
- Referral volume claims
- CRM/tool stack
- Client/audience descriptions
- Any borrower/client details accidentally pasted into notes

Rules:

1. Do not commit live Tally payloads to GitHub.
2. Do not paste live submissions into public issues, PR comments, docs, or screenshots.
3. Do not log full raw payloads in production.
4. Use request IDs for troubleshooting.
5. Mask emails and phones in logs when possible.
6. Store records only in approved systems such as Notion, HubSpot, Google Sheets, Supabase, or another chosen secure store.
7. Keep sample records fictional.
8. Delete test submissions from live systems after validation if they are not needed.

## Webhook signature rules

Use webhook signature verification for inbound Tally submissions.

Required environment variable:

```text
TALLY_SIGNING_SECRET
```

Rules:

- Enable signing secret in Tally.
- Store the same secret in Vercel.
- Reject requests with missing or invalid signatures when production verification is enabled.
- Do not bypass signature verification in production.
- Rotate the secret if it is exposed.
- Never print the secret in logs.

## API token separation

Use separate credentials for separate trust boundaries.

```text
TALLY_SIGNING_SECRET          inbound Tally webhook verification
PARTNER_INTAKE_ACTION_TOKEN   GPT Action Bearer token authentication
```

## Why `TALLY_SIGNING_SECRET` and `PARTNER_INTAKE_ACTION_TOKEN` must be separate

These two values protect different doors.

`TALLY_SIGNING_SECRET` proves that an inbound webhook request came from Tally.

`PARTNER_INTAKE_ACTION_TOKEN` proves that a GPT Action request is allowed to call safe Partner Intake API endpoints.

Do not reuse the same token because:

- If the GPT Action token leaks, attackers should not be able to forge Tally webhooks.
- If the Tally signing secret leaks, attackers should not be able to call GPT-facing partner endpoints.
- Token rotation is cleaner when each credential has one job.
- Logs, debugging, and blast-radius control are easier.

Same key for every lock is not security. It is a locksmith’s villain origin story.

## Do not expose Tally webhook in GPT Actions

Do not expose this endpoint in the OpenAPI Action Pack:

```text
POST /api/tally/partner-intake-webhook
```

Reason:

- It is an inbound system endpoint for Tally.
- It accepts raw webhook payloads.
- It may rely on Tally-specific signature verification.
- GPT does not need to create fake Tally submissions.
- Exposing it increases replay, spoofing, and accidental duplicate intake risk.

Safe GPT-facing endpoints are the partner intelligence endpoints created in Batch 05 and exposed in Batch 07.

## Logging recommendations

Production logs should be useful without becoming a liability.

Log:

- Request ID
- Timestamp
- Source: `tally`
- Environment: `local`, `preview`, or `production`
- Signature verification result: pass/fail
- Webhook event type
- Storage mode
- Normalization success/failure
- Classification status
- Risk level
- Manual review required: true/false
- Error code and safe message

Example safe log:

```json
{
  "request_id": "req_20260706_001",
  "source": "tally",
  "event_type": "FORM_RESPONSE",
  "signature_valid": true,
  "storage_mode": "notion",
  "classification_status": "completed",
  "risk_level": "low",
  "manual_review_required": false
}
```

## What not to log

Do not log:

- Full raw Tally payloads in production
- Full email addresses where avoidable
- Full phone numbers
- Full notes fields
- Borrower/client names accidentally included in notes
- Secrets
- Bearer tokens
- Signing secret values
- Stack traces containing environment values
- Full webhook headers if they include signatures or auth tokens

A safer masked example:

```json
{
  "email_domain": "example.com",
  "phone_present": true,
  "notes_present": true,
  "notes_length": 184
}
```

## Manual review triggers

Route to manual review when any of the following are present:

### Incomplete or unclear profile

- Missing name
- Missing email
- Missing company/brand
- Missing audience
- No clear desired partner role
- No referral volume context
- Generic “I want to make money” submission

### Compliance risk

- Guaranteed approvals
- Guaranteed funding amounts
- “Everyone qualifies” language
- “No docs, no problem” style claims
- Credit repair claims
- Fake lender certainty
- Deceptive urgency
- Fabricated testimonials
- Unapproved use of lender names
- Borrower data shared without consent

### Lead-source risk

- Purchased leads
- Scraped leads
- Resold leads
- “Aged leads”
- No consent trail
- Vague traffic source
- Incentivized leads without disclosure
- High-volume lead seller with no compliance process

### Strategic / operational review

- API integration request
- Co-branded landing page request
- White-label request
- Wants dashboard access for a team
- Wants custom payout structure
- Wants to submit leads through their own CRM or AI agent
- Wants to use unreviewed marketing copy

## High-risk partner flags

Use these flags when applicable:

```text
insufficient_information
missing_consent
unclear_lead_source
purchased_leads
lead_resale
scraped_leads
aged_leads
high_pressure_sales
guaranteed_approval_language
guaranteed_funding_amount
fake_lender_certainty
credit_repair_positioning
deceptive_urgency
invented_testimonials
everyone_qualifies_language
unapproved_lender_claims
borrower_pii_exposure
strategic_integration_review
custom_terms_requested
```

## Compliance-safe handling

Partner Intake OS should keep funding and business credit language educational, readiness-based, and operational.

Safe framing:

- “Funding readiness”
- “Common documentation gaps”
- “Available funding paths may depend on lender criteria”
- “We can help review fit and next steps”
- “This does not guarantee approval or funding”
- “Use approved copy and compliant referral language”

Unsafe framing:

- “Guaranteed approval”
- “Guaranteed funding”
- “Everyone qualifies”
- “No credit? No problem”
- “Instant approval for all businesses”
- “We repair business credit”
- “We know lenders will approve this”
- “Fake testimonial goes here”

## No guaranteed approvals

Do not let partner-facing copy imply approval is guaranteed.

Approved style:

```text
Help your clients understand common funding options and readiness gaps.
```

Not approved:

```text
Send us your clients and we will get them approved.
```

## No guaranteed funding amounts

Do not promise specific funding amounts.

Approved style:

```text
Funding options depend on business profile, revenue, documentation, lender criteria, and other factors.
```

Not approved:

```text
Your clients can get $250K guaranteed.
```

## No fake lender certainty

Do not claim a lender will approve a deal unless there is an actual lender decision.

Approved style:

```text
This looks worth reviewing against available funding paths.
```

Not approved:

```text
A lender will definitely approve this.
```

## No credit repair positioning

Do not position the system as credit repair.

Approved style:

```text
Business credit readiness education and documentation checklist.
```

Not approved:

```text
We fix business credit and remove negatives.
```

## No deceptive urgency

Do not create fake deadlines or pressure.

Approved style:

```text
Submit your profile when ready so we can review the next best step.
```

Not approved:

```text
Apply today or lose your funding slot forever.
```

## No invented testimonials

Do not fabricate proof.

Approved style:

```text
Use real approved case studies only after permission and review.
```

Not approved:

```text
“I made $50K in commissions in 7 days!” — fake person
```

## No “everyone qualifies” language

Do not imply universal eligibility.

Approved style:

```text
Different products have different requirements and review criteria.
```

Not approved:

```text
Every business qualifies.
```

## Data retention recommendations

Recommended retention approach:

| Data type | Recommended handling |
|---|---|
| Test submissions | Delete after validation unless needed for QA. |
| Raw Tally payloads | Avoid storing long-term unless required. |
| Normalized intake | Store in chosen CRM/staging system. |
| Classification output | Store with partner record. |
| Risk flags | Store with admin-only visibility. |
| Logs | Keep request metadata, not full PII payload. |
| Rejected high-risk records | Keep minimal audit trail if operationally needed. |
| Secrets | Store only in Vercel/environment manager. |

## Safe testing practices

- Use fictional people and companies.
- Mark test records clearly.
- Do not use real borrower/client names.
- Do not include real funding applications.
- Do not include bank statements, tax IDs, SSNs, EIN documents, driver licenses, or financial documents.
- Do not test with live partner data until signature verification and storage behavior pass.
- Delete or archive test records after validation.

## Production readiness checklist

- [ ] Vercel production endpoint is deployed.
- [ ] `TALLY_SIGNING_SECRET` is set in production.
- [ ] `PARTNER_INTAKE_ACTION_TOKEN` is set in production.
- [ ] Tokens are not reused.
- [ ] Signature verification is enabled.
- [ ] `PARTNER_INTAKE_ENV=production`.
- [ ] `PARTNER_INTAKE_STORAGE_MODE` is intentionally selected.
- [ ] Tally webhook uses `FORM_RESPONSE`.
- [ ] Tally webhook URL points to production, not preview.
- [ ] Optional header `X-Partner-Source: tally` is set.
- [ ] Clean test returns `2XX`.
- [ ] Invalid signature fails.
- [ ] Low-info signup routes to request-more-info or watchlist.
- [ ] High-risk lead seller routes to manual review/reject.
- [ ] No raw full payload logging in production.
- [ ] No Tally webhook endpoint in GPT Actions.
- [ ] Admin knows where to review staged partner records.
- [ ] Test records are deleted or marked as test.
