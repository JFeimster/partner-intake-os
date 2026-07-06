# Partner Intake OS GPT Build Guide

## Purpose

This guide walks through manually creating the Partner Intake OS Custom GPT for the Moonshine Capital / Partner Command Center ecosystem.

The GPT should classify partner signups, referral partners, affiliate inquiries, brokers, and centers of influence into:

- structured partner profiles
- partner tiers
- onboarding paths
- CRM-ready notes and fields
- recommended resources
- recommended campaign kits
- next actions
- dashboard-ready output

This setup packet assumes Batches 01–07 already exist in the repo.

## GPT name

Partner Intake OS

## GPT description

Classifies partner signups, referral partners, affiliate inquiries, brokers, and centers of influence into structured partner profiles, onboarding paths, CRM-ready notes, resource recommendations, campaign recommendations, and next actions.

## Recommended visibility

Start as **private/internal only**.

Do not publish publicly until:

- API Actions are tested
- Bearer auth is confirmed
- knowledge behavior is stable
- high-risk partner edge cases are handled
- data privacy language is reviewed
- no partner PII is exposed in public examples

## Build prerequisites

Before creating the Custom GPT, confirm these files exist in the repo:

```txt
/gpt/instructions.md
/gpt/profile.md
/gpt/conversation-starters.md
/gpt/output-formats.md
/gpt/test-prompts.md

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

/actions/openapi.yaml
/actions/openapi.json
/actions/action-readme.md
/actions/auth.md
/actions/test-cases.md
```

## Step 1 — Create the GPT

1. Open ChatGPT.
2. Go to **Explore GPTs**.
3. Choose **Create**.
4. Open the **Configure** view instead of relying only on the conversational builder.
5. Fill out the fields from `gpt-setup/custom-gpt-configuration.md`.

## Step 2 — Add the name and description

Use:

```txt
Name:
Partner Intake OS

Description:
Classifies partner signups, referral partners, affiliate inquiries, brokers, and centers of influence into structured partner profiles, onboarding paths, CRM-ready notes, resource recommendations, campaign recommendations, and next actions.
```

## Step 3 — Paste the instructions

Where to paste instructions:

```txt
GPT editor → Configure → Instructions
```

Paste the full contents of:

```txt
/gpt/instructions.md
```

Do not paste the knowledge files into the instructions field. Knowledge files are reference material. Instructions are behavior, workflow, rules, and guardrails.

## Step 4 — Add conversation starters

Use starters from:

```txt
/gpt/conversation-starters.md
```

Pick 4–6 for the GPT editor.

Recommended launch set:

```txt
Analyze this new Tally partner signup and return a structured partner profile.
Classify this referral partner and recommend the right onboarding path.
Turn this broker partner note into CRM-ready fields and next actions.
Recommend resources and a campaign kit for this center-of-influence partner.
Return dashboard-ready JSON for this partner intake.
Test the Partner Intake OS Action endpoints with a low-info partner intake.
```

## Step 5 — Upload knowledge files

Upload the files listed in:

```txt
/gpt-setup/knowledge-upload-checklist.md
```

Which knowledge files to upload first:

1. `/knowledge/partner-types.md`
2. `/knowledge/tiering-rules.md`
3. `/knowledge/onboarding-paths.md`
4. `/knowledge/compliance-guardrails.md`
5. `/knowledge/resource-catalog.md`
6. `/knowledge/campaign-kit-catalog.md`
7. `/knowledge/crm-fields.md`
8. `/knowledge/sample-intakes.md`
9. `/gpt/output-formats.md`
10. `/gpt/test-prompts.md`

## Step 6 — Configure capabilities

Recommended MVP configuration:

| Capability | Setting | Reason |
|---|---:|---|
| Web search | Off | Not needed for internal intake classification MVP. |
| Image generation | Off | Not relevant to partner ops. |
| Canvas | Optional | Useful only for editing setup docs or long partner packets. |
| Code Interpreter & Data Analysis | On | Useful for CSV exports, JSON checks, and batch review. |
| Actions | On | Required for the Partner Intake OS API Action Pack. |
| Apps | Off | Keep the integration path clean. Use Actions for this build. |

## Step 7 — Add Actions

Use the Action setup checklist:

```txt
/gpt-setup/actions-setup-checklist.md
```

Which Actions file to use:

```txt
/actions/openapi.yaml
```

Expected authentication:

```txt
Authorization: Bearer YOUR_PARTNER_INTAKE_OS_ACTION_TOKEN
```

Do not expose or add the Tally webhook endpoint to the GPT Action Pack.

## Step 8 — Testing process

Run the tests in:

```txt
/gpt-setup/gpt-preview-test-plan.md
```

Minimum launch tests:

1. funding broker signup
2. CPA/bookkeeper referral partner
3. small business attorney COI
4. business broker
5. veteran community connector
6. affiliate/content creator
7. low-info signup
8. shady lead seller / high-risk partner
9. strategic fintech partner
10. unqualified consumer

## Step 9 — Internal launch checklist

Before using this with real partner data:

- confirm the GPT stays inside the compliance guardrails
- confirm no guaranteed approval or guaranteed funding language appears
- confirm no credit repair framing appears
- confirm Action auth works
- confirm bad-auth tests fail correctly
- confirm low-info intakes trigger request-more-info behavior
- confirm high-risk intakes trigger manual review
- confirm dashboard-ready JSON is stable
- confirm no example contains real partner PII

## Step 10 — Versioning discipline

Use simple version tags in notes or release docs:

```txt
v0.1 — manual intake review only
v0.2 — knowledge tuned
v0.3 — Actions connected
v0.4 — internal team pilot
v1.0 — production-ready internal use
```

## What not to do in this batch

Do not create:

- Tally webhook implementation docs
- dashboard data contracts
- dashboard UI files
- automation workflows
- partner lead submission modules
- tracking link builders
- admin review dashboard files

That comes later. Stay sequential. The machine wins because the pieces snap together in order.
