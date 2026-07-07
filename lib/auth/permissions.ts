export type AdminRole = "owner" | "admin" | "reviewer" | "read_only" | "integration_service";

export type Permission =
  | "admin:user_manage"
  | "admin:read_self"
  | "partner:read"
  | "partner:update"
  | "lead:read"
  | "lead:decide"
  | "review:read"
  | "review:update"
  | "review:assign"
  | "audit:read"
  | "sync:read"
  | "sync:retry"
  | "tracking:read"
  | "notifications:send_internal";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  owner: [
    "admin:user_manage",
    "admin:read_self",
    "partner:read",
    "partner:update",
    "lead:read",
    "lead:decide",
    "review:read",
    "review:update",
    "review:assign",
    "audit:read",
    "sync:read",
    "sync:retry",
    "tracking:read",
    "notifications:send_internal",
  ],
  admin: [
    "admin:read_self",
    "partner:read",
    "partner:update",
    "lead:read",
    "lead:decide",
    "review:read",
    "review:update",
    "review:assign",
    "audit:read",
    "sync:read",
    "sync:retry",
    "tracking:read",
    "notifications:send_internal",
  ],
  reviewer: [
    "admin:read_self",
    "partner:read",
    "lead:read",
    "review:read",
    "review:update",
    "tracking:read",
  ],
  read_only: [
    "admin:read_self",
    "partner:read",
    "lead:read",
    "review:read",
    "sync:read",
    "tracking:read",
  ],
  integration_service: [
    "admin:read_self",
    "partner:read",
    "partner:update",
    "lead:read",
    "sync:read",
    "sync:retry",
  ],
};

export function roleHasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function assertPermission(role: AdminRole, permission: Permission): void {
  if (!roleHasPermission(role, permission)) {
    throw new Error(`Role ${role} is missing required permission ${permission}`);
  }
}
