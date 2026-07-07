/**
 * Developer webhook registration endpoint
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isSafeEventType } from "../../../lib/developers/event-publisher";

function requireDeveloperKey(req: VercelRequest): boolean {
  const token = req.headers.authorization?.replace("Bearer ", "");
  return Boolean(process.env.PARTNER_DEVELOPER_API_KEY && token === process.env.PARTNER_DEVELOPER_API_KEY);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });
  if (!requireDeveloperKey(req)) return res.status(401).json({ error: "unauthorized" });

  const { destination_url, events, description } = req.body ?? {};
  if (!destination_url || !Array.isArray(events)) return res.status(400).json({ error: "missing_destination_or_events" });

  const unsafe = events.filter((event) => !isSafeEventType(event));
  if (unsafe.length) return res.status(400).json({ error: "unsafe_event_requested", unsafe });

  return res.status(202).json({
    ok: true,
    status: "received_for_review",
    webhook: {
      destination_url,
      events,
      description: description ?? null,
      signing: "required"
    },
    note: "Webhook registration should be reviewed before activation."
  });
}
