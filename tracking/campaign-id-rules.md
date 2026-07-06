# Campaign ID Rules

## Purpose

`campaign_id` identifies a campaign kit, offer angle, partner promotion, event, or lead magnet. It lets Partner Intake OS connect a lead or signup back to the campaign that created it.

## Recommended format

```text
ck_{campaign_type}_{angle_or_audience}_{period}
```

Examples:

```text
ck_broker_missing_docs_2026q3
ck_cpa_cashflow_gap_2026q3
ck_attorney_working_capital_2026q3
ck_business_broker_acquisition_2026q3
ck_veteran_founder_readiness_2026q3
ck_affiliate_side_hustle_funding_2026q3
ck_fintech_embedded_referral_2026q3
ck_test_watchlist_2026q3
```

## Campaign type prefixes

| Prefix | Meaning |
|---|---|
| `ck_broker` | Broker campaign kit |
| `ck_cpa` | CPA/bookkeeper campaign kit |
| `ck_attorney` | Attorney referral campaign |
| `ck_business_broker` | Business broker/M&A referral campaign |
| `ck_veteran` | Veteran/community connector campaign |
| `ck_affiliate` | Affiliate/content campaign |
| `ck_fintech` | Strategic fintech/vendor campaign |
| `ck_event` | Offline event campaign |
| `ck_test` | Internal test campaign |

## Date-based naming

Use quarter or month when campaigns are time-bound.

Quarter format:

```text
2026q3
```

Month format:

```text
2026-07
```

Evergreen format:

```text
evergreen
```

Examples:

```text
ck_cpa_cashflow_gap_2026q3
ck_affiliate_side_hustle_funding_2026-07
ck_broker_missing_docs_evergreen
```

## Partner-specific campaign naming

When the campaign is created for a specific partner, include the partner slug after the angle.

Pattern:

```text
ck_{campaign_type}_{angle}_{partner_slug}_{period}
```

Examples:

```text
ck_cpa_cashflow_gap_ledgerlane_2026q3
ck_broker_missing_docs_ironbridge_2026q3
ck_veteran_readiness_freedomhub_2026q3
```

Use partner-specific campaign IDs when:

- The partner has custom copy or assets.
- The campaign is part of a pilot.
- You need to isolate performance by partner.
- The partner is Tier 1 or strategic.

Use generic campaign IDs when:

- The campaign is reused across many partners.
- You do not need partner-specific creative reporting.
- You want simpler analytics grouping.

## Campaign status values

Recommended values:

```text
draft
active
paused
retired
test
archived
```

## Examples

### Broker missing-docs campaign

```json
{
  "campaign_id": "ck_broker_missing_docs_2026q3",
  "campaign_type": "broker",
  "campaign": "broker_missing_docs_2026q3",
  "recommended_mediums": ["email", "sms", "linkedin"],
  "status": "active"
}
```

### CPA cash-flow campaign

```json
{
  "campaign_id": "ck_cpa_cashflow_gap_2026q3",
  "campaign_type": "cpa",
  "campaign": "cpa_cashflow_gap_2026q3",
  "recommended_mediums": ["newsletter", "email", "resource"],
  "status": "active"
}
```

## Retiring campaigns

Retire a campaign when:

- The offer is outdated.
- The copy references old assets.
- The campaign produces poor-quality leads.
- Compliance language needs review.
- A better campaign replaces it.

Do not delete old campaign IDs from historical records. Mark them `retired` or `archived` so attribution reports do not break.
