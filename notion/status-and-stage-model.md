# Status and Stage Model

Partner Intake OS uses simple partner statuses so the review process does not collapse into CRM soup.

## Status definitions

| Status | Meaning | Typical owner | Automation allowed? |
|---|---|---|---:|
| `new` | Intake received but not reviewed. | System/admin | Limited |
| `needs_review` | Requires human review before action. | Admin | No approval automation |
| `missing_info` | Needs more information from partner. | Admin/partner ops | Follow-up only |
| `approved` | Cleared to begin onboarding. | Admin | Yes |
| `onboarding` | Partner is receiving setup, resources, and campaign instructions. | Partner ops | Yes |
| `active` | Partner is live and can submit/refer leads. | Partner ops | Yes |
| `watchlist` | Not ready now, but may be useful later. | Admin | Nurture only |
| `rejected` | Not a fit or too risky. | Admin | No |
| `archived` | Inactive historical record. | Admin | No |

## Stage transition rules

### `new` → `needs_review`

Trigger when:

- Manual Review Required is checked.
- Risk Level is `medium` or `high`.
- Partner Type is unclear.
- Score is below internal approval threshold.
- Notes include prohibited or questionable claims.

### `new` → `approved`

Allowed only when:

- Partner Type is clear.
- Risk Level is `low`.
- Score is strong enough.
- No major compliance flags exist.
- Partner has enough contact/audience info to onboard.

### `needs_review` → `missing_info`

Trigger when:

- Email, company, audience, partner role, website, or referral volume is missing or unclear.
- The partner appears promising but cannot be properly classified.

### `needs_review` → `approved`

Allowed when admin confirms:

- Partner is a fit.
- Risk flags are resolved or acceptable.
- Onboarding path is selected.
- Next Action is assigned.

### `needs_review` → `watchlist`

Use when:

- Partner has potential but weak immediate fit.
- Audience exists but activation path is unclear.
- Referral volume is unproven.
- Partner needs education before activation.

### `needs_review` → `rejected`

Use when:

- Partner is a general consumer rather than a partner.
- Partner asks for credit repair or guaranteed funding positioning.
- Partner appears to sell low-quality or non-consented leads.
- Partner refuses compliance-safe positioning.
- The relationship creates more risk than upside.

### `approved` → `onboarding`

Trigger when:

- Welcome resources are assigned.
- Campaign kit is selected.
- Follow-up task is created.
- Partner receives instructions.

### `onboarding` → `active`

Trigger when:

- Partner has tracking link or submission path.
- Partner understands safe claims and referral expectations.
- Partner has submitted first valid lead or completed launch checklist.

### Any active status → `archived`

Use when:

- Partner is inactive.
- Relationship has ended.
- Record is stale and no longer operational.

## Manual review triggers

Always require manual review when any of these are true:

- Risk Level is `high`.
- Risk Flags include `guarantee_claims`.
- Risk Flags include `credit_repair_language`.
- Risk Flags include `lead_quality_unclear`.
- Partner type is `unqualified_not_fit`.
- Partner claims unusually high lead volume without context.
- Partner wants to market funding with hard approval or amount claims.
- Partner appears to be collecting applicant data without consent.
- Partner is a strategic partner or fintech/vendor integration candidate.

## Decision principles

- Approve based on fit, readiness, trust, and compliance-safe activation.
- Do not approve based only on claimed volume.
- Tier 1 partners should get fast attention, not blind automation.
- Reject risky positioning early. A bad partner scales problems faster than revenue.
