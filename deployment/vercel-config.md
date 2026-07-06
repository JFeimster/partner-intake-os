# Vercel Project Configuration

This guide sets up Partner Intake OS inside the Partner Command Center repo as a controlled Vercel deployment.

## Recommended project settings

| Setting | Recommendation | Notes |
|---|---|---|
| Project name | `partner-command-center` or current existing project name | Do not create a duplicate project unless the repo is intentionally split. |
| Framework preset | Other / static-compatible | The project uses plain HTML/CSS/JS plus Vercel API routes. |
| Root directory | `./` | Keep root-level folders visible to Vercel. |
| Install command | Blank or existing repo default | Do not invent package install steps unless the repo already needs them. |
| Build command | Blank or existing repo default | For static-only roots, no build command is needed. If TypeScript API compilation is needed later, define it explicitly. |
| Output directory | Blank or existing repo default | Do not point output to `/site/partner-intake/` unless this repo becomes only that static module. |
| Production branch | `main` | Keep production tied to the repo default branch. |
| Deployments | Controlled/manual until validated | Avoid surprise deployments while API endpoints and Actions are being tested. |

## Framework preset guidance

Use the simplest Vercel configuration that supports the current repo.

Recommended starting posture:

- Static files are served from the repo path where they live.
- API routes remain under `/api/`.
- No custom rewrites unless the existing site already requires them.
- No build output remapping unless the entire repo is structured around one build system.

Do not force Next.js, React, or a build step onto this project. That is how a clean static module turns into a dependency swamp wearing cologne.

## Build command guidance

Use one of these patterns:

### Static-first repo

Leave build command blank.

```text
Build Command: 
Output Directory:
Install Command:
```

### Existing repo already has a build

Preserve the existing settings. Do not overwrite them just for Partner Intake OS.

```text
Build Command: existing repo command
Output Directory: existing repo output directory
```

### API TypeScript needs compilation later

Only add a build step if the Vercel API scaffold or repo toolchain requires it.

Document the exact reason in the PR description before changing build settings.

## Output directory guidance

Do not set output directory to `/site/partner-intake/` unless you want the Partner Intake module to become the entire deployed site.

For the Partner Command Center repo, keep the root site behavior intact and test Partner Intake under:

```text
/site/partner-intake/
```

## Serverless/API route expectations

Expected API endpoints from earlier batches:

```text
GET  /api/health
POST /api/partners/classify
POST /api/partners/recommend-resources
POST /api/partners/generate-onboarding-plan
POST /api/partners/generate-campaign-kit
POST /api/partners/log-event
POST /api/tally/partner-intake-webhook
```

Rules:

- GPT-facing partner endpoints require `Authorization: Bearer <token>`.
- The Tally webhook endpoint is for Tally only.
- The Tally webhook must not be included in the GPT Action OpenAPI schema.
- API responses should be JSON.
- Webhook responses should return 2XX quickly.

## Static dashboard path notes

The static MVP lives here:

```text
/site/partner-intake/
```

Test locally:

```powershell
cd "C:\Users\jason\OneDrive\Desktop\Vercel Projects\Partner Command Center"
python -m http.server 8080
```

Then open:

```text
http://localhost:8080/site/partner-intake/
```

After deployment, test:

```text
https://YOUR_VERCEL_DOMAIN.vercel.app/site/partner-intake/
```

## Existing `vercel.json` replacement notes

If the repo already has a `vercel.json`, compare it before replacing. The Batch 14 file is intentionally conservative:

- Keeps `cleanUrls`.
- Keeps `trailingSlash` off.
- Adds safe security headers.
- Avoids rewrites.
- Avoids redirects.
- Does not include secrets.
- Includes Git deployment control set to disabled for controlled releases.

If the existing repo depends on redirects, rewrites, custom functions, cron jobs, or framework settings, merge those manually instead of blindly replacing the file.
