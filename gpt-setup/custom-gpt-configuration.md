# Custom GPT Configuration

Use this as the paste-ready configuration packet for the Partner Intake OS Custom GPT.

## Name

```txt
Partner Intake OS
```

## Description

```txt
Classifies partner signups, referral partners, affiliate inquiries, brokers, and centers of influence into structured partner profiles, onboarding paths, CRM-ready notes, resource recommendations, campaign recommendations, and next actions.
```

## Instructions

Paste the full contents of:

```txt
/gpt/instructions.md
```

Do not replace the instructions with this setup file. This file is the build checklist. The GPT behavior comes from `/gpt/instructions.md`.

## Conversation starters

Use 4–6 of these in the GPT editor.

```txt
Analyze this new Tally partner signup and return a structured partner profile.
Classify this referral partner and recommend the right onboarding path.
Turn this broker partner note into CRM-ready fields and next actions.
Recommend resources and a campaign kit for this center-of-influence partner.
Return dashboard-ready JSON for this partner intake.
Generate an onboarding plan for this partner using the standard Partner Intake OS format.
Review this partner for risk flags and manual review triggers.
Test the Partner Intake OS Action endpoints with a low-info partner intake.
```

## Capabilities

Recommended MVP settings:

```txt
Web search: Off
Image generation: Off
Canvas: Optional
Code Interpreter & Data Analysis: On
Actions: On
Apps: Off
```

Reasoning:

- Web search is not needed for internal partner intake classification unless a future workflow requires external research.
- Image generation is unrelated to partner intake ops.
- Code Interpreter & Data Analysis is useful for CSV review, JSON validation, and batch intake analysis.
- Actions are required once the Vercel API endpoints are deployed.
- Apps should stay off for this build so the GPT routes through the Partner Intake OS API instead of becoming spaghetti ops.

## Knowledge

Upload the files listed in:

```txt
/gpt-setup/knowledge-upload-checklist.md
```

Recommended first upload set:

```txt
/knowledge/partner-types.md
/knowledge/tiering-rules.md
/knowledge/onboarding-paths.md
/knowledge/funding-products-summary.md
/knowledge/resource-catalog.md
/knowledge/campaign-kit-catalog.md
/knowledge/referral-playbook.md
/knowledge/broker-playbook.md
/knowledge/compliance-guardrails.md
/knowledge/crm-fields.md
/knowledge/sample-intakes.md
/gpt/output-formats.md
/gpt/test-prompts.md
```

## Actions

Use:

```txt
/actions/openapi.yaml
```

Server placeholder to replace inside the OpenAPI file:

```txt
https://YOUR_VERCEL_DOMAIN.vercel.app
```

Replace it with your actual Vercel domain, for example:

```txt
https://partner-command-center.vercel.app
```

Only expose these GPT-facing endpoints:

```txt
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
```

Do not expose:

```txt
POST /api/tally/partner-intake-webhook
```

That endpoint is for Tally only.

## Auth

Use API key authentication configured as Bearer.

```txt
Authorization: Bearer YOUR_PARTNER_INTAKE_OS_ACTION_TOKEN
```

The value should match the Vercel environment variable:

```txt
PARTNER_INTAKE_ACTION_TOKEN
```

Do not use the Tally signing secret as the GPT Action token.

## Privacy / visibility recommendation

Start with:

```txt
Visibility: Private / internal only
```

Move to broader sharing only after:

- Action auth is confirmed
- low-info and high-risk tests pass
- the GPT avoids prohibited funding claims
- no real partner PII is included in examples or uploaded files
- the endpoint privacy policy requirement is handled if shared publicly with Actions
- internal admin review process is documented

## Launch owner

```txt
Owner: Jason / Moonshine Capital admin
```

## Internal positioning

```txt
Partner Intake OS is an internal partner-ops GPT for classifying, routing, and activating partner relationships. It is not a public lending adviser, credit repair service, approval engine, or automated partner approval authority.
```
