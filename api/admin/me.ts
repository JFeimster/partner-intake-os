import { withAdmin } from "../../lib/auth/require-admin";

export default withAdmin(async function handler(req: any, res: any, session: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "method_not_allowed" });

  return res.status(200).json({
    ok: true,
    user: {
      user_id: session.user_id,
      email: session.email,
      role: session.role,
      permissions: session.permissions,
      session_source: session.session_source,
    },
  });
});
