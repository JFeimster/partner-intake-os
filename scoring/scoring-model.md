# Scoring Model

## Scoring categories

| Category | Weight | Notes |
|---|---:|---|
| Audience fit | 20 | How closely their audience matches funding-ready SMBs |
| Trust leverage | 15 | Whether they already have authority with the audience |
| Deal-flow signal | 20 | Estimated referral/lead volume, quality, and relevance |
| Activation speed | 10 | How quickly they can launch safely |
| Strategic value | 15 | Co-marketing, embedded channel, or ecosystem leverage |
| Operational readiness | 10 | CRM/tools/process maturity |
| Compliance posture | 10 | Inverted risk score; safer partners score higher |

## Tier thresholds

- `tier_1_review`: 85–100
- `tier_2`: 70–84
- `tier_3`: 50–69
- `tier_4_nurture`: 25–49
- `reject_or_risk_review`: 0–24 or severe risk flag

## Manual override pattern

An operator may override:

- recommended tier
- risk level
- onboarding path
- manual review flag

Every override needs:

- operator ID
- reason
- previous value
- new value
- timestamp
- audit-log reference

## Why-this-score format

Use crisp reasons:

```text
Strong CPA/bookkeeper audience fit and clear referral intent, but missing consent language and CRM process details. Recommended Tier 2 pending manual review of messaging and first-campaign plan.
```
