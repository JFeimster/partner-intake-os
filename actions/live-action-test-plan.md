# Live GPT Action Test Plan

## Purpose

Validate the Partner Intake OS Action Pack against a live Vercel deployment before internal release.

## Preconditions

- Phase 23 API files are copied into the repo.
- Vercel deployment is live.
- `PARTNER_INTAKE_ACTION_TOKEN` is configured in Vercel.
- GPT Action auth is configured as Bearer/API key with the same token.
- `PARTNER_INTAKE_STORAGE_MODE` is set to `mock` unless Phase 25 sandbox sync has been explicitly configured.
- No real partner PII is used in testing.

## Test order

### 1. Health check

Action:

```text
checkHealth
```

Expected:

- status or ok indicator
- service name
- environment
- timestamp
- version placeholder
- no secrets

### 2. CPA/bookkeeper classification

Action:

```text
classifyPartnerIntake
```

Use the CPA/bookkeeper payload from `live-test-payloads.json`.

Expected:

- partner profile
- tier recommendation
- onboarding path
- scorecard
- manual review flag
- next action

### 3. Low-info intake

Expected:

- manual review required
- request more information
- risk flag or missing-information flag
- no false confidence

### 4. High-risk lead seller

Expected:

- high risk
- manual review required
- prohibited-claim risk flags
- reject/escalate next action
- no welcome/onboarding recommendation without review

### 5. Resource recommendation

Expected:

- resources mapped to partner type and audience
- compliance-safe CTA
- no funding guarantees

### 6. Onboarding plan

Expected:

- first 24 hours
- first 7 days
- first 30 days
- required assets
- owner
- next action

### 7. Campaign kit

Expected:

- campaign concept
- CTA
- suggested channels
- tracking notes
- copy angle
- no deceptive urgency
- no guaranteed funding or approval language

### 8. Log event

Expected:

- event ID
- mock/stub logged status
- request ID
- no production write if storage mode is mock

### 9. Bad-token test

Run with an invalid token using curl, not through the GPT Builder.

Expected:

```text
401 Unauthorized
```

## Failure handling

If import fails, check:

- YAML indentation
- unsupported OpenAPI keywords
- invalid server URL
- missing operation IDs
- malformed examples
- duplicate schema names
- auth mismatch

If live calls fail, check:

- Vercel route exists
- endpoint method is correct
- CORS/no-store headers are not blocking response
- env var token matches GPT Action token
- Vercel logs include request ID
- request body matches the endpoint contract

## Release rule

Do not release the Action internally until the low-info, high-risk, bad-token, and health checks pass. Those are the “can this thing hurt us?” tests. Everything else is optimization.
