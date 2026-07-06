# Partner Intake OS Action Test Cases

Use these tests after Batch 05/06 are deployed and the Action Pack is imported into the Partner Intake OS Custom GPT.

## Test 1 — Health check

### Action

`checkHealth`

### Expected result

- `ok: true`
- `status: healthy`
- Timestamp present
- Environment/config status present

### Failure signals

- 404: wrong Vercel domain or missing API route
- 500: runtime/config problem
- Auth failure on health is acceptable only if the deployed API requires auth globally, but Batch 05 health was designed to be public-safe.

---

## Test 2 — Standard CPA/bookkeeper partner classification

### Action

`classifyPartnerIntake`

### Payload

```json
{
  "context": "manual_review",
  "intake": {
    "first_name": "Dana",
    "last_name": "Brooks",
    "email": "dana@example.com",
    "phone": "+1 202-555-0144",
    "company": "Books & Backoffice Co.",
    "website": "https://example.com",
    "partner_type_claimed": "cpa_bookkeeper",
    "audience": "service businesses, contractors, and local operators",
    "industry": "accounting and bookkeeping",
    "location": "Washington, DC metro",
    "funding_experience": "Refers clients who ask about working capital options.",
    "current_tools": ["HubSpot", "Google Sheets"],
    "traffic_or_network_size": "250 active SMB clients",
    "referral_volume_estimate": "2-5 per month",
    "desired_partner_role": "referral partner",
    "notes": "Wants educational referral assets and a clean handoff.",
    "source": "manual",
    "submitted_at": "2026-07-06T12:00:00.000Z"
  }
}
```

### Expected result

- `ok: true`
- `classification.partner_type` should be `cpa_bookkeeper`
- Tier likely `tier_2` or stronger depending scoring logic
- Risk likely `low` or `medium`
- `profile_preview` returned
- No funding approval promises in `reasoning_summary`

---

## Test 3 — Funding broker / ISO classification

### Action

`classifyPartnerIntake`

### Payload

```json
{
  "context": "manual_review",
  "intake": {
    "first_name": "Marcus",
    "last_name": "Lane",
    "email": "marcus@example.com",
    "company": "Lane Funding Group",
    "partner_type_claimed": "funding_broker",
    "audience": "SMB owners seeking working capital, equipment financing, and lines of credit",
    "funding_experience": "Brokered funding conversations for the last two years. Uses CRM follow-up but wants cleaner resources.",
    "current_tools": ["GoHighLevel", "Calendly", "Google Sheets"],
    "traffic_or_network_size": "Active book of 400 prior leads",
    "referral_volume_estimate": "10 per month",
    "desired_partner_role": "revenue partner",
    "source": "manual",
    "submitted_at": "2026-07-06T12:00:00.000Z"
  }
}
```

### Expected result

- `partner_type: funding_broker`
- Likely `tier_1` or `tier_2`
- Likely onboarding path: `fast_track_revenue_partner` or `standard_affiliate_partner`
- Campaign should lean toward broker follow-up or dead lead revival

---

## Test 4 — Low-info intake edge case

### Action

`classifyPartnerIntake`

### Payload

```json
{
  "context": "manual_review",
  "intake": {
    "email": "unknown@example.com",
    "partner_type_claimed": "unknown",
    "notes": "Interested in partnering. Tell me more.",
    "source": "manual",
    "submitted_at": "2026-07-06T12:00:00.000Z"
  }
}
```

### Expected result

- `manual_review_required: true` inside scorecard or classification path
- Missing info should include contact/company/audience/referral fields
- Tier should not be over-inflated
- Recommended next action should request more information or put in review/nurture

---

## Test 5 — High-risk partner edge case

### Action

`classifyPartnerIntake`

### Payload

