# GPT Action Debugging

## Purpose

This guide shows how to test and debug the Partner Intake OS Actions inside the Custom GPT builder.

The point is to verify that the GPT can call your Vercel API safely and return structured partner-ops output without exposing the Tally webhook or making unsafe funding claims.

## Before testing

Confirm:

- The API is deployed to Vercel.
- `PARTNER_INTAKE_ACTION_TOKEN` exists in Vercel.
- OpenAPI server URL uses the deployed Vercel production URL.
- The GPT Action auth is set to Bearer API key.
- Tally webhook endpoint is not in the Action Pack.
- Test payloads are loaded from `/actions/sample-action-test-payloads.json`.

## GPT Builder test process

1. Open the Partner Intake OS Custom GPT builder.
2. Go to Actions.
3. Import or paste the OpenAPI schema.
4. Configure authentication:
   - API Key
   - Bearer
   - Paste the private action token.
5. Save the action.
6. Use Preview mode.
7. Test the actions in this order:
   - `checkHealth`
   - `classifyPartnerIntake`
   - `recommendPartnerResources`
   - `generatePartnerOnboardingPlan`
   - `generatePartnerCampaignKit`
   - `logPartnerEvent`
8. Record each result in `/tests/gpt-action-test-log.md`.

## Test: checkHealth

Prompt:

```text
Call the Partner Intake OS health check action and summarize the result.
```

Expected:

- GPT calls `checkHealth`.
- API returns status JSON.
- GPT reports environment, version, and whether the API is reachable.
- No auth failure unless health endpoint is intentionally protected.

If failed:

- Confirm server URL.
- Confirm `/api/health` is deployed.
- Confirm method is GET.
- Confirm Vercel deployment is not blocked.

## Test: classifyPartnerIntake

Prompt:

```text
Use the Partner Intake OS API to classify this partner intake:

{
  "first_name": "Marcus",
  "last_name": "Reed",
  "email": "marcus@example.com",
  "company": "Reed Funding Advisors",
  "partner_type_claimed": "funding broker",
  "audience": "contractors and local service businesses",
  "referral_volume_estimate": "5-10 per month",
  "funding_experience": "3 years",
  "desired_partner_role": "send qualified funding referrals",
  "notes": "Uses HubSpot and wants a clean referral workflow."
}
```

Expected:

- GPT calls `classifyPartnerIntake`.
- Response includes:
  - partner type
  - partner tier
  - onboarding path
  - risk level
  - scorecard
  - next action
- GPT does not promise approvals or funding outcomes.

If failed:

- Check auth.
- Check POST body shape.
- Check validation rules.
- Check response schema.

## Test: recommendPartnerResources

Prompt:

```text
Use the API to recommend resources for a CPA/bookkeeper partner serving restaurants and local service businesses.
```

Expected:

- GPT calls `recommendPartnerResources`.
- Response includes recommended resources with reason, priority, and CTA.
- Recommendations stay educational and readiness-based.

If failed:

- Check whether endpoint requires `partner_type` and `audience`.
- Check examples in OpenAPI.
- Check API route file exists.

## Test: generatePartnerOnboardingPlan

Prompt:

```text
Use the API to generate an onboarding plan for a Tier 2 business attorney referral partner who works with acquisition entrepreneurs and small business owners.
```

Expected:

- GPT calls `generatePartnerOnboardingPlan`.
- Response includes first 24 hours, first 7 days, first 30 days, required assets, recommended training, next action, and owner.

If failed:

- Check request schema.
- Check endpoint route.
- Check API response includes arrays or strings matching schema.

## Test: generatePartnerCampaignKit

Prompt:

```text
Use the API to generate a campaign kit for a veteran community connector who wants to educate veteran-owned businesses about funding readiness.
```

Expected:

- GPT calls `generatePartnerCampaignKit`.
- Response includes campaign name, audience, offer, CTA, channels, copy angle, tracking notes.
- Copy avoids guaranteed funding and fake urgency.

If failed:

- Check auth.
- Check required fields.
- Check whether campaign response includes safe language.

## Test: logPartnerEvent

Prompt:

```text
Use the API to log this partner review event:

{
  "partner_id": "ptr_demo_001",
  "event_type": "gpt_review_completed",
  "event_source": "custom_gpt",
  "summary": "Reviewed broker partner intake and recommended Tier 2 standard onboarding.",
  "next_action": "send_welcome_and_schedule_intro_call",
  "created_by": "partner_intake_os"
}
```

Expected:

- GPT calls `logPartnerEvent`.
- API returns logged or mock-logged confirmation.
- No real storage guarantee unless storage mode is active.

If failed:

- Check request schema.
- Check event type enum.
- Check API route.
- Check storage mode fallback.

## How to interpret failed action calls

| Failure | Likely cause | First fix |
|---|---|---|
| GPT does not call any action | Prompt too vague or schema descriptions weak | Ask explicitly to use the API |
| GPT calls wrong action | Overlapping operation descriptions | Tighten action summaries |
| 401 | Token mismatch | Check GPT auth and Vercel env |
| 404 | Route missing or wrong deployment | Check Vercel route and branch |
| 405 | Wrong method | Confirm GET vs POST |
| 500 | Runtime/env/body error | Check Vercel logs |
| Weak GPT summary | Response shape too vague | Add fields/examples |
| Unsafe claims | Prompt/fixtures too aggressive | Repair guardrails and examples |

## What to change in OpenAPI vs API code

Change OpenAPI when:

- GPT sends the wrong request shape.
- GPT picks the wrong action.
- Import fails.
- Response examples are missing.
- Server URL is wrong.
- Security scheme is wrong.

Change API code when:

- curl fails.
- endpoint returns 404/405/500.
- auth validation is broken.
- API response does not match contract.
- body parsing fails.
- endpoint does not return JSON.

## Debug prompts

Use these in GPT Preview:

```text
List the available Partner Intake OS actions you can call and what each one is for.
```

```text
Call the health check action only. Do not classify anything.
```

```text
Use classifyPartnerIntake only. Return the raw action result first, then summarize it.
```

```text
Test bad auth is not possible from here, so tell me what curl command I should run outside ChatGPT.
```

## Debug discipline

Do not “fix” the system by weakening auth, exposing the Tally webhook, or making endpoints public just to get a green test. That is how demo duct tape becomes production liability.
