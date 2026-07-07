/**
 * Safe rewrite helper
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import { scanCompliance } from "./scan";

export function safeRewrite(text: string): { rewritten_text: string; changes: Array<{ from: string; to: string }>; disclosure_added: boolean } {
  const scan = scanCompliance(text);
  let rewritten = text;
  const changes: Array<{ from: string; to: string }> = [];

  for (const finding of scan.findings) {
    const re = new RegExp(finding.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    rewritten = rewritten.replace(re, finding.safe_rewrite);
    changes.push({ from: finding.phrase, to: finding.safe_rewrite });
  }

  let disclosure_added = false;
  if (!scan.disclosure_present) {
    rewritten = `${rewritten.trim()}\n\nDisclosure: ${scan.recommended_notice}`;
    disclosure_added = true;
  }

  return { rewritten_text: rewritten, changes, disclosure_added };
}
