type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): { json(payload: unknown): void } };
import { buildClearSessionCookie, noStoreHeaders, safeAdminError } from "../../lib/admin-auth";

function sendJson(res: VercelResponse, statusCode: number, payload: unknown): void {
  Object.entries(noStoreHeaders()).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(statusCode).json(payload);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    const error = safeAdminError("METHOD_NOT_ALLOWED", "Use POST to end the admin session.", 405);
    return sendJson(res, error.statusCode, error.payload);
  }

  res.setHeader("Set-Cookie", buildClearSessionCookie());
  return sendJson(res, 200, {
    ok: true,
    authenticated: false,
    message: "Admin session cleared."
  });
}
