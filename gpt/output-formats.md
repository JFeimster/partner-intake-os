# Partner Intake OS — Reusable Output Formats

> Canonical filename. Legacy alias: `gpt/partner-intake-os.output-formats.md`.

Use the format that matches the user’s request. If the user asks for JSON only, return valid JSON only with no Markdown fence or commentary.

## Partner Intake Summary

```md
## Partner Intake Summary

**Recommended decision:** [fast_track / approve_standard / referral_only / education_first / watchlist / manual_review / reject]

**Partner:** [Name / Company]
**Claimed role:** [What they said]
**Recommended partner type:** [partner_type]
**Secondary types:** [optional]
**Partner tier:** [tier]
**Onboarding path:** [path]
**Risk level:** [low / medium / high]
**Confidence:** [high / medium / low]

### Why this classification
[2-5 bullet explanation]

### What looks promising
- [Signal]
- [Signal]

### What is missing
- [Missing field]
- [Missing field]

### Risk flags
- [None / flag]

### Next action
[One clear next action]
```

## Partner Scorecard

```md
## Partner Scorecard

| Category | Score | Notes |
|---|---:|---|
| Audience access | [1-5] | [Reason] |
| Funding relevance | [1-5] | [Reason] |
| Existing trust | [1-5] | [Reason] |
| Existing deal flow | [1-5] | [Reason] |
| Activation speed | [1-5] | [Reason] |
| Compliance risk | [1-5] | [1 = low risk, 5 = high risk] |
| Strategic leverage | [1-5] | [Reason] |
| Revenue potential | [1-5] | [Reason] |
| Technical ability | [1-5] | [Reason] |
| Relationship quality | [1-5] | [Reason] |

**Overall score:** [0-100]
**Tier recommendation:** [tier]
**Manual review required:** [yes/no]
**Reasoning summary:** [Short explanation]
```

## CRM Note

```md
## CRM Note

[Partner/company] appears to be a [partner_type] with [low/medium/high] immediate activation potential. Their main audience is [primary_audience]. Recommended tier is [partner_tier] with onboarding path [onboarding_path].

Key reasons: [1-3 short reasons].

Risk/missing info: [risk flags or missing data].

Recommended next action: [next_action].

Suggested tags: [tag_1], [tag_2], [tag_3]
```

## JSON Partner Record

```json
{
  "partner_id": "partner_temp_001",
  "display_name": "",
  "first_name": "",
  "last_name": "",
  "company": "",
  "email": "",
  "phone": "",
  "website": "",
  "partner_type": "referral_partner",
  "secondary_partner_types": [],
  "partner_tier": "tier_2_active",
  "onboarding_path": "standard_affiliate_partner",
  "primary_audience": "general_smb",
  "secondary_audiences": [],
  "industry_focus": [],
  "location": "",
  "risk_level": "low",
  "manual_review_required": false,
  "status": "new_reviewed",
  "lead_source": "tally_partner_signup",
  "recommended_resources": [],
  "recommended_campaigns": [],
  "next_action": "send_welcome_and_resource_pack",
  "tags": [],
  "notes": "",
  "confidence": "medium",
  "created_at": "",
  "updated_at": ""
}
```

When returning JSON only, remove placeholder fields that are not available unless the target schema requires them.

## Partner Onboarding Plan

```md
## Partner Onboarding Plan

**Partner:** [Name / Company]
**Onboarding path:** [path]
**Owner:** [Jason / partner ops / TBD]
**Primary next action:** [next_action]

### First 24 hours
- [Action]
- [Action]
- [Action]

### First 7 days
- [Action]
- [Action]
- [Action]

### First 30 days
- [Action]
- [Action]
- [Action]

### Required assets
- [Resource]
- [Script]
- [Tracking/source item placeholder]

### Recommended training
- [Training item]
- [Compliance-safe positioning]

### Human review checkpoints
- [Checkpoint]
- [Checkpoint]
```

## Resource Recommendation

```md
## Resource Recommendation

**Recommended resource:** [Resource name]
**Recommended for:** [partner_type / audience]
**Priority:** [high / medium / low]
**CTA:** [CTA]

### Why this resource fits
[Short reason]

### How to use it
- [Step 1]
- [Step 2]
- [Step 3]

### Safe positioning note
[Compliance-safe language to use]
```

## Campaign Recommendation

```md
## Campaign Recommendation

**Campaign name:** [Name]
**Campaign type:** [referral / affiliate / education / broker activation / strategic]
**Audience:** [Audience]
**Offer:** [Offer]
**CTA:** [CTA]
**Suggested channels:** [email, LinkedIn, SMS, webinar, community, YouTube, referral call, etc.]

### Copy angle
[Readiness-based angle]

### First campaign steps
1. [Step]
2. [Step]
3. [Step]

### Tracking notes
[UTM/source code/tracking placeholder]

### Compliance notes
[Claims to avoid and safe framing]
```

## Welcome Email Draft

Use only when asked to draft partner-facing copy.

```md
Hi [First Name],

Thanks for applying to partner with Moonshine Capital.

Based on what you shared, the best starting path looks like [onboarding_path]. The goal is to help you route business-owner funding conversations cleanly, use approved resources, and avoid messy claims that create problems later.

Here are the best next steps:

1. [Step]
2. [Step]
3. [Step]

A quick note: nothing here guarantees funding, approvals, specific terms, or timelines. The process is about helping business owners understand available paths, organize information, and submit clean inquiries when appropriate.

Best,
[Sender]
```

## Admin Review Card

```md
## Admin Review Card

**Partner:** [Name / Company]
**Recommended decision:** [approve / fast_track / nurture / request_info / manual_review / reject]
**Score:** [0-100]
**Tier:** [tier]
**Risk level:** [low / medium / high]
**Manual review required:** [yes/no]

### Summary
[One-paragraph internal summary]

### Risk flags
- [Flag or none]

### Missing information
- [Missing field]

### Recommended next action
[Action]

### Reviewer notes
[Blank or suggested notes]
```

## Dashboard Card

```md
## Dashboard Card

**Display name:** [Name]
**Company:** [Company]
**Partner type:** [partner_type]
**Tier:** [partner_tier]
**Status:** [status]
**Onboarding path:** [onboarding_path]
**Risk:** [risk_level]
**Next action:** [next_action]

### Snapshot
[Compact 2-3 sentence summary]

### Recommended resource
[Resource]

### Recommended campaign
[Campaign]

### Admin flag
[manual_review_required / none]
```

Dashboard JSON version:

```json
{
  "partner_id": "partner_temp_001",
  "display_name": "",
  "company": "",
  "partner_type": "",
  "partner_tier": "",
  "onboarding_path": "",
  "status": "",
  "next_action": "",
  "risk_level": "",
  "manual_review_required": false,
  "score": 0,
  "summary": "",
  "recommended_resource": "",
  "recommended_campaign": "",
  "risk_flags": []
}
```
