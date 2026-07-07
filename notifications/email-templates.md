# Email Templates

## Internal: New partner needs review

Subject: New partner needs review

Body:

> A new partner intake is ready for review.
>
> Partner ID: {{partner_id}}
> Review item: {{review_item_id}}
> Risk level: {{risk_level}}
> Recommended action: Open the review queue and make a manual decision.

## Internal: High-risk partner flagged

Subject: High-risk partner flagged

Body:

> A partner intake triggered high-risk review rules.
>
> Reason codes: {{reason_codes}}
> Action: Review before onboarding or sync.

## Internal: Lead submitted

Subject: Lead submitted for review

Body:

> A partner-submitted lead was received for review.
>
> Lead ID: {{lead_id}}
> Partner ID: {{partner_id}}
> Duplicate signal: {{duplicate_result}}
> Consent status: {{consent_status}}

## Partner-facing: Received for review

Subject: Submission received for review

Body:

> Your submission was received for review. Funding options may vary, and no approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.

Partner-facing templates should remain off by default until reviewed.
