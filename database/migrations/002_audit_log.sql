-- Migration 002 — Immutable Audit Log
-- Postgres-compatible. Review before running against production.

BEGIN;

CREATE TABLE IF NOT EXISTS audit_log (
  audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  actor_type TEXT NOT NULL DEFAULT 'system',
  actor_id TEXT,
  source TEXT NOT NULL DEFAULT 'system',
  request_id TEXT,
  payload_hash TEXT,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT audit_log_entity_type_check CHECK (entity_type IN (
    'partner',
    'lead',
    'partner_event',
    'tracking_link',
    'tracking_event',
    'admin_review_item',
    'sync_job',
    'system'
  )),
  CONSTRAINT audit_log_actor_type_check CHECK (actor_type IN (
    'system',
    'admin',
    'reviewer',
    'partner',
    'integration_service',
    'gpt_action'
  ))
);

CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_request_id ON audit_log(request_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);

CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is immutable: update/delete operations are not allowed';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS audit_log_no_update ON audit_log;
CREATE TRIGGER audit_log_no_update
BEFORE UPDATE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

DROP TRIGGER IF EXISTS audit_log_no_delete ON audit_log;
CREATE TRIGGER audit_log_no_delete
BEFORE DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

CREATE OR REPLACE FUNCTION write_audit_log(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_action TEXT,
  p_actor_type TEXT DEFAULT 'system',
  p_actor_id TEXT DEFAULT NULL,
  p_source TEXT DEFAULT 'system',
  p_request_id TEXT DEFAULT NULL,
  p_payload_hash TEXT DEFAULT NULL,
  p_before_state JSONB DEFAULT NULL,
  p_after_state JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO audit_log (
    entity_type,
    entity_id,
    action,
    actor_type,
    actor_id,
    source,
    request_id,
    payload_hash,
    before_state,
    after_state,
    metadata
  )
  VALUES (
    p_entity_type,
    p_entity_id,
    p_action,
    p_actor_type,
    p_actor_id,
    p_source,
    p_request_id,
    p_payload_hash,
    p_before_state,
    p_after_state,
    COALESCE(p_metadata, '{}'::JSONB)
  )
  RETURNING audit_id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;
