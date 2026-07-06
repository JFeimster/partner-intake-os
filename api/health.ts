import { createSuccess, sendJson, withApiHandler, type ApiRequest, type ApiResponse } from "../lib/http";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  return withApiHandler(req, res, { methods: ["GET"], auth: "none" }, async ({ requestId }) => {
    sendJson(res, 200, createSuccess(requestId, {
      status: "ok",
      service: "partner-intake-os",
      environment: process.env.PARTNER_INTAKE_ENV || process.env.VERCEL_ENV || "local",
      timestamp: new Date().toISOString(),
      version: process.env.PARTNER_INTAKE_VERSION || "0.1.0-placeholder"
    }));
  });
}
