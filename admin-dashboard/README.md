# Admin Dashboard v2

Batch 40 creates the API-powered admin dashboard shell for Partner Intake OS.

## What this is

A plain HTML/CSS/JS dashboard that fetches from API endpoints and falls back to mock data. No React. No build step. No public exposure of admin data.

## Included modules

- Review Queue
- Partner Profiles
- Lead Queue
- Tracking Analytics
- Sync Monitor
- Compliance Flags
- GPT Action Logs
- Tally Intake Monitor
- Operator Notes
- Launch QA Status

## Security posture

- Do not host this page publicly without admin auth in front of it.
- Do not store tokens, admin sessions, API keys, partner PII, lead PII, borrower data, private notes, audit logs, or commission data in localStorage.
- This dashboard is a shell; production deployment should put it behind the protected admin route created earlier.

## Local run

```powershell
python -m http.server 8080
```

Open:

```text
http://localhost:8080/site/partner-intake/admin-v2/
```
