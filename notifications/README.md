# Notification Workflows

Batch 38 adds internal notification specs and server-side stubs for admin/operator alerts.

## Internal first

Start with internal alerts:

- new partner needs review
- high-risk partner flagged
- lead submitted
- duplicate detected
- sync failure
- admin decision needed

## Partner-facing messages

Partner-facing messages are optional and guarded. They should use review-safe language and suppression rules.

## No provider required

This batch does not require Resend, SendGrid, HubSpot, Gmail, Slack, n8n, or Activepieces. It defines adapters and stubs only.

## No SMS

SMS is intentionally not implemented in this batch.