```json
{
  "context": "manual_review",
  "intake": {
    "first_name": "Rick",
    "last_name": "Blast",
    "email": "rick@example.com",
    "company": "Instant Approvals Leads LLC",
    "partner_type_claimed": "other",
    "audience": "business owners who need guaranteed funding fast",
    "funding_experience": "We sell aged leads and tell people everyone can qualify. We need fast payout links.",
    "traffic_or_network_size": "large scraped list",
    "referral_volume_estimate": "high volume",
    "desired_partner_role": "lead seller",
    "notes": "Need guaranteed approval messaging and same-day funding angles.",
    "source": "manual",
    "submitted_at": "2026-07-06T12:00:00.000Z"
  }
}
```

### Expected result

- `manual_review_required: true`
- `risk_level` likely `high` or `critical`
- Tier should be `reject_risk` or weak/nurture depending scoring implementation
- Risk flags should mention unsafe claims, lead quality, guarantee language, or similar
- No campaign should be activated automatically

---

## Test 6 — Resource recommendation

### Action

`recommendPartnerResources`

### Payload

```json
{
  "partner_type": "cpa_bookkeeper",
  "audience": "service businesses and contractors",
  "onboarding_path": "standard_affiliate_partner",
  "risk_level": "low"
}
```

### Expected result

- `ok: true`
- `recommendations` array returned
- Resources should include educational/readiness resources
- `compliance_safe_positioning` should be present

---

## Test 7 — Onboarding plan generation

### Action

`generatePartnerOnboardingPlan`

### Payload

```json
{
  "partner_id": "ptr_20260706_dana_brooks",
  "partner_type": "cpa_bookkeeper",
  "partner_tier": "tier_2",
  "onboarding_path": "standard_affiliate_partner",
  "risk_level": "low",
  "manual_review_required": false,
  "next_action": "send_resource_pack_and_confirm_partner_context"
}
```

### Expected result

- `first_24_hours`, `first_7_days`, and `first_30_days` arrays returned
- Includes required assets and training
- Includes `what_not_to_automate_yet`

---

## Test 8 — Campaign kit generation

### Action

`generatePartnerCampaignKit`

### Payload

```json
{
  "partner_type": "cpa_bookkeeper",
  "primary_audience": "service businesses and contractors",
  "onboarding_path": "standard_affiliate_partner",
  "partner_tier": "tier_2"
}
```

### Expected result

- Campaign name likely `Warm Referral Readiness Intro`
- `suggested_channels` returned
- `first_post_idea`, `first_email_idea`, and `first_script_idea` returned
- Compliance guardrails present

---

## Test 9 — Log partner event

### Action

`logPartnerEvent`

### Payload

```json
{
  "partner_id": "ptr_20260706_dana_brooks",
  "event_type": "classification_completed",
  "event_source": "gpt",
  "summary": "Classified as cpa_bookkeeper and recommended standard onboarding.",
  "next_action": "send_resource_pack_and_confirm_partner_context",
  "owner": "partner_ops",
  "metadata": {
    "manual_review_required": false,
    "score": 72
  }
}
```

### Expected result

- `ok: true`
- `logged: true`
- `storage_mode` returned
- `event` returned with ID or normalized fields

---

## Test 10 — Bad auth

Run outside GPT with curl and the wrong token.

```bash
curl -i -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/partners/classify"   -H "Authorization: Bearer wrong_token"   -H "Content-Type: application/json"   -d '{"intake":{"email":"test@example.com","source":"manual"}}'
```

### Expected result

- HTTP `401`
- Error body includes code similar to `unauthorized`

---

## Regression checklist

- The Action Pack contains no `/api/tally/partner-intake-webhook` path.
- All operation IDs are present:
  - `checkHealth`
  - `classifyPartnerIntake`
  - `recommendPartnerResources`
  - `generatePartnerOnboardingPlan`
  - `generatePartnerCampaignKit`
  - `logPartnerEvent`
- Auth is Bearer token based.
- No schema copy makes approval guarantees, guaranteed funding amount claims, credit repair claims, fake lender certainty, deceptive urgency, or invented testimonials.
- High-risk partners produce review/reject/watchlist behavior, not automatic activation.
