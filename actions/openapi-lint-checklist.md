# OpenAPI Lint Checklist

Use this checklist before importing or re-importing the Partner Intake OS Action Pack into the Custom GPT builder.

## 1. OpenAPI version check

- [ ] `openapi` field exists.
- [ ] Version is `3.1.0` or compatible `3.0.x`.
- [ ] No Swagger 2.0 syntax remains.
- [ ] File parses as valid YAML or JSON.

Pass notes:

```text
OpenAPI version:
Validated by:
Date:
```

## 2. Info object check

- [ ] `info.title` exists.
- [ ] `info.version` exists.
- [ ] `info.description` explains Partner Intake OS.
- [ ] Description is operational, not marketing fluff.
- [ ] No approval/funding guarantees appear.

Recommended title:

```text
Partner Intake OS Action Pack
```

## 3. Server URL check

- [ ] `servers` exists.
- [ ] Production Vercel URL is present.
- [ ] No `localhost` URL remains.
- [ ] No placeholder domain remains.
- [ ] No trailing slash.
- [ ] Server URL matches the domain used in curl tests.

Expected format:

```text
https://YOUR_DOMAIN.vercel.app
```

## 4. Paths check

Approved GPT-facing paths only:

- [ ] `GET /api/health`
- [ ] `POST /api/partners/classify`
- [ ] `POST /api/partners/recommend-resources`
- [ ] `POST /api/partners/generate-onboarding-plan`
- [ ] `POST /api/partners/generate-campaign-kit`
- [ ] `POST /api/partners/log-event`

Forbidden path:

- [ ] `/api/tally/partner-intake-webhook` is not included.

## 5. Operation IDs check

- [ ] `checkHealth`
- [ ] `classifyPartnerIntake`
- [ ] `recommendPartnerResources`
- [ ] `generatePartnerOnboardingPlan`
- [ ] `generatePartnerCampaignKit`
- [ ] `logPartnerEvent`
- [ ] All operation IDs are unique.
- [ ] Operation IDs are stable and not renamed casually.

## 6. Security scheme check

- [ ] Bearer API key security scheme exists.
- [ ] Security scheme is referenced globally or on protected operations.
- [ ] Protected partner endpoints require auth.
- [ ] Example auth uses placeholder token only.
- [ ] No real token appears anywhere.

Expected scheme pattern:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
```

## 7. Request body schema check

For every POST endpoint:

- [ ] `requestBody` exists.
- [ ] `content.application/json` exists.
- [ ] Schema is explicit.
- [ ] Required fields are realistic.
- [ ] Example payload exists.
- [ ] Low-info payload behavior is documented.
- [ ] High-risk partner behavior is documented.

## 8. Response schema check

For every endpoint:

- [ ] `200` response exists.
- [ ] `400` validation response exists where useful.
- [ ] `401` auth response exists for protected endpoints.
- [ ] `500` server response exists.
- [ ] Successful responses include structured JSON.
- [ ] Error responses include structured JSON.
- [ ] Response examples avoid guarantees and fake certainty.

Recommended response envelope:

```json
{
  "ok": true,
  "result": {},
  "request_id": "req_example"
}
```

## 9. Example payload check

Required examples:

- [ ] Broker intake
- [ ] CPA/bookkeeper intake
- [ ] Business attorney intake
- [ ] Veteran/community connector intake
- [ ] Content creator/affiliate intake
- [ ] Strategic fintech partner intake
- [ ] Low-info signup
- [ ] High-risk lead seller
- [ ] Log event

## 10. No Tally webhook exposure check

- [ ] Search OpenAPI file for `tally`.
- [ ] Confirm only explanatory text appears, not paths.
- [ ] Confirm no operation ID exists for Tally webhook.
- [ ] Confirm GPT-facing Action Pack cannot trigger inbound webhook.

Search command:

```powershell
Select-String -Path "actions\*.yaml","actions\*.json" -Pattern "tally|webhook" -CaseSensitive:$false
```

Allowed result:

```text
Documentation note only. No /api/tally/partner-intake-webhook path.
```

## 11. Import readiness

- [ ] YAML imports into GPT Builder.
- [ ] JSON imports into GPT Builder if used.
- [ ] Builder recognizes all six approved operations.
- [ ] Auth setup is accepted.
- [ ] Preview can call health endpoint.
- [ ] Preview can call protected endpoints with token.
- [ ] Preview rejects bad token.
- [ ] Test log updated.

## Final lint decision

```text
Lint status: PASS / FAIL
Reviewer:
Date:
Blocking issues:
Non-blocking notes:
Next action:
```
