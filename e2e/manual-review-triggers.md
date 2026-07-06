# Manual Review Triggers

Every new partner intake should be reviewed before activation. These triggers determine urgency and routing.

## Automatic manual review

Trigger review when any of these appear:

- New partner signup from Tally.
- Missing company, audience, or partner type.
- Claimed high referral volume.
- Funding broker, affiliate, or lead seller role.
- Any phrase implying guaranteed funding, guaranteed approval, everyone qualifies, guaranteed commissions, or guaranteed income.
- Any unclear consent process.
- Any mention of purchased leads, scraped lists, bulk leads, aged leads, co-reg leads, or cold data.
- Any request to submit borrower files, tax IDs, bank credentials, or private financial documents.
- Duplicate response ID, duplicate email, duplicate company, or duplicate tracking ID.

## Tier-specific review posture

| Partner direction | Review posture | Action |
| --- | --- | --- |
| Tier 1 strategic partner | Fast-track review | Verify fit, assign owner, schedule call |
| Tier 2 broker | Conditional review | Validate consent process, disclosure, deal quality |
| CPA/bookkeeper | Standard review | Send education resources and referral flow |
| Business attorney | Standard review | Confirm audience and referral boundaries |
| Veteran/community connector | Nurture review | Provide readiness resources and intro scripts |
| Content creator/affiliate | Disclosure review | Approve copy and affiliate language before promotion |
| Low-info signup | Needs info | Request missing company/audience/role details |
| Lead seller | Risk review/watchlist | Do not activate without proof of permission-based sourcing |
| Duplicate submission | Duplicate review | Merge, ignore retry, or flag for operator decision |
| Malformed payload | Not created | Return safe error and fix sender/payload shape |

## Prohibited activation language

Do not write or return:

- Approved partner.
- Guaranteed approval.
- Guaranteed funding.
- Guaranteed commissions.
- Everyone qualifies.
- Pre-approved.
- Risk-free funding.
- Lender ready.

## Safer operational language

Use:

- Accepted for review.
- Needs manual review.
- Recommended next action.
- Readiness path.
- Partner fit review.
- Compliance/disclosure review required.
- Funding options may vary.
- Submission does not guarantee approval, funding, rates, terms, timelines, lender review, commissions, income, or any specific business outcome.

## Safe logging rules

Allowed in logs:

- `case_id`
- `request_id`
- HTTP status
- route
- storage mode
- review status
- risk flag count
- timestamp

Not allowed in logs:

- Real emails
- Phone numbers
- Bank information
- Tax IDs
- Account numbers
- Social Security numbers
- Private documents
- Raw Tally payloads
- Borrower financial docs
- Full free-text notes from real users
