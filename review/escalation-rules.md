# Review Escalation Rules

## Escalation levels

| Level | Trigger | Target role | SLA suggestion |
|---|---|---|---|
| L1 | New or routine review | reviewer | 2 business days |
| L2 | Missing info, duplicate, moderate risk | admin | 1 business day |
| L3 | High-risk claims, sensitive data, strategic partner | owner/admin | same business day |
| L4 | Security, abuse, webhook/fraud concern | owner + integration_service | immediate review |

## Escalation triggers

Escalate when:

- Item remains `new` longer than 24 business hours.
- Item remains `needs_review` longer than 48 business hours.
- Operator marks `manual_review_required=true`.
- Intake contains prohibited funding/copy claims.
- Intake suggests bulk lead selling without consent trail.
- Partner asks about guaranteed commissions or guaranteed approvals.
- PII or borrower-sensitive information appears in open text.
- Source-of-truth conflict cannot be resolved automatically.

## Escalation output

Escalation should create a decision log entry with:

- previous status
- escalation reason
- old owner
- new owner or role
- timestamp
- operator/system actor
- safe summary

Notifications are **not** sent in this batch. Batch 38 defines notification workflow stubs.
