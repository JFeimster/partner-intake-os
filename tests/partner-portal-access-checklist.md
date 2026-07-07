# Partner Portal Access Checklist

## Files

- [ ] `/partner-portal/*`
- [ ] `/lib/partner-portal/*`
- [ ] `/site/partner-intake/portal/*`
- [ ] `/site/partner-intake/shared/local-store.js`

## Validation

- [ ] Portal pages are static shells only.
- [ ] Portal pages do not include real PII.
- [ ] localStorage helper blocks forbidden keys.
- [ ] localStorage helper allows only safe UX fields.
- [ ] Access rules require server-side authorization.
- [ ] No commission/payout tracking exists.
- [ ] Partner access is distinct from funding/lender approval.
