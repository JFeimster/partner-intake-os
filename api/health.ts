import { getRequiredEnvStatus, getRuntimeConfig } from "../lib/env";

type ApiResponse = {
  status: (code: number) => ApiResponse;
  json: (body: unknown) => void;
};

export default async function handler(req: any, res: ApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "method_not_allowed",
      message: "Use GET /api/health.",
      code: "bad_request",
      timestamp: new Date().toISOString()
    });
  }

  return res.status(200).json({
    ok: true,
    status: "healthy",
    runtime: getRuntimeConfig(),
    env: getRequiredEnvStatus(),
    checks: {
      api: "ok",
      auth_token_configured: getRequiredEnvStatus().PARTNER_INTAKE_ACTION_TOKEN === "set",
      storage: "mock_or_configured_later"
    },
    timestamp: new Date().toISOString()
  });
}
