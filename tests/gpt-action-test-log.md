# GPT Action Test Log

Use this file to record manual GPT Action testing for Partner Intake OS.

Create one entry per action test. Do not paste real API tokens, real partner PII, or private webhook payloads.

## Test Entry Template

### Test ID

```text
gpt-action-test-YYYY-MM-DD-001
```

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| Branch |  |
| Commit SHA |  |
| Vercel URL |  |
| GPT name | Partner Intake OS |
| GPT Action tested |  |
| Operation ID |  |
| Payload used |  |
| Expected result |  |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |
| Retest required | YES / NO |

## Test: checkHealth

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Health check |
| Operation ID | `checkHealth` |
| Payload used | none |
| Expected result | API returns reachable status JSON |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: classifyPartnerIntake — broker

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Classify partner intake |
| Operation ID | `classifyPartnerIntake` |
| Payload used | `/actions/sample-action-test-payloads.json#broker_intake` |
| Expected result | Broker classified with tier, onboarding path, risk, scorecard, next action |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: classifyPartnerIntake — low-info signup

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Classify low-info partner intake |
| Operation ID | `classifyPartnerIntake` |
| Payload used | `/actions/sample-action-test-payloads.json#low_info_signup` |
| Expected result | Manual review or request-more-info decision |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: classifyPartnerIntake — high-risk lead seller

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Classify high-risk partner intake |
| Operation ID | `classifyPartnerIntake` |
| Payload used | `/actions/sample-action-test-payloads.json#high_risk_lead_seller` |
| Expected result | High risk, manual review required, likely reject/watchlist |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: recommendPartnerResources

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Recommend partner resources |
| Operation ID | `recommendPartnerResources` |
| Payload used | `/actions/sample-action-test-payloads.json#recommend_resources` |
| Expected result | Resource recommendations with reason, priority, CTA |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: generatePartnerOnboardingPlan

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Generate onboarding plan |
| Operation ID | `generatePartnerOnboardingPlan` |
| Payload used | `/actions/sample-action-test-payloads.json#generate_onboarding_plan` |
| Expected result | First 24 hours, first 7 days, first 30 days, assets, training, next action |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: generatePartnerCampaignKit

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Generate campaign kit |
| Operation ID | `generatePartnerCampaignKit` |
| Payload used | `/actions/sample-action-test-payloads.json#generate_campaign_kit` |
| Expected result | Campaign concept, CTA, channels, copy angle, tracking notes |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Test: logPartnerEvent

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| GPT Action tested | Log partner event |
| Operation ID | `logPartnerEvent` |
| Payload used | `/actions/sample-action-test-payloads.json#log_event` |
| Expected result | Logged or mock-logged event confirmation |
| Actual result |  |
| Pass/fail |  |
| Notes |  |
| Fix applied |  |

## Error log

Use this when a test fails.

| Date | Operation ID | Error | Likely cause | Fix owner | Fix applied | Retest result |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

## Final signoff

```text
All required GPT Action tests passed: YES / NO
Remaining blockers:
Reviewer:
Date:
```
