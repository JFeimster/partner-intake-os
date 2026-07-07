import { RATE_LIMIT_POLICIES } from "../../lib/security/rate-limit";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  return res.status(200).json({
    ok: true,
    module: "security",
    features: [
      "rate_limit_policy",
      "abuse_score",
      "honeypot_detection",
      "idempotency_key_design",
      "safe_ip_hashing_policy",
    ],
    protected_endpoints: Object.keys(RATE_LIMIT_POLICIES).filter((key) => key !== "default"),
    invasive_tracking: false,
  });
}
