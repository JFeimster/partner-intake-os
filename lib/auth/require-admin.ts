import { getSessionContext, SessionContext } from "./session-context";

export function requireAdmin(req: any): SessionContext {
  const session = getSessionContext(req);

  if (!session.authenticated || !session.role) {
    throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
  }

  return session;
}

export function withAdmin(handler: (req: any, res: any, session: SessionContext) => Promise<void> | void) {
  return async function wrapped(req: any, res: any) {
    try {
      const session = requireAdmin(req);
      return await handler(req, res, session);
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        error: error.statusCode === 401 ? "unauthorized" : "admin_auth_failed",
        message: error.message,
      });
    }
  };
}
