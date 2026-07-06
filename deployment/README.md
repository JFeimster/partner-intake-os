# Vercel Deployment Packet

This packet documents how to deploy the Partner Intake OS API and static dashboard module through Vercel without turning the repo into a fireworks factory.

It supports:

- Vercel API routes under `/api/`
- Static Partner Intake dashboard files under `/site/partner-intake/`
- GPT Action endpoints that require Bearer token auth
- Tally webhook deployment checks
- Preview/production deployment controls
- Rollback and smoke-test procedures

## Where this fits

Batches 01-12 created the GPT foundation, knowledge, schemas, Tally mapping, API scaffold, storage stubs, OpenAPI Action Pack, GPT setup packet, Tally setup packet, dashboard contracts, static dashboard MVP, and workflow docs.

Batch 13 created the GitHub repo integration packet.

Batch 14 creates only deployment/configuration guidance and the root `vercel.json`.

## Required setup order

1. Confirm the repo contains the existing Partner Intake OS folders.
2. Confirm `/api/health.ts` and partner endpoints exist from Batch 05.
3. Confirm `/site/partner-intake/` exists from Batch 11.
4. Add or review the environment variables in Vercel.
5. Confirm `vercel.json` does not conflict with an existing production site.
6. Deploy to a controlled preview or manually triggered production deployment.
7. Smoke-test API health, protected endpoints, Tally webhook behavior, and dashboard path.
8. Update the OpenAPI server URL after the deployment domain is final.

## Secret handling

Never commit real secrets, access tokens, API keys, signing secrets, private keys, OAuth credentials, service account JSON, or `.env` files.

Safe to commit:

- `.md` setup docs
- `.json` examples without real secrets
- `vercel.json`
- `.env.example` style placeholders inside docs

Not safe to commit:

- `.env`
- `.env.local`
- `.env.production`
- service account JSON
- real Tally signing secret
- real GPT Action token
- real HubSpot or Notion tokens
- logs containing partner PII

## Quick checklist

- [ ] Branch created for Batch 14 only.
- [ ] Existing `vercel.json` reviewed before replacement.
- [ ] Required env vars added in Vercel.
- [ ] `PARTNER_INTAKE_ACTION_TOKEN` generated and stored outside GitHub.
- [ ] `TALLY_SIGNING_SECRET` stored only in Vercel and Tally.
- [ ] Static dashboard loads at `/site/partner-intake/`.
- [ ] `GET /api/health` returns 200.
- [ ] Protected endpoints reject missing/bad Bearer tokens.
- [ ] Tally webhook endpoint is not exposed in GPT Actions.
- [ ] Rollback path is understood before production deployment.
