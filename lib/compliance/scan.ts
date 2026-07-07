/**
 * Compliance scanner
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import { BASE_DISCLOSURE, RESTRICTED_PHRASES, Severity, severityRank } from "./rules";

export interface ComplianceFinding {
  phrase: string;
  severity: Severity;
  safe_rewrite: string;
  index: number;
}

export interface ComplianceScanResult {
  ok_for_use: boolean;
  highest_severity: Severity | "none";
  findings: ComplianceFinding[];
  disclosure_present: boolean;
  manual_review_required: boolean;
  recommended_notice: string;
}

export function scanCompliance(text: string): ComplianceScanResult {
  const lower = text.toLowerCase();
  const findings = RESTRICTED_PHRASES.flatMap((rule) => {
    const index = lower.indexOf(rule.phrase);
    return index >= 0 ? [{ ...rule, index }] : [];
  });

  const highest = findings.reduce<Severity | "none">((max, finding) => {
    if (max === "none") return finding.severity;
    return severityRank(finding.severity) > severityRank(max) ? finding.severity : max;
  }, "none");

  const disclosure_present = lower.includes("no approval") && lower.includes("not guaranteed");

  return {
    ok_for_use: findings.length === 0 && disclosure_present,
    highest_severity: highest,
    findings,
    disclosure_present,
    manual_review_required: findings.some((f) => f.severity === "high" || f.severity === "blocked") || !disclosure_present,
    recommended_notice: BASE_DISCLOSURE
  };
}
