# Admin Dashboard v2 Data Contracts

## API endpoints expected

| Module | Endpoint | Required |
|---|---|---|
| Review Queue | `/api/admin/review-queue` | recommended |
| Partner Profiles | `/api/admin/partners` | recommended |
| Lead Queue | `/api/admin/leads` | recommended |
| Tracking Analytics | `/api/tracking/summary` | yes for tracking |
| Sync Monitor | `/api/admin/sync-status` | yes |
| Compliance Flags | `/api/admin/compliance-queue` | yes |
| GPT Action Logs | `/api/admin/action-logs` | future |
| Tally Intake Monitor | `/api/admin/tally-events` | future |
| Operator Notes | `/api/admin/operator-notes` | future |
| Launch QA Status | `/api/admin/launch-qa` | future |

## Shared response envelope

```json
{
  "ok": true,
  "data": [],
  "source": "api",
  "generated_at": "2026-07-06T12:00:00.000Z"
}
```

## Fallback behavior

When an endpoint fails, the dashboard should:

1. Show a visible fallback badge.
2. Render non-sensitive mock data.
3. Avoid localStorage for sensitive state.
4. Log only safe client-side diagnostics.

## Forbidden data

Do not place full borrower data, lender submissions, private notes, API keys, session tokens, or commission details in the browser payload.
