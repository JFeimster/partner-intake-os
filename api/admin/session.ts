type VercelRequest = { method?: string; headers: Record<string, string | string[] | undefined>; body?: unknown };
type VercelResponse = { setHeader(name: string, value: string): void; status(code: number): { json(payload: unknown): void } };
import {
  adminAuthConfigured,
  authenticateAdminRequest,
  buildSessionCookie,
  createAdminSession,
  noStoreHeaders,
  safeAdminError,
  verifyAdminToken
} from "../../lib/admin-auth";

type JsonBody = Record<string, unknown>;

async function readBody(req: VercelRequest): Promise<JsonBody> {
  if (req.body && typeof req.body === "object") return req.body as JsonBody;
  if (typeof req.body === "string" && req.body.trim()) return JSON.parse(req.body);
  return {};
}

function sendJson(res: VercelResponse, statusCode: number, payload: unknown): void {
  Object.entries(noStoreHeaders()).forEach(([key, value]) => res.setHeader(key, value));
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.status(statusCode).json(payload);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const auth = authenticateAdminRequest(req);
    return sendJson(res, auth.ok ? 200 : 401, {
      ok: auth.ok,
      authenticated: auth.ok,
      mode: auth.mode,
      role: auth.role || null,
      expires_at: auth.session?.expires_at || null,
      admin_auth_configured: adminAuthConfigured(),
      demo_mode: auth.mode === "demo"
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    const error = safeAdminError("METHOD_NOT_ALLOWED", "Use GET to check session or POST to create one.", 405);
    return sendJson(res, error.statusCode, error.payload);
  }

  if (!adminAuthConfigured()) {
    const error = safeAdminError(
      "ADMIN_AUTH_NOT_CONFIGURED",
      "PARTNER_ADMIN_TOKEN must be configured before admin login can be used.",
      503
    );
    return sendJson(res, error.statusCode, error.payload);
  }

  let body: JsonBody;
  try {
    body = await readBody(req);
  } catch {
    const error = safeAdminError("INVALID_JSON", "Request body must be valid JSON.", 400);
    return sendJson(res, error.statusCode, error.payload);
  }

  const token = typeof body.token === "string" ? body.token.trim() : "";
  if (!verifyAdminToken(token)) {
    const error = safeAdminError("INVALID_ADMIN_TOKEN", "Admin token is invalid or missing.", 401);
    return sendJson(res, error.statusCode, error.payload);
  }

  const session = createAdminSession("owner");
  res.setHeader("Set-Cookie", buildSessionCookie(session));

  return sendJson(res, 200, {
    ok: true,
    authenticated: true,
    role: "owner",
    message: "Admin session created. Use the protected review queue for sample/internal review data only."
  });
}
