/**
 * Compliance restricted-language rules
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export type Severity = "low" | "medium" | "high" | "blocked";

export interface RestrictedPhraseRule {
  phrase: string;
  severity: Severity;
  safe_rewrite: string;
}

export const RESTRICTED_PHRASES: RestrictedPhraseRule[] = [
  { phrase: "guaranteed approval", severity: "blocked", safe_rewrite: "available options may be reviewed" },
  { phrase: "everyone qualifies", severity: "blocked", safe_rewrite: "eligibility and options vary by business profile" },
  { phrase: "instant funding", severity: "high", safe_rewrite: "fast review may be available depending on the situation" },
  { phrase: "risk-free", severity: "high", safe_rewrite: "review the terms and tradeoffs before choosing an option" },
  { phrase: "no documents needed", severity: "high", safe_rewrite: "documentation requirements vary by product and provider" },
  { phrase: "guaranteed commission", severity: "blocked", safe_rewrite: "commission eligibility depends on program terms and completed review requirements" },
  { phrase: "earn guaranteed income", severity: "blocked", safe_rewrite: "partner opportunities depend on approved activity and program rules" }
];

export const BASE_DISCLOSURE = "No approval, funding, rates, terms, timelines, lender review, commissions, income, or specific business outcome is guaranteed.";

export function severityRank(severity: Severity): number {
  return { low: 1, medium: 2, high: 3, blocked: 4 }[severity];
}
