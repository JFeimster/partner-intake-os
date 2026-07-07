import { PartnerSession } from "./partner-session";

export type PartnerPortalPermission =
  | "portal:read_profile"
  | "portal:update_profile"
  | "portal:submit_lead"
  | "portal:read_tracking"
  | "portal:manage_tracking"
  | "portal:read_resources";

const ROLE_PERMISSIONS: Record<NonNullable<PartnerSession["role"]>, PartnerPortalPermission[]> = {
  partner_owner: [
    "portal:read_profile",
    "portal:update_profile",
    "portal:submit_lead",
    "portal:read_tracking",
    "portal:manage_tracking",
    "portal:read_resources",
  ],
  partner_member: [
    "portal:read_profile",
    "portal:submit_lead",
    "portal:read_tracking",
    "portal:read_resources",
  ],
  partner_read_only: [
    "portal:read_profile",
    "portal:read_tracking",
    "portal:read_resources",
  ],
};

export function canAccessPartner(
  session: PartnerSession,
  partnerId: string,
  permission: PartnerPortalPermission
): boolean {
  if (!session.authenticated || session.status !== "active" || !session.role) return false;
  if (session.partner_id !== partnerId) return false;
  return ROLE_PERMISSIONS[session.role]?.includes(permission) ?? false;
}

export function assertPartnerAccess(session: PartnerSession, partnerId: string, permission: PartnerPortalPermission): void {
  if (!canAccessPartner(session, partnerId, permission)) {
    throw Object.assign(new Error("Partner portal access denied"), { statusCode: 403 });
  }
}
