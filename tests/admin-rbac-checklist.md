# Admin RBAC Checklist

## Files

- [ ] `/auth/README.md`
- [ ] `/auth/rbac-model.md`
- [ ] `/auth/admin-roles.md`
- [ ] `/auth/session-policy.md`
- [ ] `/auth/permission-matrix.md`
- [ ] `/lib/auth/*`
- [ ] `/api/admin/users.ts`
- [ ] `/api/admin/me.ts`

## Validation

- [ ] Admin bearer token still works for MVP compatibility.
- [ ] `/api/admin/me` returns role and permissions.
- [ ] `/api/admin/users` denies non-owner roles.
- [ ] No admin/session/API tokens are stored in localStorage.
- [ ] HTTP-only cookie policy is documented.
- [ ] Permission matrix matches code permissions.
- [ ] Future auth provider migration path is documented.

## Env vars

```env
PARTNER_INTAKE_ADMIN_TOKEN=
PARTNER_INTAKE_SESSION_SECRET=
```
