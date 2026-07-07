import { getSessionContext, SessionContext } from "./session-context";
import { AdminRole, Permission, roleHasPermission } from "./permissions";

export function requireRole(req: any, allowedRoles: AdminRole[]): SessionContext {
  const session = getSessionContext(req);

  if (!session.authenticated || !session.role || !allowedRoles.includes(session.role)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  return session;
}

export function requirePermission(req: any, permission: Permission): SessionContext {
  const session = getSessionContext(req);

  if (!session.authenticated || !session.role || !roleHasPermission(session.role, permission)) {
    throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
  }

  return session;
}

export function withPermission(
  permission: Permission,
  handler: (req: any, res: any, session: SessionContext) => Promise<void> | void
) {
  return async function wrapped(req: any, res: any) {
    try {
      const session = requirePermission(req, permission);
      return await handler(req, res, session);
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        error: error.statusCode === 403 ? "forbidden" : "rbac_failed",
        message: error.message,
      });
    }
  };
}
