# Partner Tracking Link Builder

## Purpose

The tracking link builder creates partner-specific URLs that preserve attribution across partner campaigns, lead submission forms, campaign kits, and future CRM records. It gives Partner Command Center a clean way to know which partner, campaign, and channel produced a signup or lead.

This is not a payout engine. It is not a commission ledger. It is not a promise that every click becomes a qualified funding opportunity. It is the attribution plumbing: boring, useful, and very expensive to fix later if it is sloppy.

## What it does

- Generates partner-specific destination URLs.
- Adds `partner_id`, `campaign_id`, `tracking_id`, `referral_source`, and standard UTM parameters.
- Supports sample campaign presets for brokers, CPAs, attorneys, business brokers, veteran/community connectors, affiliates, fintech partners, and watchlist/test partners.
- Produces records that can later sync into Notion, HubSpot, Google Sheets, or a tracking database.
- Gives partners and admins copy/paste-ready links for launch campaigns.

## Why partner attribution matters

Partner growth gets chaotic when signups arrive from DMs, texts, events, email blasts, QR codes, and handshakes with no source data. Attribution allows the ops team to see:

- Which partners are actually driving activity.
- Which campaign kits are worth repeating.
- Which lead sources need manual review.
- Which partners need better onboarding or better assets.
- Which records should be connected to HubSpot, Notion, and future dashboard modules.

No attribution means everybody argues with screenshots. That is not ops; that is a tavern brawl with spreadsheets.

## How it connects to lead submission

The lead submission module can accept `partner_id`, `tracking_id`, `campaign_id`, and `referral_source` as hidden fields, query parameters, or manually entered values. When a partner shares a tracking link, the future lead form can pre-fill or preserve those values.

Recommended lead submission flow:

1. Admin creates partner tracking link.
2. Partner shares the generated URL.
3. Visitor lands on the partner signup or lead submission page.
4. Query parameters are preserved.
5. Submitted lead includes partner/campaign attribution.
6. HubSpot/Notion records include the attribution fields.
7. Admin can review partner quality by campaign.

## How it connects to campaign kits

Campaign kits should include tracking links for each recommended channel:

- Email link
- LinkedIn link
- SMS/manual outreach link
- QR/event link
- Partner resource page link
- Lead submission link

Each campaign kit should reference the same `campaign_id` while varying `medium`, `content`, and optionally `term`.

## What it does not do yet

This Batch 19 module does not:

- Track clicks server-side.
- Generate real shortlinks.
- Create QR codes.
- Sync to HubSpot, Notion, or Sheets.
- Create commission reports.
- Validate partner access.
- Authenticate users.
- Store live campaign records.

Those belong in future API, storage, auth, and analytics batches.

## Privacy and attribution notes

- Do not put private applicant data in URLs.
- Do not put emails, phone numbers, SSNs, business tax IDs, revenue documents, bank data, or personal identifiers in UTM fields.
- Use stable partner IDs rather than personal names where possible.
- Treat attribution as directional operating data, not legal proof of compensation.
- Keep compliance language clean: tracking links identify source and campaign; they do not imply eligibility, approval, funding certainty, or lender commitment.

## Recommended implementation order

1. Use this static builder for manual campaign links.
2. Add generated links to campaign kits.
3. Preserve query parameters on lead submission pages.
4. Store submitted attribution fields in Notion/HubSpot.
5. Add server-side click/event logging later.
6. Add partner dashboard reporting later.
