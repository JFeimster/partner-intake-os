# Scoring + Tier Calibration Checklist

## Scoring checks

- [ ] Score returns `overall_score`.
- [ ] Score returns `recommended_tier`.
- [ ] Score returns `risk_level`.
- [ ] Score returns `why_this_score`.
- [ ] High-risk language triggers manual review.
- [ ] Blocked credit-repair framing forces risk review.

## Override checks

- [ ] Manual override requires operator ID and reason.
- [ ] Override does not delete original recommendation.
- [ ] Tier history concept is documented.
- [ ] Risk override concept is documented.
- [ ] Audit-log requirement is clear.

## Compliance checks

- [ ] No guaranteed partner performance claims.
- [ ] No funding/approval/commission certainty.
- [ ] Scoring framed as internal prioritization only.
