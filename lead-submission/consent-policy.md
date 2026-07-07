# Lead Consent Policy

## Minimum consent signals

A lead submission should include:

- confirmation the lead expected contact
- partner source
- business contact permission
- optional marketing consent separated from operational follow-up consent
- timestamp
- submitter identity or partner ID

## Missing consent

If consent is missing:

- accept only if operationally necessary
- set status `manual_review_required`
- route to review queue
- do not send outbound partner/lead notifications yet

## Sensitive data

Do not request or store borrower documents in this endpoint. Do not ask for full SSN, bank credentials, tax returns, statements, or private login details.
