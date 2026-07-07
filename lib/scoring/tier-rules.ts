/**
 * Tier threshold helper
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

export type PartnerTier = "tier_1_review" | "tier_2" | "tier_3" | "tier_4_nurture" | "reject_or_risk_review";

export interface TierRule {
  tier: PartnerTier;
  min_score: number;
  max_score: number;
}

export const DEFAULT_TIER_RULES: TierRule[] = [
  { tier: "tier_1_review", min_score: 85, max_score: 100 },
  { tier: "tier_2", min_score: 70, max_score: 84 },
  { tier: "tier_3", min_score: 50, max_score: 69 },
  { tier: "tier_4_nurture", min_score: 25, max_score: 49 },
  { tier: "reject_or_risk_review", min_score: 0, max_score: 24 }
];

export function getTierForScore(score: number, rules: TierRule[] = DEFAULT_TIER_RULES): PartnerTier {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  return rules.find((rule) => safeScore >= rule.min_score && safeScore <= rule.max_score)?.tier ?? "reject_or_risk_review";
}

export function applyTierOverride(args: {
  recommendedTier: PartnerTier;
  overrideTier?: PartnerTier;
  operatorId?: string;
  reason?: string;
}) {
  if (!args.overrideTier) {
    return { tier: args.recommendedTier, override_applied: false };
  }

  return {
    tier: args.overrideTier,
    override_applied: true,
    override: {
      operator_id: args.operatorId ?? "unknown_operator",
      previous_value: args.recommendedTier,
      new_value: args.overrideTier,
      reason: args.reason ?? "Manual override applied.",
      created_at: new Date().toISOString()
    }
  };
}
