# Lead Submission Checklist

Use this checklist before merging or deploying the partner lead submission module.

## File checks

- [ ] `/lead-submission/README.md` exists.
- [ ] `/lead-submission/lead-form-fields.md` exists.
- [ ] `/lead-submission/lead.schema.json` exists.
- [ ] `/lead-submission/lead-field-map.json` exists.
- [ ] `/lead-submission/sample-lead-submission.json` exists.
- [ ] `/lead-submission/lead-routing-rules.md` exists.
- [ ] `/lead-submission/lead-review-rules.md` exists.
- [ ] `/lead-submission/lead-submission-api-spec.md` exists.
- [ ] `/lead-submission/partner-facing-copy.md` exists.
- [ ] `/site/partner-intake/submit-lead.html` exists.
- [ ] `/site/partner-intake/submit-lead.css` exists.
- [ ] `/site/partner-intake/submit-lead.js` exists.
- [ ] `/site/partner-intake/data/sample-lead-submission.json` exists.

## Schema checks

- [ ] JSON Schema uses Draft 2020-12.
- [ ] Required fields include lead ID, partner ID, business/contact fields, funding context, consent, submitted date, status, and risk flags.
- [ ] Enums are clear and compatible with CRM/dashboard usage.
- [ ] Sample lead validates against schema expectations.
- [ ] Sensitive document fields are not included.
- [ ] No secret or private key fields are included.

## Static page checks

- [ ] Page loads at `/site/partner-intake/submit-lead.html`.
- [ ] CSS loads correctly.
- [ ] JavaScript loads correctly.
- [ ] Demo form generates JSON.
- [ ] Load Sample Lead works when served from local HTTP server.
- [ ] Copy JSON button works in supported browsers.
- [ ] Required-field demo validation works.
- [ ] Mobile layout works.
- [ ] Page clearly says this is static/demo mode.

## Compliance checks

- [ ] Page does not claim approval.
- [ ] Page does not guarantee funding.
- [ ] Page does not promise rates, terms, amounts, or timing.
- [ ] Page does not use credit repair positioning.
- [ ] Consent language is present.
- [ ] “No funding outcome is guaranteed” language is present.
- [ ] Partner-facing copy warns against prohibited claims.
- [ ] Review rules include human review triggers.

## Routing/review checks

- [ ] Routing by partner tier is documented.
- [ ] Routing by funding purpose is documented.
- [ ] Risk flag routing is documented.
- [ ] Missing info rules are documented.
- [ ] Duplicate handling is documented.
- [ ] Notion/HubSpot/Sheets routing expectations are documented.
- [ ] Manual review triggers are documented.

## API-readiness checks

- [ ] Future `POST /api/leads/submit` is documented.
- [ ] Future `GET /api/leads/:lead_id` is documented.
- [ ] Future `POST /api/leads/log-event` is documented.
- [ ] Request examples are included.
- [ ] Response examples are included.
- [ ] Auth model is documented.
- [ ] Rate-limit notes are documented.
- [ ] Future GPT Action recommendation is included.
- [ ] API code was not created in this batch.

## Pass/fail log

| Test | Pass/Fail | Notes |
|---|---|---|
| File tree complete |  |  |
| Static page loads |  |  |
| Sample JSON loads |  |  |
| Demo payload generated |  |  |
| Schema reviewed |  |  |
| Compliance reviewed |  |  |
| No secrets exposed |  |  |
| No future batch files created |  |  |
