/**
 * Webhook signing helpers
 * Partner Intake OS — generated production scaffold.
 * No secrets, tokens, partner PII, lead PII, borrower data, or admin sessions should be stored in this file.
 */

import crypto from "crypto";

export function signWebhookPayload(args: { secret: string; rawBody: string; timestamp?: number }): string {
  const timestamp = args.timestamp ?? Math.floor(Date.now() / 1000);
  const payload = `${timestamp}.${args.rawBody}`;
  const signature = crypto.createHmac("sha256", args.secret).update(payload).digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

export function verifyWebhookSignature(args: {
  secret: string;
  rawBody: string;
  header: string;
  toleranceSeconds?: number;
}): boolean {
  const tolerance = args.toleranceSeconds ?? 300;
  const parts = Object.fromEntries(args.header.split(",").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));

  const timestamp = Number(parts.t);
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) return false;

  const expected = signWebhookPayload({ secret: args.secret, rawBody: args.rawBody, timestamp }).split("v1=")[1];
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
