# Contact, Company, and Deal Mapping

## Purpose

This file explains when Partner Intake OS should create or update HubSpot contacts, companies, and deals.

The goal is clean CRM behavior: no duplicate graveyard, no orphaned deals, no random partner records floating around like feral spreadsheets.

## Object strategy

| Object | Create when | Update when | Key field |
|---|---|---|---|
| Contact | A person submits partner intake or is manually added as a partner contact. | Email already exists or Partner ID matches. | Email first, Partner ID second. |
| Company | The partner has a company, firm, agency, brand, org, or domain. | Domain already exists or company name strongly matches. | Company domain first, company name second. |
| Deal | The relationship requires review, activation, onboarding, or pipeline tracking. | Partner ID already has an open Partner Pipeline deal. | Partner ID. |

## Contact creation rules

Create or update a Contact when:

- email exists
- person is the partner contact, broker, affiliate, COI, or strategic contact
- intake has enough identifying data to create a useful CRM record
- record is not obvious spam or duplicate trash

Minimum contact data:

```text
email
first_name or display_name
partner_type
partner_status
source
```

Recommended contact fields:

```text
partner_id
partner_type
partner_tier
onboarding_path
primary_audience
risk_level
partner_status
partner_source
partner_score
manual_review_required
risk_flags
recommended_resources
recommended_campaign
next_action
last_partner_intake_sync
```

## Company creation rules

Create or update a Company when:

- website/domain exists
- company name is provided
- partner is a firm, brokerage, law office, accounting practice, media brand, fintech vendor, or community org
- the relationship is likely to involve multiple contacts

Do not create a company for every low-info or junk signup. That is how CRMs become digital hoarder houses.

Company key order:

1. Website domain
2. Existing associated company from contact
3. Exact company name match
4. Manual review if ambiguous

## Deal creation rules

Create or update a Deal in the Partner Intake Pipeline when:

- partner record is legitimate enough for review
- partner is Tier 1, Tier 2, Tier 3, or watchlist
- partner needs onboarding
- partner needs admin decision
- partner may produce referral, affiliate, or channel value

Avoid creating a deal when:

- partner is clearly rejected
- applicant is a direct borrower, not a partner
- spam/fake submission
- missing email and no viable identity
- no consent or suspicious lead-selling behavior

## Dedupe rules

### Contact dedupe

Primary key:

```text
email
```

Secondary keys:

```text
partner_id
phone
name + company
```

Rules:

- If email exists, update existing contact.
- If Partner ID exists on another contact, flag duplicate and do not overwrite without review.
- If phone/name match but email differs, create review task.
- If record appears to be a role account such as info@ or admin@, associate carefully and require manual review for Tier 1.

### Company dedupe

Primary key:

```text
company domain
```

Secondary keys:

```text
company name
website
```

Rules:

- Normalize domains by removing protocol, `www`, and trailing slash.
- Do not create a new company if domain already exists.
- If company name matches but domain differs, flag for review.
- If no domain exists, create company only when partner quality is medium/high enough.

### Deal dedupe

Primary key:

```text
partner_id
```

Secondary keys:

```text
contact email + pipeline
company domain + pipeline
```

Rules:

- One active Partner Pipeline deal per Partner ID.
- Do not create multiple onboarding deals for the same partner unless there is a future partner program reason.
- If previous deal is archived/rejected and new intake arrives, create review task before reopening.

## Partner type notes

### Funding brokers and ISOs

Create:

- Contact: yes
- Company: yes, if brokerage/brand exists
- Deal: yes, usually Needs Review or Approved depending on risk

Important fields:

- funding_experience
- referral_volume_estimate
- current_tools
- risk_flags
- onboarding_path

### Referral partners and COIs

Create:

- Contact: yes
- Company: optional, based on firm/org
- Deal: yes, if they serve a relevant audience

Examples:

- CPA/bookkeeper
- business attorney
- business broker
- veteran/community connector
- consultant
- local SMB connector

### Strategic partners

Create:

- Contact: yes
- Company: yes
- Deal: yes, always Needs Review first

Do not auto-approve strategic partners. They may be gold mines or landmines with a nicer logo.

### Affiliate/content creators

Create:

- Contact: yes
- Company: optional as brand/media property
- Deal: yes, if credible reach or audience fit exists

Track:

- audience
- traffic_or_network_size
- desired_partner_role
- recommended_campaign
- tracking link readiness

### High-risk lead sellers

Create:

- Contact: only if needed for audit/review
- Company: usually no unless already established
- Deal: Needs Review or Rejected

Flag if:

- selling aged leads
- claims exclusive approvals
- no consent path
- deceptive urgency
- fabricated guarantees
- wants payout before quality verification

## Mapping matrix

| Internal field | Contact | Company | Deal | Notes |
|---|---|---|---|---|
| `partner_id` | Yes | Optional | Yes | Cross-system key. |
| `display_name` | Yes | No | Deal name source | Contact name. |
| `company` | Association | Yes | Deal name source | Create company if valid. |
| `email` | Yes | No | Association | Primary contact key. |
| `website` | Optional | Yes | Optional | Domain key. |
| `partner_type` | Yes | Optional | Yes | Keep synced. |
| `partner_tier` | Yes | No | Yes | Priority. |
| `onboarding_path` | Yes | No | Yes | Drives tasks. |
| `primary_audience` | Yes | Yes | Yes | Campaign targeting. |
| `risk_level` | Yes | Optional | Yes | Review routing. |
| `status` | Yes | Optional | Yes | Align with pipeline. |
| `score` | Yes | No | Yes | Numeric priority. |
| `manual_review_required` | Yes | No | Yes | Task trigger. |
| `risk_flags` | Yes | No | Yes | Keep concise. |
| `recommended_resources` | Yes | No | Yes | Activation docs. |
| `recommended_campaign` | Yes | No | Yes | Campaign kit. |
| `next_action` | Yes | No | Yes | Follow-up. |
| `last_synced_at` | Yes | Yes | Yes | Sync monitoring. |

## Failure handling

If contact creation succeeds but company/deal creation fails:

1. Log failure in sync result.
2. Create or update contact with `partner_status = needs_review`.
3. Do not retry infinitely.
4. Add admin task if possible.
5. Store error externally if available.

If dedupe confidence is low:

1. Do not overwrite important fields.
2. Create a manual review task.
3. Add note with possible matches.
4. Preserve incoming record in staging storage.

## Minimal viable sync

For MVP, sync in this order:

1. Upsert Contact by email.
2. Upsert Company by domain when available.
3. Associate Contact to Company.
4. Upsert Deal by Partner ID.
5. Associate Deal to Contact and Company.
6. Create task if needed.
7. Add Partner Intake OS review note.
