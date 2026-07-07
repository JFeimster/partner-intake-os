# Admin Dashboard v2 Checklist

## Static checks

- [ ] Opens at `/site/partner-intake/admin-v2/index.html`.
- [ ] Uses plain HTML/CSS/JS.
- [ ] No React, Next, bundler, or build step.
- [ ] Modules are loaded from `/modules/*.js`.
- [ ] Dashboard falls back to mock data when API calls fail.

## Security checks

- [ ] No localStorage use for admin data.
- [ ] No secrets, tokens, session IDs, partner PII, lead PII, borrower data, private notes, audit logs, or commission data in client files.
- [ ] Page is only deployed behind protected admin route.
- [ ] No Tally webhook endpoint is exposed.

## API checks

- [ ] `/api/admin/sync-status` renders sync health.
- [ ] `/api/admin/compliance-queue` renders compliance flags.
- [ ] `/api/tracking/summary` renders safe attribution summary.
