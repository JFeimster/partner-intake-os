# Tracking Event Taxonomy

## Events

| Event | Meaning |
|---|---|
| `link_created` | Partner or system created a tracking link. |
| `click` | Link received a click. |
| `lead_started` | Visitor started lead flow. |
| `lead_submitted` | Lead was submitted for review. |
| `manual_review` | Admin/manual review touched the attributed record. |
| `partner_resource_opened` | Partner opened a recommended resource. |
| `campaign_kit_viewed` | Partner viewed a campaign kit. |

## Safe event fields

- `event_id`
- `event_type`
- `partner_id`
- `campaign_id`
- `tracking_link_id`
- `occurred_at`
- `source`
- `medium`
- `metadata_safe`

## Forbidden fields

- full IP address
- browser fingerprint
- borrower document contents
- bank details
- SSN
- private notes
- payout/commission values
