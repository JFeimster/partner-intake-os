# Admin Auth Environment Variables

Configure these in Vercel Project Settings -> Environment Variables.

Do not commit real values to GitHub.

## Required

```text
PARTNER_ADMIN_TOKEN=
```

Shared admin token used to create a browser session. Generate a long random value.

Recommended local generation:

```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Strongly recommended

```text
PARTNER_ADMIN_SESSION_SECRET=
```

Separate secret used to sign session cookies. If omitted, the code falls back to `PARTNER_ADMIN_TOKEN`. Use a different long random value in production.

## Optional

```text
PARTNER_ADMIN_DEMO_MODE=false
PARTNER_INTAKE_ENV=production
```

### `PARTNER_ADMIN_DEMO_MODE`

When set to `true`, the review queue API can return sample data without a valid session.

Use only for non-production demos. Leave `false` in production. This is the admin equivalent of leaving the garage door open because you are “just grabbing something real quick.” Bad habit. Do not.

### `PARTNER_INTAKE_ENV`

Used by the auth helper to decide whether cookies should include `Secure` behavior when combined with Vercel production context.

## Local development example

```powershell
$env:PARTNER_ADMIN_TOKEN="dev-admin-token-change-me"
$env:PARTNER_ADMIN_SESSION_SECRET="dev-session-secret-change-me"
$env:PARTNER_ADMIN_DEMO_MODE="false"
$env:PARTNER_INTAKE_ENV="local"
```

## Vercel setup checklist

- [ ] Add `PARTNER_ADMIN_TOKEN` to Preview and Production.
- [ ] Add `PARTNER_ADMIN_SESSION_SECRET` to Preview and Production.
- [ ] Confirm `PARTNER_ADMIN_DEMO_MODE=false` for Production.
- [ ] Confirm no secrets are visible in client-side JS.
- [ ] Rotate token after screenshots, demos, or accidental exposure.
- [ ] Store token in a secure password manager.
