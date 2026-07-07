import { withPermission } from "../../lib/auth/require-role";

export default withPermission("admin:user_manage", async function handler(req: any, res: any, session: any) {
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      managed_by: session.user_id,
      users: [],
      note: "User list is provider-backed in production. This endpoint defines RBAC protection only.",
    });
  }

  if (req.method === "POST") {
    return res.status(501).json({
      ok: false,
      error: "not_implemented",
      message: "Create users through the selected auth provider or future admin DB implementation.",
    });
  }

  return res.status(405).json({ error: "method_not_allowed" });
});
