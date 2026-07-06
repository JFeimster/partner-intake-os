# Partner Intake OS

## Purpose

This folder contains the Batch 11 static dashboard MVP for Partner Intake OS inside the Moonshine Capital / Partner Command Center ecosystem.

The dashboard visualizes a sample partner record produced by the Partner Intake OS pipeline:

```text
Tally partner signup
→ Vercel webhook
→ normalized intake
→ scoring and classification
→ onboarding path
→ resource recommendations
→ campaign recommendations
→ admin review
→ dashboard-ready display
```

This is intentionally a static MVP. It is designed to prove the dashboard experience and data shape before building the authenticated partner/admin dashboard.

## Files

```text
/site/partner-intake/
├── index.html
├── styles.css
├── script.js
├── README.md
└── data/
    ├── sample-partner-profile.json
    ├── sample-onboarding-plan.json
    ├── sample-resource-recommendations.json
    ├── sample-campaign-recommendations.json
    └── sample-admin-review-card.json
```

## What the dashboard shows

- Hero / module intro
- Partner snapshot
- Partner tier and status
- Onboarding path
- Recommended next action
- Scorecard
- Risk flags
- Recommended resources
- Recommended campaign kit
- Admin review notes
- Lead submission CTA placeholder
- GPT Action/API status placeholder

## How to run locally

From the repo root:

```bash
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/site/partner-intake/
```

Why use a local server? The dashboard loads JSON files with `fetch()`. Most browsers block local JSON loading from `file://` paths. The Python server avoids that petty browser nonsense.

## Where the data lives

Sample data lives in:

```text
/site/partner-intake/data/
```

The current MVP loads:

- `sample-partner-profile.json`
- `sample-onboarding-plan.json`
- `sample-resource-recommendations.json`
- `sample-campaign-recommendations.json`
- `sample-admin-review-card.json`

These files are intentionally close to the Batch 10 dashboard data contracts, but this MVP stays lightweight and readable for manual repo use.

## How this connects later to the API

Current mode:

```text
Static HTML/CSS/JS → local JSON sample files
```

Future mode:

```text
Static/authenticated dashboard → Vercel API → storage router → Notion/HubSpot/Google Sheets/Supabase
```

Recommended future API data sources:

```text
GET /api/partners/{partner_id}
GET /api/partners/{partner_id}/onboarding-plan
GET /api/partners/{partner_id}/resources
GET /api/partners/{partner_id}/campaigns
GET /api/admin/partner-review/{partner_id}
```

Those endpoints are not created in this batch. This batch is dashboard UI only.

## Future authenticated version notes

A production dashboard should eventually add:

- Partner authentication
- Admin-only review queue
- Partner-specific resource access
- Partner tracking links
- Lead submission module
- Campaign assignment and status updates
- Audit logs
- Role-based permissions
- Storage-backed partner records

## Safety notes

Keep the dashboard educational and operational. Do not display or imply:

- guaranteed approvals
- guaranteed funding amounts
- fake lender certainty
- credit repair positioning
- deceptive urgency
- invented testimonials
- “everyone qualifies” language

The dashboard should help route and review partners. It should not become a promise machine wearing a fintech hoodie.
