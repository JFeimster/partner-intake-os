import type { PartnerIntake } from "../normalizers/normalize-tally-submission";

const highRiskTerms = [
  "guaranteed approval",
  "guarantee approval",
  "no denial",
  "everyone qualifies",
  "credit repair",
  "fake docs",
  "synthetic identity",
  "aged tradeline",
  "lead scrape",
  "scraped leads",
  "mass text",
  "spam",
  "bypass underwriting"
];

const cautionTerms = [
  "mca stacking",
  "high volume cold sms",
  "purchased leads",
  "no consent",
  "instant funding",
  "bad credit guaranteed",
  "same day approval"
];

function haystack(intake: PartnerIntake): string {
  return [
    intake.partner_type_claimed,
    intake.audience,
    intake.industry,
    intake.funding_experience,
    intake.current_tools?.join(" "),
    intake.traffic_or_network_size,
    intake.referral_volume_estimate,
    intake.desired_partner_role,
    intake.notes
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function collectRiskFlags(intake: PartnerIntake): string[] {
  const text = haystack(intake);
  const flags: string[] = [];

  for (const term of highRiskTerms) {
    if (text.includes(term)) {
      flags.push(`high_risk_language:${term.replace(/\s+/g, "_")}`);
    }
  }

  for (const term of cautionTerms) {
    if (text.includes(term)) {
      flags.push(`caution_language:${term.replace(/\s+/g, "_")}`);
    }
  }

  if (!intake.email) {
    flags.push("missing_email");
  }

  if (!intake.audience && !intake.industry) {
    flags.push("missing_audience_or_industry");
  }

  if (intake.partner_type_claimed === "unknown" || intake.partner_type_claimed === "other") {
    flags.push("unclear_partner_type");
  }

  return flags;
}

export function estimateComplianceRiskScore(intake: PartnerIntake): number {
  const flags = collectRiskFlags(intake);
  let score = 1;

  if (flags.some((flag) => flag.startsWith("caution_language"))) {
    score += 2;
  }

  if (flags.some((flag) => flag.startsWith("high_risk_language"))) {
    score += 4;
  }

  if (flags.includes("missing_email")) {
    score += 2;
  }

  if (flags.includes("unclear_partner_type")) {
    score += 1;
  }

  return Math.min(5, score);
}

export function determineRiskLevel(complianceRiskScore: number, riskFlags: string[]): "low" | "medium" | "high" | "critical" {
  if (riskFlags.some((flag) => flag.startsWith("high_risk_language"))) {
    return "critical";
  }

  if (complianceRiskScore >= 4) {
    return "high";
  }

  if (complianceRiskScore >= 3 || riskFlags.length >= 2) {
    return "medium";
  }

  return "low";
}
