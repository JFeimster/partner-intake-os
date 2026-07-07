export interface AbuseScoreResult {
  score: number;
  level: "low" | "medium" | "high" | "severe";
  signals: string[];
  recommended_action: "process" | "mark_for_review" | "queue_manual_review" | "block_or_quarantine";
}

export function calculateAbuseScore(input: Record<string, unknown>): AbuseScoreResult {
  const text = JSON.stringify(input).toLowerCase();
  let score = 0;
  const signals: string[] = [];

  const add = (points: number, signal: string) => {
    score += points;
    signals.push(signal);
  };

  if (input.website_url || input.company_website_extra || input.fax_number) add(50, "honeypot_filled");
  if (text.includes("missing consent") || input.consent === false) add(30, "missing_consent");
  if (input.duplicate_payload_hash || input.duplicate === true) add(25, "duplicate_payload_hash");
  if (text.includes("guaranteed approval") || text.includes("everyone qualifies")) add(25, "prohibited_funding_language");
  if (text.includes("instant funding") || text.includes("no documents needed")) add(25, "prohibited_funding_language");
  if (text.includes("bulk leads") || text.includes("aged leads")) add(20, "bulk_lead_language");
  if (text.includes("@tempmail") || text.includes("@mailinator")) add(15, "disposable_email_pattern");
  if (Object.keys(input).length < 4) add(10, "low_info_submission");

  const level = score >= 80 ? "severe" : score >= 50 ? "high" : score >= 20 ? "medium" : "low";
  const recommended_action =
    level === "severe" ? "block_or_quarantine" :
    level === "high" ? "queue_manual_review" :
    level === "medium" ? "mark_for_review" : "process";

  return { score, level, signals: [...new Set(signals)], recommended_action };
}
