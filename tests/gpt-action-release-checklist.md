# GPT Action Release Checklist

## Purpose

Final checklist before the Partner Intake OS GPT Action is used internally.

## Schema

- [ ] `/actions/openapi.yaml` imports successfully.
- [ ] `/actions/openapi.json` is available as fallback.
- [ ] Server URL uses the live Vercel domain.
- [ ] Required operation IDs are present:
  - [ ] `checkHealth`
  - [ ] `classifyPartnerIntake`
  - [ ] `recommendPartnerResources`
  - [ ] `generatePartnerOnboardingPlan`
  - [ ] `generatePartnerCampaignKit`
  - [ ] `logPartnerEvent`
- [ ] No duplicate operation IDs.
- [ ] No parser warnings that were ignored.

## Endpoint exposure

- [ ] `GET /api/health` is exposed.
- [ ] `POST /api/partners/classify` is exposed.
- [ ] `POST /api/partners/recommend-resources` is exposed.
- [ ] `POST /api/partners/generate-onboarding-plan` is exposed.
- [ ] `POST /api/partners/generate-campaign-kit` is exposed.
- [ ] `POST /api/partners/log-event` is exposed.
- [ ] `POST /api/tally/partner-intake-webhook` is not exposed.
- [ ] `/api/admin/*` is not exposed.
- [ ] raw storage/sync endpoints are not exposed.

## Auth

- [ ] Vercel `PARTNER_INTAKE_ACTION_TOKEN` is set.
- [ ] GPT Action auth is set to Bearer/API key.
- [ ] Good-token test passes.
- [ ] Bad-token test returns 401.
- [ ] Token was not committed.
- [ ] Token was not pasted into docs or screenshots.

## Live tests

- [ ] Health check passes.
- [ ] CPA/bookkeeper classification passes.
- [ ] Low-info intake returns manual review/request more info.
- [ ] High-risk lead seller returns risk flags.
- [ ] Resource recommendation passes.
- [ ] Onboarding plan passes.
- [ ] Campaign kit passes.
- [ ] Event logging stub passes.
- [ ] Vercel logs show request IDs.

## Compliance

- [ ] No guaranteed approval language.
- [ ] No guaranteed funding language.
- [ ] No fake lender certainty.
- [ ] No credit repair framing.
- [ ] No deceptive urgency.
- [ ] No invented testimonials.
- [ ] No “everyone qualifies” claims.
- [ ] Risky partner examples remain manual review or reject/escalate.

## Release decision

- [ ] Approved for controlled internal use.
- [ ] Needs repair.
- [ ] Blocked.

## Next phase gate

Do not start Phase 25 until the Action import and live tests are stable. Phase 25 introduces sandbox sync, which means the blast radius gets bigger. Test first, then wire the machines together.
