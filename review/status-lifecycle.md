# Review Status Lifecycle

## Statuses

| Status | Meaning | Typical owner | Allowed next statuses |
|---|---|---:|---|
| `new` | Record entered review queue. | system | `needs_review`, `archived` |
| `needs_review` | Human review is required before action. | reviewer/admin | `needs_info`, `approved_for_onboarding`, `rejected`, `paused` |
| `needs_info` | Additional partner or lead information is required. | reviewer | `needs_review`, `paused`, `archived` |
| `approved_for_onboarding` | Cleared to start onboarding. Not funding approval. | admin/owner | `paused`, `archived` |
| `rejected` | Not accepted into partner/onboarding path. | admin/owner | `archived`, `needs_review` |
| `paused` | Temporarily stopped because timing, risk, or context is unclear. | reviewer/admin | `needs_review`, `archived` |
| `archived` | Closed/no active workflow. | reviewer/admin | `needs_review` |

## Manual review triggers

Move to `needs_review` when any trigger appears:

- Low-info intake: missing contact, company, audience, role, or source.
- High-risk copy: guaranteed approval, instant funding, no documents needed, guaranteed commission.
- Lead seller ambiguity: vague traffic source, bulk leads, no consent details.
- Partner type conflict: claimed partner type does not match audience or described activity.
- Sensitive-data flag: borrower details appear in open-text notes.
- Duplicate signal: same partner email, website, phone, or lead payload hash.
- Sync conflict: HubSpot, Notion, or database value mismatch.
- Admin override requested.

## Guardrails

`approved_for_onboarding` is a workflow status only. It must never be framed as credit approval, lender approval, funding approval, guaranteed payout eligibility, or guaranteed partner performance.
