# Partner ID Rules

## Purpose

`partner_id` is the cross-system identifier that connects partner intake records, lead submissions, campaign links, Notion records, HubSpot records, and future dashboard views.

It should be stable, readable, and safe to use in URLs.

## Recommended format

```text
ptr_{partner_type}_{slug}
```

Examples:

```text
ptr_broker_ironbridge
ptr_cpa_ledgerlane
ptr_attorney_mainstreet
ptr_business_broker_exitpath
ptr_veteran_freedomhub
ptr_affiliate_hustleforge
ptr_fintech_embeddedstack
ptr_test_watchlist01
```

## Partner type codes

| Code | Use case |
|---|---|
| `broker` | Funding broker, ISO, funding advisor |
| `cpa` | CPA or bookkeeping firm |
| `attorney` | Small business attorney |
| `business_broker` | Business broker or M&A connector |
| `veteran` | Veteran/community connector |
| `affiliate` | Creator, content partner, media affiliate |
| `fintech` | Fintech/vendor/strategic integration partner |
| `referral` | General referral partner |
| `test` | Test/watchlist partner |

## Slug format

Use a human-readable slug:

```text
lowercase-words-converted-to-underscores
```

Rules:

- Lowercase only.
- Use letters, numbers, and underscores.
- No spaces.
- No special characters.
- No email addresses.
- No phone numbers.
- No sensitive personal identifiers.

Company/brand example:

```text
IronBridge Funding Partners -> ironbridge
Ledger Lane Bookkeeping -> ledgerlane
Freedom Hub Veterans Network -> freedomhub
```

## Collision handling

If a generated partner ID already exists, append a short suffix.

Examples:

```text
ptr_broker_ironbridge_02
ptr_cpa_ledgerlane_atl
ptr_affiliate_hustleforge_yt
```

Do not silently overwrite an existing partner ID. Duplicate IDs will poison attribution and make the dashboard look like a crime scene.

## Human-readable IDs vs system IDs

Use both when possible:

| Field | Purpose | Example |
|---|---|---|
| `partner_id` | Stable system key | `ptr_cpa_ledgerlane` |
| `partner_slug` | Friendly URL/display slug | `ledgerlane` |
| `display_name` | Human-readable name | `Ledger Lane Bookkeeping` |
| `hubspot_contact_id` | HubSpot internal ID | `123456789` |
| `notion_page_id` | Notion internal page ID | `abc123...` |

## When to change a partner ID

Avoid changing `partner_id` once links are active.

Acceptable reasons to change:

- The original ID exposed private data.
- The original ID was wrong or duplicated.
- A partner account was merged.

When changing a partner ID:

1. Preserve old ID as an alias.
2. Redirect or map old links if a backend exists.
3. Update HubSpot/Notion cross-system fields.
4. Log the change.
5. Notify admins using the affected campaign links.

## Examples

```json
{
  "partner_id": "ptr_broker_ironbridge",
  "partner_slug": "ironbridge",
  "partner_type": "broker",
  "display_name": "IronBridge Funding Partners"
}
```

```json
{
  "partner_id": "ptr_veteran_freedomhub",
  "partner_slug": "freedomhub",
  "partner_type": "veteran",
  "display_name": "Freedom Hub Veterans Network"
}
```
