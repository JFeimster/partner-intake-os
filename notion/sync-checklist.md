# Notion Sync Checklist

Use this checklist before treating Notion sync as live.

## Vercel env vars

- [ ] `NOTION_API_KEY` exists in Vercel.
- [ ] `NOTION_PARTNER_DATABASE_ID` exists in Vercel.
- [ ] `PARTNER_INTAKE_STORAGE_MODE` is set to `notion` for the intended environment.
- [ ] `PARTNER_INTAKE_ENV` matches the environment: `development`, `preview`, or `production`.
- [ ] No Notion secrets are committed to GitHub.
- [ ] No Notion secrets are exposed in frontend JavaScript.

## Notion integration

- [ ] Internal Notion integration exists.
- [ ] Integration is named clearly, such as `Partner Intake OS API`.
- [ ] Integration secret is stored only in environment variables.
- [ ] Database is shared with the integration.
- [ ] Integration has the minimum needed permissions.

## Database structure

- [ ] Database name is correct.
- [ ] Required properties exist.
- [ ] Select and multi-select options match `database-properties.md`.
- [ ] Views exist from `views-and-filters.md`.
- [ ] Page template exists from `partner-record-template.md`.

## Test record creation

- [ ] Create a broker test record.
- [ ] Create a CPA/bookkeeper test record.
- [ ] Create a high-risk lead seller test record.
- [ ] Confirm records appear in the correct views.
- [ ] Confirm `Last Synced At` updates.

## Update test

- [ ] Change Status from `new` to `needs_review`.
- [ ] Change Partner Tier from `tier_3` to `tier_2`.
- [ ] Add a Risk Flag.
- [ ] Update Next Action.
- [ ] Confirm Notion reflects the update correctly.

## Status transition test

- [ ] `new` → `needs_review` works.
- [ ] `needs_review` → `missing_info` works.
- [ ] `needs_review` → `approved` works.
- [ ] `approved` → `onboarding` works.
- [ ] `onboarding` → `active` works.
- [ ] `needs_review` → `watchlist` works.
- [ ] `needs_review` → `rejected` works.
- [ ] Any inactive record → `archived` works.

## Manual review test

- [ ] Record with `Manual Review Required = true` appears in Manual Review view.
- [ ] Record with `Risk Level = high` appears in High Risk view.
- [ ] Record with `Partner Tier = tier_1` appears in Tier 1 Priority view.
- [ ] Risk flag notes are visible enough for human decision-making.

## Failure handling notes

If Notion sync fails:

1. Return a safe API error response.
2. Do not leak Notion API keys or raw stack traces.
3. Log request ID and partner ID.
4. Preserve original partner intake in memory/queue if available.
5. Retry only if safe and idempotent.
6. Do not create duplicate Notion records on retry.

## Dedupe rules

Preferred dedupe order:

1. `partner_id`
2. `email`
3. `company + website`
4. Manual review if ambiguous

## Go-live gate

Do not call Notion sync production-ready until:

- Required properties pass.
- Test records pass.
- High-risk records route correctly.
- Duplicate handling is understood.
- Env vars are verified.
- Secrets are not exposed.
