# Link Builder Copy

## Partner-facing intro

Use this tracking link when sharing Partner Command Center resources, funding-readiness checklists, or lead submission pages with your audience. The link helps us attribute the source of the referral and route the submission correctly.

This link does not guarantee approval, funding, terms, or lender acceptance. It only identifies the partner and campaign source so the team can review submissions with the right context.

## Admin-facing intro

Use this builder to create partner-specific links for campaign kits, referral partners, affiliates, brokers, business brokers, CPAs, attorneys, veteran/community connectors, and strategic fintech partners.

Each generated link should include:

- partner ID
- campaign ID
- tracking ID
- destination URL
- referral source
- UTM source
- UTM medium
- UTM campaign
- UTM content
- optional UTM term

## Field helper text

| Field | Helper text |
|---|---|
| Partner ID | Stable internal partner identifier, such as `ptr_cpa_ledgerlane`. |
| Campaign ID | Campaign kit or offer identifier, such as `ck_cpa_cashflow_gap_2026q3`. |
| Destination URL | Where the link sends traffic. Use lead submission, partner intake, or resource pages. |
| Source | Broad source bucket, such as partner, affiliate, broker, COI, event, or watchlist test. |
| Medium | Channel, such as email, newsletter, LinkedIn, YouTube, QR, or direct. |
| Campaign | Analytics campaign name. Keep lowercase and readable. |
| Content | Creative or placement version, such as `newsletter_link_v1`. |
| Term | Optional audience/keyword segment, such as `cash_flow` or `working_capital`. |
| Notes | Internal admin notes. Do not include private applicant data. |

## FAQ

### What does this tracking link do?

It appends attribution parameters to a destination URL so Partner Intake OS can preserve partner, campaign, and channel context.

### Does this track clicks right now?

Not in this static version. Batch 19 generates demo URLs client-side. Real click tracking requires a backend endpoint and storage layer.

### Can partners use these links publicly?

Yes, if the destination page and copy are approved. Keep public claims compliance-safe. Do not imply guaranteed approval, guaranteed funding, or lender certainty.

### Can we use this with QR codes?

Yes, later. For now, copy the generated long URL into a QR tool manually. A future batch can add approved QR generation.

### Should applicant information go in the URL?

No. URLs should only carry attribution parameters. Never include private applicant details in UTM values or tracking IDs.

### What happens when a partner changes campaigns?

Create a new campaign ID or new tracking ID. Do not overwrite old tracking records if they are already in use.

## Compliance-safe notes

Use language like:

- “Check funding readiness.”
- “Submit a business funding inquiry for review.”
- “Share this resource with business owners who want to understand options.”
- “We’ll review the submission and route next steps.”

Avoid language like:

- “Guaranteed approval.”
- “Everyone qualifies.”
- “Get approved today.”
- “Bad credit fixed.”
- “Instant funding guaranteed.”
- “Our lenders will approve you.”

## Button labels

Good labels:

```text
Generate tracking link
Copy generated URL
Load sample campaign
Reset builder
Download sample JSON later
```

Avoid:

```text
Guarantee my commission
Approve this lead
Instant funding link
Everyone qualifies link
```
