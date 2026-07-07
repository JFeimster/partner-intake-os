-- Migration 001 — Initial Partner Intake Data Store
-- Postgres-compatible schema for Partner Intake OS.
-- Vendor neutral: designed for Supabase, Neon, or standard Postgres.
-- Review before running. Do not execute directly against production without a migration plan.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS partners (
  partner_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_partner_ref TEXT UNIQUE,
  display_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,
  partner_type TEXT NOT NULL DEFAULT 'unclassified',
  partner_tier TEXT NOT NULL DEFAULT 'unassigned',
  onboarding_path TEXT NOT NULL DEFAULT 'manual_review',
  primary_audience TEXT,
  secondary_audiences TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  risk_level TEXT NOT NULL DEFAULT 'unknown',
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT NOT NULL DEFAULT 'manual',
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  scorecard JSONB NOT NULL DEFAULT '{}'::JSONB,
  recommended_resources JSONB NOT NULL DEFAULT '[]'::JSONB,
  recommended_campaigns JSONB NOT NULL DEFAULT '[]'::JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT partners_status_check CHECK (status IN (
    'new',
    'needs_review',
    'needs_info',
    'approved_for_onboarding',
    'rejected',
    'paused',
    'archived'
  )),
  CONSTRAINT partners_risk_level_check CHECK (risk_level IN (
    'unknown',
    'low',
    'medium',
    'high',
    'blocked'
  ))
);

CREATE TABLE IF NOT EXISTS leads (
  lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(partner_id) ON DELETE SET NULL,
  external_lead_ref TEXT UNIQUE,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'received_for_review',
  business_name TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  requested_product TEXT,
  funding_need_range TEXT,
  consent_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  sensitive_data_flag BOOLEAN NOT NULL DEFAULT FALSE,
  duplicate_of_lead_id UUID REFERENCES leads(lead_id) ON DELETE SET NULL,
  review_summary TEXT,
  routing JSONB NOT NULL DEFAULT '{}'::JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT leads_status_check CHECK (status IN (
    'received_for_review',
    'needs_review',
    'needs_info',
    'routed_to_ops',
    'rejected',
    'paused',
    'archived'
  ))
);

CREATE TABLE IF NOT EXISTS partner_events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID REFERENCES partners(partner_id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(lead_id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_source TEXT NOT NULL DEFAULT 'system',
  summary TEXT NOT NULL,
  actor_type TEXT NOT NULL DEFAULT 'system',
  actor_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_links (
  tracking_link_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID NOT NULL REFERENCES partners(partner_id) ON DELETE CASCADE,
  campaign_id TEXT,
  campaign_name TEXT,
  destination_url TEXT NOT NULL,
  tracking_slug TEXT NOT NULL UNIQUE,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tracking_links_status_check CHECK (status IN (
    'active',
    'paused',
    'archived'
  ))
);

CREATE TABLE IF NOT EXISTS tracking_events (
  tracking_event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_link_id UUID REFERENCES tracking_links(tracking_link_id) ON DELETE SET NULL,
  partner_id UUID REFERENCES partners(partner_id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(lead_id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_id TEXT,
  payload_hash TEXT,
  safe_context JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT tracking_events_type_check CHECK (event_type IN (
    'link_created',
    'click',
    'lead_started',
    'lead_submitted',
    'manual_review',
    'partner_resource_opened',
    'campaign_kit_viewed'
  ))
);

CREATE TABLE IF NOT EXISTS admin_review_items (
  review_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  priority TEXT NOT NULL DEFAULT 'normal',
  assigned_to TEXT,
  reason_codes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  risk_flags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  operator_notes TEXT,
  decision TEXT,
  decision_summary TEXT,
  decided_by TEXT,
  decided_at TIMESTAMPTZ,
  due_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT admin_review_entity_type_check CHECK (entity_type IN (
    'partner',
    'lead',
    'tracking_event',
    'sync_job',
    'campaign',
    'resource'
  )),
  CONSTRAINT admin_review_status_check CHECK (status IN (
    'new',
    'needs_review',
    'needs_info',
    'approved_for_onboarding',
    'rejected',
    'paused',
    'archived'
  )),
  CONSTRAINT admin_review_priority_check CHECK (priority IN (
    'low',
    'normal',
    'high',
    'urgent'
  ))
);

CREATE TABLE IF NOT EXISTS sync_jobs (
  sync_job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  target_system TEXT NOT NULL,
  operation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  last_error TEXT,
  next_attempt_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  payload_hash TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT sync_jobs_target_system_check CHECK (target_system IN (
    'notion',
    'hubspot',
    'google_sheets',
    'json_registry',
    'webhook',
    'internal'
  )),
  CONSTRAINT sync_jobs_status_check CHECK (status IN (
    'queued',
    'running',
    'succeeded',
    'failed',
    'retry_scheduled',
    'dead_letter',
    'cancelled'
  ))
);

CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_partner_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_email ON partners(email);
CREATE INDEX IF NOT EXISTS idx_leads_partner_id ON leads(partner_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_partner_events_partner_id ON partner_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_tracking_links_partner_id ON tracking_links(partner_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_partner_id ON tracking_events(partner_id);
CREATE INDEX IF NOT EXISTS idx_admin_review_items_status ON admin_review_items(status);
CREATE INDEX IF NOT EXISTS idx_sync_jobs_status ON sync_jobs(status);

DROP TRIGGER IF EXISTS partners_set_updated_at ON partners;
CREATE TRIGGER partners_set_updated_at
BEFORE UPDATE ON partners
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS leads_set_updated_at ON leads;
CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS tracking_links_set_updated_at ON tracking_links;
CREATE TRIGGER tracking_links_set_updated_at
BEFORE UPDATE ON tracking_links
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS admin_review_items_set_updated_at ON admin_review_items;
CREATE TRIGGER admin_review_items_set_updated_at
BEFORE UPDATE ON admin_review_items
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS sync_jobs_set_updated_at ON sync_jobs;
CREATE TRIGGER sync_jobs_set_updated_at
BEFORE UPDATE ON sync_jobs
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
