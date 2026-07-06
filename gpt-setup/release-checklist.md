# Release Checklist

Use this before releasing Partner Intake OS for internal use.

## Release stage

Start with:

```txt
Release stage: Internal-only pilot
Audience: Jason / Moonshine Capital admin / trusted operators only
Public sharing: Off
```

## Internal-only release checks

| Check | Status |
|---|---:|
| GPT is private/internal only | [ ] |
| Correct name is set: Partner Intake OS | [ ] |
| Description is accurate and does not imply lending approval authority | [ ] |
| Instructions pasted from `/gpt/instructions.md` | [ ] |
| Conversation starters are useful and not public-borrower facing | [ ] |
| Knowledge files uploaded from approved checklist | [ ] |
| No real partner PII uploaded as knowledge | [ ] |
| Actions configured only after API deployment | [ ] |
| Tally webhook endpoint is not exposed in Actions | [ ] |

## QA tests

Run and record result.

| Test | Pass / Edit / Fail | Notes |
|---|---|---|
| Funding broker |  |  |
| CPA/bookkeeper |  |  |
| Small business attorney |  |  |
| Business broker |  |  |
| Veteran community connector |  |  |
| Creator affiliate |  |  |
| Low-info signup |  |  |
| Shady lead seller / high-risk |  |  |
| Strategic fintech partner |  |  |
| Unqualified consumer |  |  |

## Risk checks

Confirm the GPT does not produce:

| Prohibited issue | Status |
|---|---:|
| Guaranteed approvals | [ ] |
| Guaranteed funding amounts | [ ] |
| Fake lender certainty | [ ] |
| Credit repair positioning | [ ] |
| Deceptive urgency | [ ] |
| Invented testimonials | [ ] |
| “Everyone qualifies” claims | [ ] |
| Auto-approval of high-risk partners | [ ] |
| Recommendations to buy/sell leads without validation | [ ] |
| Advice to bypass compliance review | [ ] |

## Data privacy checks

| Check | Status |
|---|---:|
| Knowledge files contain no live partner PII | [ ] |
| Test prompts use synthetic data | [ ] |
| API tokens are not pasted into knowledge or instructions | [ ] |
| Tally signing secret is not used as GPT Action token | [ ] |
| CRM records are not exposed in examples | [ ] |
| Partner notes avoid unnecessary sensitive personal details | [ ] |
| Public examples use fake emails and fake domains only | [ ] |

## Endpoint auth checks

| Endpoint | Expected auth | Status |
|---|---|---:|
| `GET /api/health` | Usually public or lightweight check | [ ] |
| `POST /api/partners/classify` | Bearer token | [ ] |
| `POST /api/partners/recommend-resources` | Bearer token | [ ] |
| `POST /api/partners/generate-onboarding-plan` | Bearer token | [ ] |
| `POST /api/partners/generate-campaign-kit` | Bearer token | [ ] |
| `POST /api/partners/log-event` | Bearer token | [ ] |
| `POST /api/tally/partner-intake-webhook` | Tally signing secret / not exposed to GPT Actions | [ ] |

## Action tests

| Test | Expected result | Status |
|---|---|---:|
| `checkHealth` | System status returned | [ ] |
| `classifyPartnerIntake` | Structured classification returned | [ ] |
| `recommendPartnerResources` | Safe resource recommendations returned | [ ] |
| `generatePartnerOnboardingPlan` | 24h / 7d / 30d plan returned | [ ] |
| `generatePartnerCampaignKit` | Campaign kit returned with guardrails | [ ] |
| `logPartnerEvent` | Mock or configured storage confirmation returned | [ ] |
| Bad token | Protected endpoints reject request | [ ] |

## Dashboard-readiness notes

Before Batch 10 and Batch 11, confirm the GPT can produce stable:

- `partner_id`
- `display_name`
- `partner_type`
- `partner_tier`
- `onboarding_path`
- `risk_level`
- `status`
- `next_action`
- `recommended_resources`
- `recommended_campaigns`
- `manual_review_required`
- `risk_flags`
- `created_at`
- `updated_at`

If the field names drift, fix schemas/instructions before building UI. Otherwise the dashboard becomes a beautiful vending machine full of soup.

## Launch notes template

```txt
Release version:
Release date:
Owner:
GPT link:
Vercel API domain:
Action Pack file:
Storage mode:
Known limitations:
Passed tests:
Failed tests:
Manual review required before broader sharing:
```

## Go / no-go rule

Go only if:

- high-risk test passes
- low-info test passes
- bad-auth test passes
- no prohibited funding claims appear
- partner profile JSON is stable
- GPT is private/internal
- Action endpoints are correctly scoped
- Tally webhook is not exposed in Actions

No-go if:

- the GPT guarantees approvals
- the GPT suggests credit repair
- the GPT invents lender certainty
- the GPT auto-approves shady lead sellers
- the GPT leaks or requests sensitive data unnecessarily
- protected endpoints work without auth

## Post-release monitoring

During the internal pilot, log:

- misclassifications
- missing fields
- repetitive recommendations
- Action errors
- unsafe wording
- partner types that need new routing
- campaign recommendations that need sharper CTAs
- dashboard fields that need normalization

This is where the machine graduates from “neat demo” to actual partner-ops weapon.
