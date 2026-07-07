# Spam Rules

## Common spam patterns

- Repeated identical submissions.
- Overuse of phrases like `guaranteed approval`, `everyone qualifies`, `instant funding`.
- Bulk lead seller language without consent trail.
- Fake names or keyboard smash values.
- Link farms or suspicious domains.
- Filled honeypot fields.
- Impossible referral volumes with no matching evidence.

## Safe handling

- Do not publish or expose suspected spam records.
- Do not sync severe spam into HubSpot unless explicitly tagged/quarantined.
- Do not send partner-facing notifications for blocked/quarantined records.
- Do log safe metadata for review and tuning.

## Recommended status

- Medium spam risk: `needs_review`
- High spam risk: `paused`
- Severe spam risk: `archived` or quarantine table, depending on implementation
