import type { ApiRequest, ApiResponse } from "./http";

const DEFAULT_ALLOWED_ORIGIN = "*";

export function applyCors(req: ApiRequest, res: ApiResponse): void {
  const configuredOrigin = process.env.PARTNER_INTAKE_ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  const origin = configuredOrigin === "reflect" ? String(req.headers?.origin || DEFAULT_ALLOWED_ORIGIN) : configuredOrigin;

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type,X-Request-Id,X-Tally-Signature,Tally-Signature");
  res.setHeader("Access-Control-Max-Age", "86400");
}

export function handleOptions(req: ApiRequest, res: ApiResponse): boolean {
  if (req.method !== "OPTIONS") return false;

  applyCors(req, res);
  res.statusCode = 204;
  res.end();
  return true;
}
