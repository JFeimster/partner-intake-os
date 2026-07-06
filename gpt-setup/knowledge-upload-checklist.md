# Knowledge Upload Checklist

Use this checklist when uploading reference files into the Partner Intake OS Custom GPT.

## Upload rules

- Upload knowledge files after the instructions are pasted.
- Keep behavior and rules in `/gpt/instructions.md`.
- Use knowledge files as reference material.
- Do not upload files containing real partner PII.
- Do not upload private credentials, API tokens, webhook secrets, or CRM exports with sensitive partner data.
- Keep examples synthetic or sanitized.
- After upload, test the GPT in Preview before sharing.

## Core GPT files to upload

Upload these after the knowledge files unless file count limits require trimming.

| Upload | File | Purpose |
|---:|---|---|
| [ ] | `/gpt/output-formats.md` | Reusable output formats for summaries, scorecards, CRM notes, JSON records, onboarding plans, recommendations, and dashboard cards. |
| [ ] | `/gpt/test-prompts.md` | QA prompts for testing partner types and edge cases. |

Usually do **not** upload:

| File | Reason |
|---|---|
| `/gpt/instructions.md` | Paste into Instructions instead. Uploading it as Knowledge is redundant. |
| `/gpt/profile.md` | Useful for setup, but not required as runtime knowledge. |
| `/gpt/conversation-starters.md` | Use this to configure starters in the editor; upload only if you want it available as reference. |

## Knowledge files to upload

| Priority | Upload | File | Purpose |
|---:|---:|---|---|
| 1 | [ ] | `/knowledge/partner-types.md` | Defines partner categories and fit criteria. |
| 2 | [ ] | `/knowledge/tiering-rules.md` | Defines scoring criteria and tier logic. |
| 3 | [ ] | `/knowledge/onboarding-paths.md` | Maps partners to onboarding paths. |
| 4 | [ ] | `/knowledge/compliance-guardrails.md` | Keeps claims safe and avoids risky copy. |
| 5 | [ ] | `/knowledge/crm-fields.md` | Standard CRM fields, tags, statuses, and notes. |
| 6 | [ ] | `/knowledge/resource-catalog.md` | Resource recommendations by partner type and audience. |
| 7 | [ ] | `/knowledge/campaign-kit-catalog.md` | Campaign kit options, CTAs, channels, and launch ideas. |
| 8 | [ ] | `/knowledge/referral-playbook.md` | Referral and center-of-influence partner workflows. |
| 9 | [ ] | `/knowledge/broker-playbook.md` | Broker, ISO, and funding advisor partner workflows. |
| 10 | [ ] | `/knowledge/funding-products-summary.md` | Educational summary of funding product categories. |
| 11 | [ ] | `/knowledge/sample-intakes.md` | Synthetic sample intakes and expected classification notes. |

## Optional technical reference files

Use these only if the GPT needs schema awareness during manual review.

| Upload | File | Purpose |
|---:|---|---|
| [ ] | `/schemas/intake.schema.json` | Raw/normalized intake structure. |
| [ ] | `/schemas/profile.schema.json` | Normalized partner profile structure. |
| [ ] | `/schemas/scorecard.schema.json` | Scorecard structure. |
| [ ] | `/schemas/onboarding-plan.schema.json` | Structured onboarding plan format. |
| [ ] | `/schemas/resource-recommendation.schema.json` | Resource recommendation format. |
| [ ] | `/schemas/campaign-recommendation.schema.json` | Campaign recommendation format. |
| [ ] | `/schemas/crm-event.schema.json` | CRM event format. |
| [ ] | `/schemas/api-error.schema.json` | Error response format. |

## Do not upload as GPT Knowledge

Do not upload:

```txt
.env files
API tokens
Tally signing secrets
HubSpot access tokens
Notion API keys
Google service account keys
raw partner PII exports
live CRM dumps
private lender contracts
commission data
bank statements
borrower applications
```

## File count strategy

If the GPT editor file limit becomes a bottleneck, use this upload order:

1. `/knowledge/partner-types.md`
2. `/knowledge/tiering-rules.md`
3. `/knowledge/onboarding-paths.md`
4. `/knowledge/compliance-guardrails.md`
5. `/knowledge/crm-fields.md`
6. `/knowledge/resource-catalog.md`
7. `/knowledge/campaign-kit-catalog.md`
8. `/knowledge/sample-intakes.md`
9. `/gpt/output-formats.md`
10. `/gpt/test-prompts.md`

The rest can stay in GitHub as source docs until needed.

## Post-upload checks

Run these Preview tests:

- Ask for a partner classification using only pasted raw intake.
- Ask for dashboard-ready JSON.
- Ask for CRM-ready notes.
- Ask for a resource recommendation.
- Ask for a campaign recommendation.
- Paste a low-info signup and confirm the GPT requests missing details.
- Paste a high-risk/shady lead seller signup and confirm it triggers manual review.
- Confirm the GPT does not invent approvals, funding amounts, lender certainty, testimonials, or credit repair outcomes.
