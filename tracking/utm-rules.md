# UTM Rules

## Naming principles

UTM values should be lowercase, readable, consistent, and free of personal or sensitive information.

Use:

```text
lowercase_words_with_underscores
```

Do not use:

```text
Spaces
Random CAPS
Partner email addresses
Applicant names
Phone numbers
Private lead details
```

Bad attribution hygiene is how dashboards become haunted haystacks. Keep it boring. Boring scales.

## Allowed sources

| Source | Use case |
|---|---|
| `partner` | Standard partner-generated link |
| `broker` | Broker-specific referral campaign |
| `affiliate` | Creator/affiliate campaign |
| `coi` | Center-of-influence referral campaign |
| `event` | Offline event or QR campaign |
| `email` | Owned email campaign |
| `social` | General social campaign |
| `manual` | Hand-entered source |
| `watchlist_test` | Testing/watchlist record |

## Allowed mediums

| Medium | Use case |
|---|---|
| `email` | Partner email, newsletter, direct email |
| `sms` | Manual text outreach |
| `linkedin` | LinkedIn post, DM, article, profile link |
| `facebook` | Facebook post/group/page |
| `instagram` | Instagram bio/story/post |
| `youtube` | YouTube description/community/comments |
| `podcast` | Podcast show notes or spoken CTA |
| `newsletter` | Partner or community newsletter |
| `qr` | QR code on printed/offline material |
| `event` | Live event page or event source |
| `direct` | Direct partner share |
| `resource` | Resource hub or toolkit link |

## Campaign naming pattern

Use:

```text
{partner_type}_{angle_or_offer}_{period}
```

Examples:

```text
broker_missing_docs_2026q3
cpa_cashflow_gap_2026q3
attorney_working_capital_readiness_2026q3
business_broker_acquisition_readiness_2026q3
veteran_founder_readiness_2026q3
affiliate_side_hustle_funding_2026q3
fintech_embedded_referral_2026q3
```

## Content naming pattern

Use content to identify the creative, placement, or version.

Pattern:

```text
{placement_or_asset}_{version}
```

Examples:

```text
sequence_step_1
newsletter_link_v1
linkedin_dm_v1
qr_table_card_v1
youtube_description_v1
resource_footer_v1
```

## Term naming pattern

Use `utm_term` for audience segment, niche, or campaign keyword.

Examples:

```text
working_capital
cash_flow
acquisition
contractors
veteran_founders
ecommerce
franchise_buyers
```

## Examples by partner type

### Funding broker

```text
utm_source=partner
utm_medium=email
utm_campaign=broker_missing_docs_2026q3
utm_content=sequence_step_1
utm_term=working_capital
```

### CPA/bookkeeper

```text
utm_source=partner
utm_medium=newsletter
utm_campaign=cpa_cashflow_gap_2026q3
utm_content=monthly_client_note
utm_term=cash_flow
```

### Small business attorney

```text
utm_source=coi
utm_medium=linkedin
utm_campaign=attorney_working_capital_readiness_2026q3
utm_content=linkedin_post_v1
utm_term=business_formation
```

### Business broker

```text
utm_source=coi
utm_medium=email
utm_campaign=business_broker_acquisition_readiness_2026q3
utm_content=buyer_intro_email_v1
utm_term=acquisition
```

### Veteran/community connector

```text
utm_source=event
utm_medium=qr
utm_campaign=veteran_founder_readiness_2026q3
utm_content=workshop_table_card
utm_term=veteran_founders
```

### Affiliate/content creator

```text
utm_source=affiliate
utm_medium=youtube
utm_campaign=affiliate_side_hustle_funding_2026q3
utm_content=video_description_v1
utm_term=side_hustle
```

### Strategic fintech partner

```text
utm_source=partner
utm_medium=resource
utm_campaign=fintech_embedded_referral_2026q3
utm_content=partner_portal_link_v1
utm_term=embedded_finance
```

## Compliance-safe UTM rules

Never use UTM values that imply:

- guaranteed approval
- guaranteed funding amount
- everyone qualifies
- credit repair
- fake lender certainty
- artificial urgency

Do not use examples like:

```text
utm_campaign=guaranteed_approval
utm_content=instant_100k_approved
utm_term=bad_credit_repair
```

Use readiness and operational language instead:

```text
utm_campaign=funding_readiness_2026q3
utm_content=client_checklist_v1
utm_term=working_capital_readiness
```
