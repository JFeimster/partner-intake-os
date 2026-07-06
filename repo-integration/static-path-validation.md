# Static Path Validation

## Purpose

Validate the Partner Intake OS static module paths before and after merge.

Required static paths:

```text
/site/partner-intake/
/site/partner-intake/submit-lead.html
/site/partner-intake/tracking-link-builder.html
/site/partner-intake/admin/
```

## Local server command

From repo root:

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/site/partner-intake/
http://localhost:8080/site/partner-intake/submit-lead.html
http://localhost:8080/site/partner-intake/tracking-link-builder.html
http://localhost:8080/site/partner-intake/admin/
```

## Expected page behavior

### `/site/partner-intake/`

Expected:

- Loads without 404.
- Shows Partner Intake OS module/dashboard context.
- Uses sample/mock data only.
- Links to lead submission and tracking link builder if present.
- Does not require auth in current static MVP unless later protected route is intentionally added.
- Does not imply real production sync is active.

### `/site/partner-intake/submit-lead.html`

Expected:

- Loads without 404.
- Clearly says submission is reviewed and does not guarantee funding or approval.
- Has consent/permission language.
- Does not send real email/SMS.
- Does not submit to a real backend unless Phase 27 is completed and explicitly wired.
- Handles missing fields in demo mode.

### `/site/partner-intake/tracking-link-builder.html`

Expected:

- Loads without 404.
- Generates or displays demo tracking URLs only.
- Does not call Bitly, Rebrandly, TinyURL, or external APIs.
- Keeps UTM fields visible and understandable.
- Does not track sensitive personal data.

### `/site/partner-intake/admin/`

Expected:

- Loads without 404.
- Uses sample queue data only.
- Does not expose real partner or lead data.
- Clearly marks demo/static behavior unless later protected by Phase 26.
- Shows manual review fields/status without fake certainty.

## Sample JSON loading checks

If local JSON files are used:

- [ ] Open DevTools.
- [ ] Go to Network tab.
- [ ] Refresh page.
- [ ] Confirm JSON files return `200`.
- [ ] Confirm no JSON files include real PII.
- [ ] Confirm failed JSON loads show graceful fallback state.

Common local issue:

Opening HTML files directly with `file://` can block `fetch()` calls. Use:

```powershell
python -m http.server 8080
```

## Browser console checks

Open DevTools console and confirm:

- [ ] No uncaught JavaScript errors.
- [ ] No failed fetch errors except clearly handled optional sample files.
- [ ] No mixed content warnings.
- [ ] No references to undefined global objects.
- [ ] No accidental API calls to production endpoints.
- [ ] No real token printed.

## Mobile layout checks

Test at:

- 390px wide
- 768px wide
- 1024px wide

Confirm:

- [ ] No horizontal overflow.
- [ ] Forms remain usable.
- [ ] Cards stack cleanly.
- [ ] Buttons remain tappable.
- [ ] Admin table/list remains readable.
- [ ] Header/nav does not cover content.

## No-secrets checks

Run from repo root:

```powershell
Select-String -Path .\site\partner-intake\* -Pattern "sk-|secret|token|api_key|private_key|TALLY_SIGNING_SECRET|HUBSPOT_ACCESS_TOKEN|NOTION_API_KEY" -Recurse
```

Expected result:

- Placeholder docs may mention env var names.
- No real values should appear.

## Static route pass/fail log

| Route | Local result | Console clean | Mobile clean | Notes |
|---|---|---|---|---|
| `/site/partner-intake/` |  |  |  |  |
| `/site/partner-intake/submit-lead.html` |  |  |  |  |
| `/site/partner-intake/tracking-link-builder.html` |  |  |  |  |
| `/site/partner-intake/admin/` |  |  |  |  |
