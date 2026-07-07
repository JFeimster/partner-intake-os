export interface LeadStatusHistoryEntry {
  lead_id: string;
  previous_status?: string;
  new_status: string;
  reason_code?: string;
  operator_note?: string;
  changed_by: string;
  changed_at: string;
}

export function sanitizeLeadOperatorNote(note?: string): string | null {
  if (!note) return null;
  return note
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, "[redacted-ssn]")
    .replace(/password/gi, "[redacted-credential]")
    .slice(0, 1500);
}

export function createLeadStatusHistoryEntry(input: Omit<LeadStatusHistoryEntry, "changed_at">): LeadStatusHistoryEntry {
  return {
    ...input,
    operator_note: sanitizeLeadOperatorNote(input.operator_note) ?? undefined,
    changed_at: new Date().toISOString(),
  };
}
