# Tally Testing Checklist

## Purpose

Use this checklist to validate the Tally → Vercel webhook → Partner Intake OS flow before treating partner intake as operational.

This checklist is intentionally practical. Run it like a pre-flight inspection, not a vibes ceremony.

## 1. Environment readiness

- [ ] Vercel project is deployed.
- [ ] `GET /api/health` returns healthy status.
- [ ] Production webhook endpoint is known.
- [ ] Endpoint placeholder has been replaced:

  ```text
  https://YOUR_VERCEL_DOMAIN.vercel.app/api/tally/partner-intake-webhook
  ```

- [ ] `PARTNER_INTAKE_ENV` is set.
- [ ] `PARTNER_INTAKE_STORAGE_MODE` is set.
- [ ] `TALLY_SIGNING_SECRET` is set in Vercel.
- [ ] `PARTNER_INTAKE_ACTION_TOKEN` is set in Vercel.
- [ ] Vercel deployment was refreshed after environment variables were added.
- [ ] Vercel logs are accessible for the person running the test.

## 2. Tally form readiness

- [ ] Partner signup form is the correct live form.
- [ ] Required contact fields exist.
- [ ] Partner type field exists.
- [ ] Audience field exists.
- [ ] Referral volume estimate field exists.
- [ ] Current tools field exists.
- [ ] Desired partner role field exists.
- [ ] Consent / acknowledgment field exists.
- [ ] Test submissions are clearly marked as tests.
- [ ] Tally field labels still match `/tally/tally-field-map.json`.

## 3. Webhook configuration

- [ ] Webhook URL is set to the Vercel endpoint.
- [ ] Webhook event type is set to `FORM_RESPONSE`.
- [ ] Signing secret is enabled.
- [ ] Signing secret matches `TALLY_SIGNING_SECRET` in Vercel.
- [ ] Optional custom header is added:

  ```text
  X-Partner-Source: tally
  ```

- [ ] No GPT Action endpoint is used as the Tally webhook URL.
- [ ] Webhook is enabled and saved in Tally.

## 4. Signature secret test

- [ ] Submit a valid test form response.
- [ ] Confirm Tally shows `2XX` delivery.
- [ ] Confirm Vercel logs show accepted signature.
- [ ] Temporarily test mismatch in a non-production environment only, if supported.
- [ ] Confirm invalid/missing signature returns `401`, `403`, or equivalent failure.
- [ ] Restore the correct signing secret immediately.

## 5. Submit low-info signup

Use the low-info sample in `/tally-setup/tally-sample-test-submissions.md`.

- [ ] Submission accepted by Tally.
- [ ] Webhook returns `2XX`.
- [ ] Normalized intake is created.
- [ ] Classification output does not overstate certainty.
- [ ] Expected tier is `tier_4` or `watchlist`.
- [ ] Expected onboarding path is `nurture_watchlist` or `request_more_info`.
- [ ] Manual review is required.
- [ ] Risk flags include `insufficient_information`.

## 6. Submit broker signup

- [ ] Submission accepted by Tally.
- [ ] Webhook returns `2XX`.
- [ ] Partner is classified as `funding_broker` or equivalent broker value.
- [ ] Scorecard reflects funding relevance and activation speed.
- [ ] Tier is based on deal flow, trust, tools, and compliance posture.
- [ ] Recommended onboarding path is `fast_track_revenue_partner` or `standard_affiliate_partner`.
- [ ] Recommended resources include broker-facing assets.
- [ ] Campaign recommendation is practical and tracking-ready.

## 7. Submit referral partner signup

- [ ] Submission accepted by Tally.
- [ ] Partner is classified as `referral_partner` or `center_of_influence`.
- [ ] Referral volume estimate influences score.
- [ ] Recommended onboarding path is `referral_only_partner` or `education_first_partner`.
- [ ] Next action is not aggressive sales outreach unless the profile supports it.

## 8. Submit CPA/bookkeeper signup

- [ ] Partner is classified as `cpa_bookkeeper` or `center_of_influence`.
- [ ] Primary audience captures SMB clients, cash flow gaps, advisory clients, tax planning clients, or similar.
- [ ] Recommended resources are educational and readiness-based.
- [ ] No credit repair framing is generated.
- [ ] Manual review is false unless notes include risk language or missing information.

## 9. Submit business broker signup

- [ ] Partner is classified as `business_broker`.
- [ ] Audience reflects acquisition entrepreneurs, sellers, buyers, or SMB acquisition deals.
- [ ] Onboarding path is `strategic_partner_review`, `referral_only_partner`, or `fast_track_revenue_partner` depending on volume and quality.
- [ ] Campaign recommendation focuses on acquisition financing readiness, not guaranteed funding.

## 10. Submit veteran/community connector signup

- [ ] Partner is classified as `veteran_community_connector` or `center_of_influence`.
- [ ] Audience captures veterans, military spouses, reservists, local entrepreneurs, or community founders.
- [ ] Recommended resource is education-first.
- [ ] Copy remains respectful, practical, and non-predatory.
- [ ] Manual review is false unless the submission includes sensitive claims, nonprofit co-branding questions, or unclear referral mechanics.

## 11. Submit creator affiliate signup

