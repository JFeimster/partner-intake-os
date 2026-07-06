# Tracking Link Specification

## Base URL structure

A generated tracking link should point to a controlled destination page and append attribution parameters.

Recommended format:

```text
{destination_url}?partner_id={partner_id}&campaign_id={campaign_id}&tracking_id={tracking_id}&referral_source={source}&utm_source={source}&utm_medium={medium}&utm_campaign={campaign}&utm_content={content}&utm_term={term}
```

Example:

```text
https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_broker_ironbridge&campaign_id=ck_broker_missing_docs_2026q3&tracking_id=trk_ptr_broker_ironbridge_2026q3_missingdocs_email&utm_source=partner&utm_medium=email&utm_campaign=broker_missing_docs_2026q3&utm_content=followup_sequence_v1&utm_term=working_capital
```

## Required parameters

| Parameter | Purpose | Example |
|---|---|---|
| `partner_id` | Identifies the partner or source account. | `ptr_cpa_ledgerlane` |
| `campaign_id` | Identifies the campaign kit or promotion. | `ck_cpa_cashflow_gap_2026q3` |
| `tracking_id` | Unique tracking record ID. | `trk_ptr_cpa_ledgerlane_2026q3_cashflow_email` |
| `referral_source` | Human-readable source grouping. | `partner` |
| `utm_source` | Standard analytics source. | `partner` |
| `utm_medium` | Channel/medium. | `email` |
| `utm_campaign` | Campaign name. | `cpa_cashflow_gap_2026q3` |
| `utm_content` | Creative, placement, or variation. | `newsletter_link_v1` |
| `utm_term` | Optional segment or audience keyword. | `working_capital` |

## Base destination examples

Use destinations that match the intended action:

```text
https://distilledfunding.com/partner-intake/submit-lead
https://distilledfunding.com/partner-intake/
https://distilledfunding.com/funding-readiness
https://distilledfunding.com/partner-command-center
https://distilledfunding.com/blog/categories/ai-tools
```

For local static testing:

```text
http://localhost:8080/site/partner-intake/submit-lead.html
http://localhost:8080/site/partner-intake/tracking-link-builder.html
```

## Partner ID parameter

Use `partner_id` as the cross-system partner key. It should match Partner Intake OS, HubSpot, Notion, and lead submission records.

Format:

```text
ptr_{partner_type}_{slug}
```

Examples:

```text
ptr_broker_ironbridge
ptr_cpa_ledgerlane
ptr_attorney_mainstreet
ptr_veteran_freedomhub
```

## Campaign ID parameter

Use `campaign_id` to identify the campaign kit or promotion.

Format:

```text
ck_{campaign_type}_{audience_or_angle}_{period}
```

Examples:

```text
ck_broker_missing_docs_2026q3
ck_cpa_cashflow_gap_2026q3
ck_veteran_founder_readiness_2026q3
```

## UTM parameters

Use UTM parameters for external analytics and campaign grouping. Keep them lowercase, readable, and free of PII.

Recommended UTM rules:

- `utm_source`: broad source bucket, such as `partner`, `affiliate`, `event`, `email`, or `qr`.
- `utm_medium`: channel, such as `email`, `sms`, `linkedin`, `newsletter`, `community`, `event`, `qr`, or `direct`.
- `utm_campaign`: campaign name and period.
- `utm_content`: creative/placement/version.
- `utm_term`: optional segment, audience, or keyword.

## Referral source parameter

`referral_source` should help internal routing even if analytics tools strip UTM values.

Allowed examples:

```text
partner
affiliate
broker
coi
event
manual
watchlist_test
```

## Example generated URLs

Broker missing-docs campaign:

```text
https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_broker_ironbridge&campaign_id=ck_broker_missing_docs_2026q3&tracking_id=trk_ptr_broker_ironbridge_2026q3_missingdocs_email&referral_source=broker&utm_source=partner&utm_medium=email&utm_campaign=broker_missing_docs_2026q3&utm_content=sequence_step_1&utm_term=working_capital
```

CPA cash-flow gap campaign:

```text
https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_cpa_ledgerlane&campaign_id=ck_cpa_cashflow_gap_2026q3&tracking_id=trk_ptr_cpa_ledgerlane_2026q3_cashflow_newsletter&referral_source=coi&utm_source=partner&utm_medium=newsletter&utm_campaign=cpa_cashflow_gap_2026q3&utm_content=monthly_client_note&utm_term=cash_flow
```

Veteran connector readiness campaign:

```text
https://distilledfunding.com/partner-intake/submit-lead?partner_id=ptr_veteran_freedomhub&campaign_id=ck_veteran_founder_readiness_2026q3&tracking_id=trk_ptr_veteran_freedomhub_2026q3_event_qr&referral_source=community&utm_source=event&utm_medium=qr&utm_campaign=veteran_founder_readiness_2026q3&utm_content=workshop_table_card&utm_term=veteran_founders
```

## Shortlink notes

Shortlinks are useful for partners, QR codes, print materials, and events, but do not add a shortlink provider yet in this static batch.

Future recommendation:

- Generate long URL first.
- Store full attribution record.
- Create shortlink through a server-side API or approved shortlink tool.
- Never expose private shortlink API keys in the browser.

## QR code future notes

QR codes are useful for:

- Cashflow game nights
- veteran/community events
- CPA office handouts
- business broker packets
- networking table cards

Future QR generation should happen either server-side or with a client-side library that does not require a secret. Store the underlying tracking record before printing the QR code.
