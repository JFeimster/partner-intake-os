# Compliance Review Workflow

## Review queue objects

Each compliance queue item should include:

- `queue_item_id`
- `source_type`
- `source_id`
- `content_excerpt`
- `flagged_terms`
- `severity`
- `recommended_rewrite`
- `status`
- `reviewer_id`
- `decision`
- `created_at`
- `updated_at`

## Statuses

- `new`
- `needs_review`
- `rewrite_required`
- `approved_for_use`
- `rejected`
- `archived`

## Workflow

1. Scan content.
2. Assign severity.
3. Generate safe rewrite.
4. Queue high/blocked items for review.
5. Operator approves, rejects, or edits.
6. Write decision to audit log.
7. Update source content only after review.

## Human review triggers

- blocked phrase
- affiliate disclosure missing
- funding certainty implication
- lender certainty implication
- commission/income certainty implication
- credit repair framing
