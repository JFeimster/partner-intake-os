# Known Limitations

This file prevents internal launch from drifting into fantasy land. Partner Intake OS is useful now, but it is not yet a finished enterprise product.

## Static/demo areas

- Some dashboard/admin surfaces may still use static sample data.
- Some review queue records may be fixture-based.
- Some routes may return deterministic demo responses.
- Some docs describe future behavior rather than current production behavior.

## Mocked areas

- Persistent database writes may be mocked or dry-run.
- Notion/HubSpot sync may be sandbox-only.
- Tracking link persistence may be stubbed.
- Lead lookup may return safe stub records until real storage exists.
- Activity logs may be local/stubbed until audit logging exists.

## Manual review required

Manual review remains required for:

- Partner approval.
- High-risk lead sellers.
- Low-info signups.
- Compliance-risk copy.
- Campaign kit publication.
- Lead submission routing.
- Any status that could imply lender/provider outcome.
- Any partner payout/commission interpretation.

## Not production-ready yet

The following need hardening before broad production release:

- Full identity provider.
- Role-based access control.
- Durable database.
- Persistent audit log.
- Rate limiting.
- Bot/spam protection.
- Idempotent webhook storage.
- Monitoring/alerting.
- Formal backup/restore plan.
- Production Notion/HubSpot mapping approval.
- Partner portal account lifecycle.

## Auth hardening needed

Phase 26 adds lightweight token/cookie admin auth for MVP internal testing. Production should move to:

- Real identity provider.
- MFA.
- Per-user access.
- Role-based permissions.
- Session expiration policy.
- Login audit logs.
- Admin action audit logs.

## Real storage needed

Before production, choose and implement the durable system of record:

- Supabase/Postgres.
- Notion staging + HubSpot CRM.
- HubSpot as CRM with database mirror.
- Google Sheets only as temporary/logging fallback, not ideal as a real system of record.

GitHub must remain source control, not a live partner database.

## CRM production sync needed

Before HubSpot production sync:

- Confirm property names.
- Confirm pipeline/stage mapping.
- Confirm duplicate/contact matching rules.
- Confirm association strategy.
- Confirm sensitive-data boundaries.
- Confirm rollback/delete strategy for mistaken records.

## Analytics needed

Current tracking API is attribution plumbing, not analytics infrastructure. Future analytics should include:

- Click count.
- Lead-start count.
- Lead-submit count.
- Partner/campaign conversion views.
- Source/channel reporting.
- Privacy-safe event aggregation.
- Bot filtering.
- Commission-safe reporting language.

## No automated approval

No part of internal launch should automatically approve:

- Partners.
- Leads.
- Funding eligibility.
- Lender submission.
- Commissions.
- Payouts.

If the system starts sounding too confident, yank it back into review mode. Confidence is cheap; auditability is expensive. ⚙️