- [ ] Partner is classified as `creator_affiliate`.
- [ ] Audience and channel fit influence score.
- [ ] Recommended campaign kit includes affiliate content, tracking links, and disclaimers.
- [ ] Risk flags appear if the creator uses hype language, guarantee claims, or fake urgency.
- [ ] Next action includes sending approved swipe copy instead of letting them freestyle lender claims on the internet like a raccoon with a megaphone.

## 12. Submit strategic partner signup

- [ ] Partner is classified as `strategic_partner` or `fintech_vendor_partner`.
- [ ] Tier reflects strategic leverage, technical ability, and integration potential.
- [ ] Onboarding path is `strategic_partner_review`.
- [ ] Manual review is true.
- [ ] Next action is schedule strategy call or internal review, not auto-approval.

## 13. Submit high-risk/shady lead seller signup

- [ ] Submission accepted without crashing.
- [ ] Webhook still returns a clean response if payload is valid.
- [ ] Classification identifies risk instead of chasing volume.
- [ ] Expected tier is `reject` or `manual_risk_review`.
- [ ] Risk level is `high`.
- [ ] Manual review is true.
- [ ] Risk flags include one or more:
  - `guaranteed_approval_language`
  - `purchased_leads`
  - `unclear_consent`
  - `lead_resale`
  - `high_pressure_sales`
  - `compliance_risk`
  - `fake_lender_certainty`

## 14. Verify normalized intake

- [ ] `first_name` is populated when provided.
- [ ] `last_name` is populated when provided.
- [ ] `email` is normalized to lowercase.
- [ ] `phone` is preserved or normalized consistently.
- [ ] `company` is populated.
- [ ] `website` is populated if provided.
- [ ] `partner_type_claimed` captures claimed type, not final classification.
- [ ] `audience` captures actual audience.
- [ ] `current_tools` captures CRM/email/automation stack.
- [ ] `referral_volume_estimate` is converted consistently.
- [ ] `desired_partner_role` is populated.
- [ ] `source` is `tally`.
- [ ] `submitted_at` is preserved.

## 15. Verify classification output

- [ ] Final `partner_type` is assigned.
- [ ] Claimed type does not override evidence.
- [ ] Output includes confidence or reasoning summary if supported.
- [ ] Strategic, COI, broker, affiliate, and risk categories route correctly.
- [ ] Low-info records do not get inflated tiers.

## 16. Verify scorecard output

- [ ] Audience fit score exists.
- [ ] Trust score exists.
- [ ] Revenue potential score exists.
- [ ] Activation speed score exists.
- [ ] Compliance risk score exists.
- [ ] Strategic value score exists.
- [ ] Overall score exists.
- [ ] Tier recommendation matches the score and risk profile.
- [ ] Manual review field is populated.

## 17. Verify risk flags

- [ ] High-risk sample generates risk flags.
- [ ] Low-info sample generates `insufficient_information`.
- [ ] Clean broker sample does not generate false high-risk flags.
- [ ] CPA/legal/COI samples do not get over-penalized for not being funding brokers.
- [ ] Risk flags are visible to admin/GPT review.

## 18. Verify storage mode behavior

### Mock

- [ ] Response succeeds.
- [ ] No durable live record is expected.
- [ ] Response or logs show mock storage mode.

### JSON

- [ ] Record is written to configured JSON store if supported.
- [ ] No PII is committed to GitHub.

### Notion

- [ ] New Notion row/page is created.
- [ ] Fields map correctly.
- [ ] Manual review fields populate.

### HubSpot

- [ ] Contact/company/deal/task behavior matches the Batch 06 connector spec.
- [ ] No duplicate chaos unless expected.

### Google Sheets

- [ ] New row is created.
- [ ] Columns line up with expected mapping.
- [ ] Risk fields and next action are visible.

## 19. Verify webhook 2XX response

- [ ] Tally delivery log shows `2XX` for clean submissions.
- [ ] Response body does not leak sensitive raw payload data.
- [ ] Response includes request ID or partner ID when supported.
- [ ] Slow storage connector behavior does not cause Tally timeout.

## 20. Verify failed auth/signature behavior

Run only in local or preview unless production incident response requires it.

- [ ] Missing signature fails.
- [ ] Invalid signature fails.
- [ ] Wrong secret fails.
- [ ] Failure response does not reveal signing secret.
- [ ] Failure response does not reveal stack trace.
- [ ] Failed attempts are logged with timestamp, request ID, and safe metadata only.

## 21. Verify no Tally webhook endpoint is exposed in GPT Actions

- [ ] Open the GPT Action OpenAPI YAML/JSON.
- [ ] Confirm this path is absent:

  ```text
  /api/tally/partner-intake-webhook
  ```

- [ ] Confirm only safe GPT-facing endpoints are present.
- [ ] Confirm GPT Actions use Bearer token auth.
- [ ] Confirm Tally webhook uses signature verification, not GPT Bearer token auth.

## Pass/fail rule

The setup is not production-ready until these pass:

- [ ] Clean `FORM_RESPONSE` test returns `2XX`.
- [ ] Invalid signature fails.
- [ ] Normalized intake is created.
- [ ] Classification and scorecard are generated.
- [ ] High-risk lead seller routes to manual review or reject.
- [ ] No raw PII is dumped into public logs.
- [ ] Tally webhook endpoint is not exposed in GPT Actions.
