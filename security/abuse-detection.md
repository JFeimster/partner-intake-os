# Abuse Detection

## Abuse score signals

Add points for:

- Honeypot field filled: +50
- Missing consent: +30
- Duplicate payload hash: +25
- Prohibited funding language in payload: +25
- Suspiciously high event velocity: +20
- Disposable email pattern: +15
- Empty/low-info submission: +10
- Mismatched partner/source metadata: +10

## Score bands

| Score | Level | Recommended action |
|---:|---|---|
| 0-19 | low | Process normally |
| 20-49 | medium | Accept but mark for review |
| 50-79 | high | Queue for manual review |
| 80+ | severe | Block or quarantine |

## Guardrail

Abuse scoring should be used to route and protect the workflow, not to make final business conclusions about a person or business.
