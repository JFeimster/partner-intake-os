import type { VercelRequest, VercelResponse } from "@vercel/node";
import { readAuditLogs, type AuditEntityType } from "../../lib/db/audit-log";

function sendJson(res: VercelResponse, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.json(body);
}

function isAdminRequest(req: VercelRequest): boolean {
  const expected = process.env.PARTNER_INTAKE_ADMIN_TOKEN;

  // Batch 31 keeps this endpoint safe-by-default. Batch 33 should replace this
  // with require-admin / RBAC middleware.
  if (!expected) return process.env.PARTNER_INTAKE_ENV !== "production";

  const header = req.headers.authorization || "";
  return header === `Bearer ${expected}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return sendJson(res, 405, { error: "method_not_allowed", message: "Use GET." });
  }

  if (!isAdminRequest(req)) {
    return sendJson(res, 401, {
      error: "unauthorized",
      message: "Admin audit log access requires server-side authorization."
    });
  }

  try {
    const logs = await readAuditLogs({
      entityType: req.query.entity_type as AuditEntityType | undefined,
      entityId: req.query.entity_id as string | undefined,
      action: req.query.action as string | undefined,
      requestId: req.query.request_id as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : 50,
      offset: req.query.offset ? Number(req.query.offset) : 0
    });

    return sendJson(res, 200, {
      ok: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "audit_log_read_failed",
      message: error instanceof Error ? error.message : "Unable to read audit log."
    });
  }
}
