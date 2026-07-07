-- Demo lead records for local development only.
-- Fictional records. Do not place real borrower/lead PII in seed files.

INSERT INTO leads (
  partner_id,
  external_lead_ref,
  source,
  status,
  business_name,
  contact_name,
  contact_email,
  contact_phone,
  requested_product,
  funding_need_range,
  consent_confirmed,
  sensitive_data_flag,
  review_summary,
  routing,
  metadata,
  submitted_at
)
SELECT
  p.partner_id,
  'demo-lead-001',
  'seed',
  'received_for_review',
  'Example Contractor Group',
  'Morgan Demo',
  'morgan.contractor@example.test',
  '+1-555-0201',
  'line_of_credit',
  '50000_100000',
  TRUE,
  FALSE,
  'Demo lead received for review. Funding options may vary. No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.',
  '{"queue":"ops_review","priority":"normal"}'::JSONB,
  '{"demo":true,"source_detail":"Batch 31 seed file."}'::JSONB,
  now()
FROM partners p
WHERE p.external_partner_ref = 'demo-partner-broker-001'
ON CONFLICT (external_lead_ref) DO NOTHING;

INSERT INTO leads (
  partner_id,
  external_lead_ref,
  source,
  status,
  business_name,
  contact_name,
  contact_email,
  contact_phone,
  requested_product,
  funding_need_range,
  consent_confirmed,
  sensitive_data_flag,
  review_summary,
  routing,
  metadata,
  submitted_at
)
SELECT
  p.partner_id,
  'demo-lead-002',
  'seed',
  'needs_review',
  'Example Ecommerce Studio',
  'Taylor Demo',
  'taylor.ecommerce@example.test',
  '+1-555-0202',
  'working_capital',
  '100000_250000',
  TRUE,
  TRUE,
  'Demo lead has sensitive-data flag and needs manual review before routing.',
  '{"queue":"manual_review","priority":"high"}'::JSONB,
  '{"demo":true,"source_detail":"Batch 31 seed file."}'::JSONB,
  now()
FROM partners p
WHERE p.external_partner_ref = 'demo-partner-cpa-001'
ON CONFLICT (external_lead_ref) DO NOTHING;

INSERT INTO partner_events (
  partner_id,
  lead_id,
  event_type,
  event_source,
  summary,
  actor_type,
  actor_id,
  metadata
)
SELECT
  l.partner_id,
  l.lead_id,
  'lead.received_for_review',
  'seed',
  'Demo lead received for review.',
  'system',
  'batch-31-seed',
  '{"demo":true}'::JSONB
FROM leads l
WHERE l.external_lead_ref IN ('demo-lead-001', 'demo-lead-002');
