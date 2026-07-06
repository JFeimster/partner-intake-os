# Notion Database Setup

## Recommended database name

```text
Partner Intake OS — Partner Review Queue
```

Alternative shorter name:

```text
Partner Review Queue
```

## Recommended parent page

Create the database under one of these parent pages:

- Partner Command Center
- Moonshine Capital Ops
- Partner Intake OS
- Admin Review

Use a private/internal page first. Do not publish this database publicly.

## Step-by-step setup

### 1. Create the database

1. Open Notion.
2. Go to the chosen internal parent page.
3. Create a new full-page database.
4. Name it `Partner Intake OS — Partner Review Queue`.
5. Set the title property to `Name`.

### 2. Add properties

Add every property listed in `database-properties.md`.

Recommended minimum before testing sync:

- Partner ID
- Name
- Email
- Company
- Partner Type
- Partner Tier
- Onboarding Path
- Risk Level
- Status
- Source
- Submitted At
- Score
- Manual Review Required
- Risk Flags
- Next Action
- Owner
- Notes
- Last Synced At

### 3. Create views

Create the views listed in `views-and-filters.md`.

Start with:

- New Intakes
- Tier 1 Priority
- Manual Review
- Approved Partners
- Watchlist
- High Risk

### 4. Create the page template

Use `partner-record-template.md` as the internal page template for every partner record.

Template name:

```text
Partner Review Template
```

### 5. Create the Notion integration

1. Go to Notion integration settings.
2. Create an internal integration.
3. Name it:

```text
Partner Intake OS API
```

4. Copy the integration secret.
5. Store it only in Vercel as `NOTION_API_KEY`.
6. Do not commit it to GitHub.

### 6. Share database with integration

1. Open the database page.
2. Click `Share`.
3. Invite/select the integration named `Partner Intake OS API`.
4. Give only the permissions required for your sync flow.

Recommended MVP permission:

```text
Read content + Insert content + Update content
```

### 7. Capture database ID

The database ID is usually found in the Notion database URL.

Example URL shape:

```text
https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx?v=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

Use the database ID value for:

```text
NOTION_PARTNER_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 8. Add Vercel environment variables

Required for Notion sync:

```text
NOTION_API_KEY=
NOTION_PARTNER_DATABASE_ID=
PARTNER_INTAKE_STORAGE_MODE=notion
```

Recommended deployment environments:

- Development: test database or duplicate staging database
- Preview: staging database
- Production: production review database

### 9. Create test record

Use one record from `sample-records.json`.

Expected behavior:

- The record appears in `New Intakes`.
- If `Manual Review Required` is checked, it also appears in `Manual Review`.
- If `Risk Level` is `high`, it appears in `High Risk`.
- If `Partner Tier` is `tier_1`, it appears in `Tier 1 Priority`.

## Vercel env var mapping

| Vercel env var | Purpose | Required |
|---|---|---:|
| `NOTION_API_KEY` | Internal Notion integration secret | Yes |
| `NOTION_PARTNER_DATABASE_ID` | Target partner review database | Yes |
| `PARTNER_INTAKE_STORAGE_MODE` | Should be `notion` when writing to Notion | Yes |
| `PARTNER_INTAKE_ENV` | Environment label such as `development`, `preview`, `production` | Recommended |

## Setup warning

Do not paste the Notion API key into GPT Knowledge, GitHub, public docs, static dashboard files, frontend JavaScript, or screenshots. Secret leaks are expensive little gremlins.
