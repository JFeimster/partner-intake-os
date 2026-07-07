-- Demo partner records for local development only.
-- These records are fictional. Do not use real partner PII in seed files.

INSERT INTO partners (
  external_partner_ref,
  display_name,
  first_name,
  last_name,
  email,
  phone,
  company,
  website,
  partner_type,
  partner_tier,
  onboarding_path,
  primary_audience,
  secondary_audiences,
  risk_level,
  status,
  source,
  tags,
  scorecard,
  recommended_resources,
  recommended_campaigns,
  metadata
) VALUES
(
  'demo-partner-broker-001',
  'Avery Stone',
  'Avery',
  'Stone',
  'avery.broker@example.test',
  '+1-555-0101',
  'Stonebridge Funding Advisors',
  'https://example.test/stonebridge',
  'funding_broker',
  'tier_2',
  'fast_track_revenue_partner',
  'general_smb',
  ARRAY['contractors', 'ecommerce'],
  'low',
  'approved_for_onboarding',
  'seed',
  ARRAY['demo', 'broker', 'fast_track'],
  '{"overall_score":82,"manual_review_required":false,"reasoning_summary":"Existing referral flow and relevant SMB audience."}'::JSONB,
  '[{"resource_id":"funding-product-matrix","priority":"high"},{"resource_id":"broker-follow-up-machine","priority":"high"}]'::JSONB,
  '[{"campaign_id":"broker-lead-submission-kit","priority":"high"}]'::JSONB,
  '{"demo":true,"notes":"Fictional demo partner."}'::JSONB
),
(
  'demo-partner-cpa-001',
  'Jordan Lee',
  'Jordan',
  'Lee',
  'jordan.cpa@example.test',
  '+1-555-0102',
  'Lee Cash Flow Advisory',
  'https://example.test/lee-advisory',
  'cpa_bookkeeper',
  'tier_3',
  'education_first_partner',
  'professional_services',
  ARRAY['ecommerce', 'local_services'],
  'medium',
  'needs_review',
  'seed',
  ARRAY['demo', 'cpa', 'education_first'],
  '{"overall_score":68,"manual_review_required":true,"reasoning_summary":"Strong client trust but needs compliant referral workflow."}'::JSONB,
  '[{"resource_id":"client-funding-readiness-scorecard","priority":"high"}]'::JSONB,
  '[{"campaign_id":"client-readiness-education-kit","priority":"medium"}]'::JSONB,
  '{"demo":true,"notes":"Fictional demo partner."}'::JSONB
)
ON CONFLICT (external_partner_ref) DO NOTHING;

INSERT INTO partner_events (
  partner_id,
  event_type,
  event_source,
  summary,
  actor_type,
  actor_id,
  metadata
)
SELECT
  partner_id,
  'seed.created',
  'seed',
  'Demo partner record created for local review.',
  'system',
  'batch-31-seed',
  '{"demo":true}'::JSONB
FROM partners
WHERE external_partner_ref IN ('demo-partner-broker-001', 'demo-partner-cpa-001');
