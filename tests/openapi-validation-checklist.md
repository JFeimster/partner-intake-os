# OpenAPI Validation Checklist

Use this pass/fail checklist before marking the Partner Intake OS Action Pack ready for GPT testing.

## Metadata

| Field | Value |
|---|---|
| Date |  |
| Tester |  |
| Branch |  |
| Commit SHA |  |
| Vercel URL |  |
| OpenAPI file tested |  |
| GPT name | Partner Intake OS |

## File checks

- [ ] `/actions/openapi.yaml` exists or the active YAML file path is documented.
- [ ] `/actions/openapi.json` exists or the active JSON file path is documented.
- [ ] YAML parses without syntax errors.
- [ ] JSON parses without syntax errors.
- [ ] YAML and JSON expose the same paths and methods.
- [ ] No real secrets appear in either file.
- [ ] No personal data appears in examples.

## Server checks

- [ ] Server URL is deployed Vercel production URL.
- [ ] No `localhost` remains.
- [ ] No placeholder domain remains.
- [ ] No trailing slash issue.
- [ ] Server URL matches curl test `$BASE_URL`.

## Endpoint checks

Approved endpoint exposure:

- [ ] `GET /api/health`
- [ ] `POST /api/partners/classify`
- [ ] `POST /api/partners/recommend-resources`
- [ ] `POST /api/partners/generate-onboarding-plan`
- [ ] `POST /api/partners/generate-campaign-kit`
- [ ] `POST /api/partners/log-event`

Forbidden endpoint exposure:

- [ ] `/api/tally/partner-intake-webhook` is not exposed.

## Operation ID checks

- [ ] `checkHealth`
- [ ] `classifyPartnerIntake`
- [ ] `recommendPartnerResources`
- [ ] `generatePartnerOnboardingPlan`
- [ ] `generatePartnerCampaignKit`
- [ ] `logPartnerEvent`
- [ ] No duplicate operation IDs.

## Auth checks

- [ ] Bearer auth scheme exists.
- [ ] Protected endpoints reference Bearer auth.
- [ ] GPT Builder auth is configured as API Key / Bearer.
- [ ] Vercel has `PARTNER_INTAKE_ACTION_TOKEN`.
- [ ] Bad token returns 401.
- [ ] Missing token returns 401.
- [ ] Valid token returns expected response.
- [ ] Real token is not stored in repo.

## Curl checks

- [ ] Health endpoint works.
- [ ] Classify endpoint works.
- [ ] Recommend resources endpoint works.
- [ ] Generate onboarding plan endpoint works.
- [ ] Generate campaign kit endpoint works.
- [ ] Log event endpoint works.
- [ ] Missing body returns a useful validation error.
- [ ] Wrong method returns 405 or clear method error.

## GPT Builder import checks

- [ ] Schema imports.
- [ ] Six approved operations appear.
- [ ] Operation descriptions are clear.
- [ ] Auth setup saves correctly.
- [ ] GPT Preview can call health.
- [ ] GPT Preview can call classify.
- [ ] GPT Preview can call recommendations.
- [ ] GPT Preview can call onboarding.
- [ ] GPT Preview can call campaign kit.
- [ ] GPT Preview can call log event.

## Response shape checks

- [ ] Success responses return JSON.
- [ ] Error responses return JSON.
- [ ] Classify response includes partner type, tier, path, risk, score, next action.
- [ ] Resource response includes resource list, reasons, priority, CTA.
- [ ] Onboarding response includes 24-hour, 7-day, and 30-day steps.
- [ ] Campaign response includes audience, offer, CTA, channels, copy angle, tracking notes.
- [ ] Event response includes logged status or mock status.
- [ ] GPT can summarize responses accurately.

## Compliance checks

- [ ] No guaranteed approvals.
- [ ] No guaranteed funding amounts.
- [ ] No fake lender certainty.
- [ ] No credit repair framing.
- [ ] No deceptive urgency.
- [ ] No invented testimonials.
- [ ] No “everyone qualifies” language.
- [ ] High-risk partner examples route to review or rejection.
- [ ] Low-info signup routes to request more information.

## Final readiness

| Item | Status |
|---|---|
| OpenAPI syntax | PASS / FAIL |
| Endpoint alignment | PASS / FAIL |
| Auth behavior | PASS / FAIL |
| GPT import | PASS / FAIL |
| GPT Preview tests | PASS / FAIL |
| Compliance review | PASS / FAIL |

## Blocking issues

```text
1.
2.
3.
```

## Fixes applied

```text
1.
2.
3.
```

## Final decision

```text
Ready for GPT Action use: YES / NO
Reviewer:
Date:
Notes:
```
