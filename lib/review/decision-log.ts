import crypto from "crypto";
import { ReviewDecisionInput, ReviewDecisionLog } from "./review-types";

export function createDecisionId(input: ReviewDecisionInput): string {
  const base = [
    input.review_item_id,
    input.entity_type,
    input.entity_id,
    input.action,
    input.new_status ?? "",
    Date.now().toString(),
  ].join(":");

  return `dec_${crypto.createHash("sha256").update(base).digest("hex").slice(0, 24)}`;
}

export function sanitizeOperatorNote(note?: string): string | null {
  if (!note) return null;

  return note
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[redacted-ssn]")
    .replace(/\b\d{9}\b/g, "[redacted-id]")
    .replace(/bank statement/gi, "sensitive document")
    .slice(0, 2000);
}

export function buildDecisionLog(input: ReviewDecisionInput): ReviewDecisionLog {
  return {
    ...input,
    operator_note: sanitizeOperatorNote(input.operator_note) ?? undefined,
    decision_id: createDecisionId(input),
    created_at: new Date().toISOString(),
  };
}

export async function appendDecisionLog(input: ReviewDecisionInput): Promise<ReviewDecisionLog> {
  // Batch 32 server-side stub. Wire to Batch 31 database/audit helpers in implementation.
  const decision = buildDecisionLog(input);

  // Expected future write:
  // await query("INSERT INTO partner_events (...) VALUES (...)");
  // await writeAuditLog({ action: "review_decision_created", ...safeMetadata });

  return decision;
}
