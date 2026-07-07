# Review Workflow Checklist

## Files

- [ ] `/review/README.md`
- [ ] `/review/status-lifecycle.md`
- [ ] `/review/assignment-rules.md`
- [ ] `/review/escalation-rules.md`
- [ ] `/review/decision-log.md`
- [ ] `/lib/review/*`
- [ ] `/api/admin/review-action.ts`
- [ ] `/api/admin/assign-review.ts`
- [ ] `/api/admin/update-status.ts`

## Manual validation

- [ ] Invalid status returns error.
- [ ] Invalid transition returns error.
- [ ] `approved_for_onboarding` response does not imply funding/lender approval.
- [ ] Operator notes are sanitized.
- [ ] High-risk language triggers manual review.
- [ ] Sensitive-data terms trigger manual review.
- [ ] Assignment rules route high-risk items to admin.
- [ ] Decision log object is append-only in pattern.
- [ ] No notifications are sent in this batch.

## Example curl

```powershell
curl -X POST "$env:VERCEL_URL/api/admin/update-status" `
  -H "Authorization: Bearer $env:PARTNER_INTAKE_ADMIN_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{"review_item_id":"rev_demo","entity_id":"ptr_demo","previous_status":"needs_review","new_status":"approved_for_onboarding","operator_note":"Ready for onboarding."}'
```
