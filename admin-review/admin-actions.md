# Admin Actions

## Action matrix

| Action | Description | Inputs | Output/status change | Systems touched | Human review required | Future API endpoint |
|---|---|---|---|---|---|---|
| approve partner | Activate a partner for onboarding. | review_id, partner_id, reviewer, notes | review_status=approved, partner_status=approved | Dashboard, Notion, HubSpot | Yes for Tier 1/high-risk; optional for low-risk Tier 2 | POST /api/admin/review/:review_id/decision |
| reject partner | Mark as not fit or too risky. | review_id, reason, notes | review_status=rejected | Dashboard, Notion, HubSpot | Yes | POST /api/admin/review/:review_id/decision |
| mark watchlist | Hold for nurture or later review. | review_id, reason, follow_up_date | review_status=watchlist | Dashboard, Notion, HubSpot | Yes | POST /api/admin/review/:review_id/decision |
| request more info | Ask partner for missing details. | review_id, missing_fields, message_type | review_status=missing_info | Dashboard, HubSpot task/email later | No, unless risk flags exist | POST /api/admin/review/:review_id/decision |
| assign tier | Override or confirm tier. | review_id, partner_tier, reasoning | partner_tier updated | Dashboard, Notion, HubSpot | Yes | POST /api/admin/review/:review_id/decision |
| assign onboarding path | Assign onboarding flow. | review_id, onboarding_path | onboarding_path updated | Dashboard, Notion, HubSpot | No | POST /api/admin/review/:review_id/decision |
| assign resource pack | Attach recommended resources. | review_id, resource_pack_id | recommended_resources updated | Dashboard, Notion, HubSpot | No | POST /api/admin/review/:review_id/decision |
| assign campaign kit | Attach campaign kit. | review_id, campaign_id | recommended_campaign updated | Dashboard, Notion, HubSpot | No | POST /api/admin/review/:review_id/decision |
| create follow-up task | Create admin/partner ops task. | review_id, owner, due_date, task_type | task created | HubSpot/Notion later | No | POST /api/admin/review/:review_id/sync |
| log note | Append reviewer note. | review_id, note, author | reviewer_notes/activity log updated | Dashboard, Notion, HubSpot | No | POST /api/admin/review/:review_id/note |
| sync to CRM | Push reviewed record to CRM. | review_id, systems, sync_mode | sync_status updated | HubSpot/Notion/Sheets | Yes when real PII is involved | POST /api/admin/review/:review_id/sync |
| archive record | Remove from active queue. | review_id, archive_reason | review_status=archived | Dashboard, Notion, HubSpot | No, unless rejection risk exists | POST /api/admin/review/:review_id/decision |

## Demo behavior

In the static MVP, these actions are visual/demo controls only. They update local browser state and do not write to a backend.

## Guardrails

Admin actions must not imply:

- guaranteed funding
- guaranteed approvals
- lender certainty
- credit repair outcomes
- automatic partner acceptance
- fake testimonials or fake urgency

Approval means internal partner workflow approval only. It does not mean financing approval for any referred business.
