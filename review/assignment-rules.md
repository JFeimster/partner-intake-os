# Review Assignment Rules

## Assignment principles

Assign review items to the lowest-risk qualified role first. Escalate only when risk, value, or ambiguity justifies it.

## Default routing

| Condition | Assigned role | Reason |
|---|---|---|
| New low-risk referral partner | reviewer | Standard qualification |
| Broker/ISO with funding experience | reviewer or admin | Deal-flow relevance |
| CPA/bookkeeper/attorney COI | admin | Higher-trust channel potential |
| Strategic partner/vendor | owner | Commercial leverage |
| High-risk language or shady lead seller | admin | Compliance risk |
| Duplicate lead/partner signal | reviewer | De-dupe workflow |
| Sync conflict | admin | Source-of-truth decision |

## Load balancing

Use `assigned_to_user_id` when known. Use `assigned_role` when no specific user is available.

Suggested assignment algorithm:

1. If `risk_level=high`, assign to `admin`.
2. If `partner_tier=tier_1`, assign to `owner`.
3. If duplicate or missing-info flag exists, assign to `reviewer`.
4. If integration/sync issue exists, assign to `integration_service`.
5. Otherwise assign to `reviewer`.

## Operator notes

Operator notes should summarize the decision reason without storing raw sensitive data.

Safe note:

> CPA partner looks viable. Needs audience details and preferred intro workflow before onboarding.

Unsafe note:

> Borrower bank statement shows deposits of...

No borrower document details in queue notes. Keep the ops layer clean.
