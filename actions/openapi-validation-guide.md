# OpenAPI Validation Guide

This guide covers validation, linting, and Custom GPT Action import checks for Partner Intake OS OpenAPI files.

## Files to validate

Core files:

```txt
/actions/openapi.yaml
/actions/openapi.json
/actions/openapi.bundle.yaml
/actions/openapi.bundle.json
```

Variant files:

```txt
/actions/openapi.admin.yaml
/actions/openapi.partner.yaml
/actions/openapi.dev.yaml
/actions/openapi.production.yaml
```

Component files:

```txt
/actions/components/schemas.yaml
/actions/components/security.yaml
/actions/components/examples.yaml
```

## Local syntax validation

Validate JSON:

```bash
python -m json.tool actions/openapi.json > /dev/null
python -m json.tool actions/openapi.bundle.json > /dev/null
```

Validate YAML with Python:

```bash
python - <<'PY'
from pathlib import Path
import yaml

for path in sorted(Path("actions").glob("*.yaml")) + sorted(Path("actions/components").glob("*.yaml")):
    with path.open("r", encoding="utf-8") as f:
        yaml.safe_load(f)
    print(f"valid yaml: {path}")
PY
```

If `yaml` is not installed:

```bash
pip install pyyaml
```

## OpenAPI lint checklist

Use a linter such as Redocly:

```bash
npm install -D @redocly/cli
npx redocly lint actions/openapi.yaml
npx redocly lint actions/openapi.bundle.yaml
```

Checklist:

- [ ] OpenAPI version is `3.1.0`
- [ ] `info.title` is present
- [ ] `info.version` is present
- [ ] `servers[0].url` is not a fake production domain
- [ ] every operation has `operationId`
- [ ] operation IDs are unique
- [ ] every operation has a useful `summary`
- [ ] every operation has a clear `description`
- [ ] request bodies have schemas where needed
- [ ] successful responses have schemas
- [ ] error responses reference `ApiError`
- [ ] security uses Bearer auth where required
- [ ] `/api/tally/partner-intake-webhook` is not present
- [ ] planned endpoints are marked as planned or excluded

## GPT Action import checklist

Before importing:

- [ ] Use `actions/openapi.bundle.yaml` unless testing a narrower variant
- [ ] Replace `https://YOUR_VERCEL_DOMAIN.vercel.app`
- [ ] Confirm the server URL uses HTTPS for deployed environments
- [ ] Confirm operation IDs are stable
- [ ] Confirm no external `$ref` files exist in the bundled file
- [ ] Confirm Bearer auth is configured in the GPT Action editor
- [ ] Confirm the token matches Vercel `PARTNER_INTAKE_ACTION_TOKEN`
- [ ] Test `checkHealth` first
- [ ] Test `classifyPartnerIntake` with a low-info sample
- [ ] Test `classifyPartnerIntake` with a high-risk sample
- [ ] Test `recommendPartnerResources`
- [ ] Test `generatePartnerOnboardingPlan`
- [ ] Test `generatePartnerCampaignKit`
- [ ] Test `logPartnerEvent`

## Common GPT Action schema issues

### External refs fail

Problem:

```yaml
$ref: ./components/schemas.yaml#/components/schemas/PartnerIntake
```

Fix:

Use `openapi.bundle.yaml`, where schemas are inline.

### Missing operation IDs

Problem:

```yaml
post:
  summary: Classify partner intake
```

Fix:

```yaml
post:
  operationId: classifyPartnerIntake
```

### Vague action descriptions

Bad:

```yaml
description: Does partner stuff.
```

Good:

```yaml
description: Accepts normalized partner intake and returns classification, tier, risk level, scorecard, recommendations, and next action.
```

### Wrong auth location

Problem: Token placed in query string or body.

Fix: Use HTTP Bearer auth:

```http
Authorization: Bearer YOUR_PARTNER_INTAKE_ACTION_TOKEN
```

### Exposed webhook route

Problem:

```txt
/api/tally/partner-intake-webhook
```

Fix:

Remove it from every GPT Action file. That is a Tally-only ingestion route.

### Fake-live endpoints

Problem: Spec includes planned endpoints with no backend routes.

Fix:

Either remove them from production specs or mark them clearly as planned with `x-partner-intake-status`.

## Operation ID naming rules

Use verb + object/action.

Approved:

```txt
checkHealth
classifyPartnerIntake
recommendPartnerResources
generatePartnerOnboardingPlan
generatePartnerCampaignKit
logPartnerEvent
submitPartnerLead
createPartnerTrackingLink
logPartnerAttributionEvent
reviewPartner
updatePartnerStatus
getPartnerReviewQueue
```

Avoid:

```txt
doThing
partnerAction
testEndpoint
submit
getData
```

Operation IDs are the handles the GPT sees. Don’t hand the robot a drawer full of unlabeled knives.

## Server URL replacement steps

Find:

```txt
https://YOUR_VERCEL_DOMAIN.vercel.app
```

Replace with:

```txt
https://your-real-project.vercel.app
```

Dev variant may use:

```txt
http://localhost:3000
https://YOUR_DEV_VERCEL_DOMAIN.vercel.app
```

Production variant should use:

```txt
https://YOUR_PRODUCTION_VERCEL_DOMAIN.vercel.app
```

Do not leave placeholder domains in a live GPT.

## Bearer auth test steps

Set a token locally or in Vercel:

```bash
PARTNER_INTAKE_ACTION_TOKEN="replace-with-real-token"
```

Test health:

```bash
curl "https://YOUR_VERCEL_DOMAIN.vercel.app/api/health"
```

Test classify:

```bash
curl -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/partners/classify" \
  -H "Authorization: Bearer YOUR_PARTNER_INTAKE_ACTION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "intake": {
      "first_name": "Morgan",
      "last_name": "Reyes",
      "email": "morgan@examplebroker.com",
      "company": "Reyes Funding Group",
      "partner_type_claimed": "funding broker",
      "audience": "contractors and trucking operators",
      "funding_experience": "5 years brokering working capital referrals",
      "source": "manual"
    },
    "context": "manual_review"
  }'
```

Bad auth test:

```bash
curl -X POST "https://YOUR_VERCEL_DOMAIN.vercel.app/api/partners/classify" \
  -H "Authorization: Bearer wrong-token" \
  -H "Content-Type: application/json" \
  -d '{"intake":{"email":"test@example.com","source":"manual"}}'
```

Expected result: `401 Unauthorized` with `ApiError`.

## Final pre-import test

Run this before GPT import:

```bash
python -m json.tool actions/openapi.bundle.json > /dev/null
npx redocly lint actions/openapi.bundle.yaml
```

Then import `actions/openapi.bundle.yaml` into the Custom GPT.
