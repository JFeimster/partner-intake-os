# Admin Roles

## `owner`

Full system control. Use sparingly.

Can:

- Manage users
- Read audit logs
- Change RBAC settings
- Make final strategic partner decisions
- Retry sync jobs
- Access all review queues

## `admin`

Operational admin.

Can:

- Review partners and leads
- Assign review items
- Update statuses
- Read audit logs
- Retry sync jobs
- View tracking summaries

Cannot:

- Change owner permissions
- Rotate core secrets directly

## `reviewer`

Frontline review operator.

Can:

- Read assigned review queue
- Update safe statuses
- Add operator notes
- Request more information

Cannot:

- Manage users
- Read all audit logs
- Configure integrations

## `read_only`

Visibility-only role.

Can:

- Read dashboard summaries
- Read non-sensitive review fields

Cannot:

- Change partner, lead, review, auth, or sync state

## `integration_service`

Machine/service actor.

Can:

- Run sync jobs
- Write integration status
- Read limited records required for sync

Cannot:

- Perform human review decisions
- Manage admin users
- Access admin UI as a person
