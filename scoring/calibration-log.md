# Calibration Log

Use this log to record scoring changes.

## 2026-07 — Batch 41 baseline

- Added score weights.
- Added tier thresholds.
- Added risk override concept.
- Added “why this score” output.
- Added operator feedback loop.

## Entry template

```markdown
### YYYY-MM-DD — Change title

- Changed by:
- Reason:
- Fields changed:
- Previous behavior:
- New behavior:
- Expected impact:
- Rollback plan:
```

## Operator feedback loop

Every 30 reviewed partner records, compare:

- recommended tier vs final operator tier
- recommended risk vs final risk
- false positives
- false negatives
- manual override reasons
- partner activation outcomes without guaranteeing future performance
