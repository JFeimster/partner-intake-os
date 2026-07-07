import { AdminRole, Permission, ROLE_PERMISSIONS } from "./permissions";

export interface SessionContext {
  authenticated: boolean;
  user_id: string | null;
  email: string | null;
  role: AdminRole | null;
  permissions: Permission[];
  session_source: "http_only_cookie" | "mvp_bearer_token" | "integration_service" | "none";
}

function parseCookie(header?: string): Record<string, string> {
  return Object.fromEntries(
    (header ?? "")
      .split(";")
      .map((part) => part.trim().split("="))
      .filter((pair) => pair.length === 2)
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

export function getSessionContext(req: any): SessionContext {
  const cookies = parseCookie(req.headers?.cookie);
  const bearer = req.headers?.authorization?.replace(/^Bearer\s+/i, "");

  // MVP compatibility: one server-side admin token maps to owner/admin.
  if (bearer && process.env.PARTNER_INTAKE_ADMIN_TOKEN && bearer === process.env.PARTNER_INTAKE_ADMIN_TOKEN) {
    return {
      authenticated: true,
      user_id: "mvp_admin",
      email: "admin@local",
      role: "owner",
      permissions: ROLE_PERMISSIONS.owner,
      session_source: "mvp_bearer_token",
    };
  }

  // Placeholder for signed HTTP-only session cookie.
  if (cookies.partner_admin_session && process.env.PARTNER_INTAKE_SESSION_SECRET) {
    // Production implementation should verify signature and load session from DB/provider.
    const role = (cookies.partner_admin_role as AdminRole) || "read_only";
    return {
      authenticated: true,
      user_id: cookies.partner_admin_user_id ?? "cookie_user",
      email: cookies.partner_admin_email ?? null,
      role,
      permissions: ROLE_PERMISSIONS[role] ?? [],
      session_source: "http_only_cookie",
    };
  }

  return {
    authenticated: false,
    user_id: null,
    email: null,
    role: null,
    permissions: [],
    session_source: "none",
  };
}
