# GPT Action Live Test Log

## Instructions

Use this file during the live GPT Action import/test window. Do not paste real partner PII, tokens, secrets, or private lead data.

## Environment

| Field | Value |
|---|---|
| Test date | |
| Tester | |
| Vercel domain | |
| Deployment/commit | |
| GPT name | Partner Intake OS |
| OpenAPI file | `/actions/openapi.yaml` |
| Auth mode | Bearer API key |
| Storage mode | mock / notion / hubspot / dual_sandbox |
| Token visible in notes? | No |

## Import checks

| Check | Pass/Fail | Notes |
|---|---|---|
| OpenAPI YAML imports without parser error | | |
| Server URL points to live Vercel domain | | |
| Bearer auth configured | | |
| Required six operation IDs visible | | |
| Tally webhook not visible | | |
| Admin routes not visible | | |
| Storage/sync raw routes not visible | | |

## Live action tests

| Test | Expected | Pass/Fail | Notes |
|---|---|---|---|
| checkHealth | 200 and no secrets | | |
| classifyPartnerIntake — CPA/bookkeeper | profile + scorecard + next action | | |
| classifyPartnerIntake — low-info | manual review / request info | | |
| classifyPartnerIntake — high-risk lead seller | high risk / reject or escalate | | |
| recommendPartnerResources | resources + next action | | |
| generatePartnerOnboardingPlan | 24h / 7d / 30d plan | | |
| generatePartnerCampaignKit | campaign concept + safe CTA | | |
| logPartnerEvent | mock/stub event confirmation | | |
| bad token via curl | 401 | | |

## Response-quality checks

| Check | Pass/Fail | Notes |
|---|---|---|
| No guaranteed approvals | | |
| No guaranteed funding amounts | | |
| No fake lender certainty | | |
| No credit repair framing | | |
| No deceptive urgency | | |
| No invented testimonials | | |
| No “everyone qualifies” language | | |
| Manual review preserved for risky partners | | |
| No real PII in logs or fixtures | | |

## Issues found

| Issue | Severity | Owner | Fix | Retest result |
|---|---|---|---|---|
| | | | | |

## Release decision

| Decision | Mark |
|---|---|
| Approved for internal test use | |
| Needs repair before use | |
| Blocked | |

## Notes

Use blunt notes here. This is where bugs go to confess before they become production folklore.
