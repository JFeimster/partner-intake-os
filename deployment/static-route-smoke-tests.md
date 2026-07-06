# Static Route Smoke Tests

## Purpose

Confirm Partner Intake OS static pages resolve correctly in Vercel and local review.

## Base URL placeholders

Local:

```text
http://localhost:8080
```

Vercel:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app
```

## Routes to test

```text
/site/partner-intake/
/site/partner-intake/submit-lead.html
/site/partner-intake/tracking-link-builder.html
/site/partner-intake/admin/
```

## Local test command

From repo root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/site/partner-intake/
```

## Manual route checks

### `/site/partner-intake/`

Expected behavior:

- Main Partner Intake OS module loads.
- Partner snapshot or module intro is visible.
- Any local JSON sample data either loads or fails gracefully.
- No real partner or borrower PII appears.
- No API token appears in page source or console.

### `/site/partner-intake/submit-lead.html`

Expected behavior:

- Partner lead submission page loads.
- Form fields are labeled.
- Consent/permission copy is visible where applicable.
- Button copy avoids guaranteed approval/funding language.
- If API is not live yet, page clearly behaves as demo or shows safe fallback.

### `/site/partner-intake/tracking-link-builder.html`

Expected behavior:

- Tracking link builder page loads.
- UTM/campaign fields are visible.
- Generated link behavior is demo-safe unless API is live.
- No external shortlink service is called unless explicitly approved in a later phase.

### `/site/partner-intake/admin/`

Expected behavior:

- Admin review dashboard route loads or redirects to future admin auth.
- Sample data is clearly sample/demo.
- No real PII appears.
- Review queue elements are visible if static prototype exists.
- Admin-only behavior is not implied to be secure until Phase 26.

## Browser console checks

Open DevTools and check:

- No uncaught JavaScript errors.
- No failed required CSS/JS assets.
- No exposed `PARTNER_INTAKE_ACTION_TOKEN`.
- No exposed `TALLY_SIGNING_SECRET`.
- No exposed Notion/HubSpot tokens.
- No real partner or borrower data.

## Sample JSON loading checks

If the page loads local sample JSON:

- Confirm file paths are relative.
- Confirm JSON returns `200`.
- Confirm broken JSON does not kill the whole UI.
- Confirm sample data is obviously fake.

Recommended browser network filter:

```text
json
```

Expected sample paths may include:

```text
/site/partner-intake/data/sample-partner-profile.json
/site/partner-intake/data/sample-onboarding-plan.json
/site/partner-intake/data/sample-resource-recommendations.json
/site/partner-intake/data/sample-campaign-recommendations.json
/site/partner-intake/data/sample-admin-review-card.json
```

## Mobile layout checks

Test at:

- 390 px width.
- 768 px width.
- 1280 px width.

Pass criteria:

- No horizontal scrolling from layout blowouts.
- Buttons are tappable.
- Tables/cards remain readable.
- Navigation does not overlap content.
- Admin cards remain scannable.

## No-secrets checks

Search browser page source and bundled/static JS for:

```text
sk-
secret
token
PARTNER_INTAKE_ACTION_TOKEN
TALLY_SIGNING_SECRET
NOTION_API_KEY
HUBSPOT_ACCESS_TOKEN
```

Expected result:

- No real secret values.
- Env var names in docs are acceptable.
- Placeholder text is acceptable.
- Actual values are not acceptable.

## Pass/fail table

| Route | Local status | Vercel status | Console clean | No secrets | Mobile pass | Notes |
|---|---:|---:|---|---|---|---|
| `/site/partner-intake/` |  |  |  |  |  |  |
| `/site/partner-intake/submit-lead.html` |  |  |  |  |  |  |
| `/site/partner-intake/tracking-link-builder.html` |  |  |  |  |  |  |
| `/site/partner-intake/admin/` |  |  |  |  |  |  |
