# Tally Release Checklist

## Webhook URL

Use the deployed Vercel route:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
```

| Check | Status | Notes |
| --- | --- | --- |
| URL uses correct Vercel domain. |  |  |
| URL uses HTTPS. |  |  |
| URL points to `/api/tally/partner-intake-webhook`. |  |  |
| URL does not point to GPT Action endpoint. |  |  |

## Event type

| Check | Status | Notes |
| --- | --- | --- |
| Webhook listens for form response submissions. |  |  |
| Test form uses fake records only. |  |  |
| Test payload maps expected fields. |  |  |

## Signing secret

| Check | Status | Notes |
| --- | --- | --- |
| Signing secret generated. |  |  |
| Signing secret stored in Vercel as `TALLY_SIGNING_SECRET`. |  |  |
| Secret is not stored in GitHub/docs. |  |  |
| Invalid signature behavior tested. |  |  |
| Valid signature behavior tested if signing is enabled. |  |  |

## Test submissions

Run these fake submissions:

1. Strategic partner.
2. Broker.
3. CPA/bookkeeper.
4. Attorney.
5. Veteran/community connector.
6. Affiliate/content creator.
7. Low-info signup.
8. High-risk lead seller.
9. Duplicate submission.
10. Malformed payload.

Use `/e2e/sample-tally-e2e-payloads.json` and `/scripts/run-e2e-tally-review-test.ps1`.

## Expected behavior

| Case | Expected behavior |
| --- | --- |
| Valid profile | 2XX response, normalized/classified, review queue-ready. |
| Low-info signup | 2XX or validation response with manual review / needs info. |
| High-risk lead seller | 2XX with high risk/manual review, or safe rejection depending endpoint rules. |
| Duplicate submission | Documented duplicate/idempotency behavior. |
| Malformed payload | 400 safe error, no raw payload leaked. |

## Failure behavior

If Tally submission fails:

1. Check Vercel deployment exists.
2. Check endpoint route exists.
3. Check Vercel logs.
4. Check signing secret mismatch.
5. Check payload format.
6. Check timeout.
7. Retry with fake record only.
8. Disable webhook if real submissions are at risk.

## Duplicate behavior

During internal launch, duplicate handling may be stubbed. Required operator behavior:

- Record duplicate test result.
- Confirm duplicate does not create unreviewed automatic approval.
- Confirm duplicate is visible in review notes or test log.
- Add Phase 31 backlog item for persistent idempotency if not implemented.
