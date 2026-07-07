# Internal Alert Rules

## Alert triggers

| Trigger | Severity | Suggested channel |
|---|---|---|
| new partner needs review | normal | email/task/slack |
| high-risk partner flagged | high | email/slack/admin task |
| lead submitted | normal | email/task |
| duplicate detected | medium | review queue/task |
| sync failure | high | email/slack |
| admin decision needed | high | email/task/slack |

## Suppression

Suppress repeat alerts when:

- same entity + trigger has fired in the suppression window
- record is archived
- partner-facing messaging is disabled
- alert is below configured severity threshold

## Escalation

Escalate high-risk alerts when unresolved after the SLA defined in review/escalation rules.
