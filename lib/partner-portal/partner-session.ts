export interface PartnerSession {
  authenticated: boolean;
  partner_account_id: string | null;
  partner_id: string | null;
  role: "partner_owner" | "partner_member" | "partner_read_only" | null;
  status: "invited" | "active" | "paused" | "revoked" | "archived" | null;
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

export function getPartnerSession(req: any): PartnerSession {
  const cookies = parseCookie(req.headers?.cookie);

  if (!cookies.partner_portal_session) {
    return { authenticated: false, partner_account_id: null, partner_id: null, role: null, status: null };
  }

  // Production implementation should verify a signed HTTP-only cookie and load from DB.
  return {
    authenticated: true,
    partner_account_id: cookies.partner_account_id ?? null,
    partner_id: cookies.partner_id ?? null,
    role: (cookies.partner_role as PartnerSession["role"]) ?? "partner_read_only",
    status: (cookies.partner_status as PartnerSession["status"]) ?? "active",
  };
}
