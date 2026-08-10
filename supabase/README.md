# Supabase database maintenance

`schema.sql` is the canonical fresh-install schema. Existing projects must use the timestamped migration in `migrations/` through a trusted administrative path after its preflight succeeds. Do not run either file against a production project as part of repository validation.

`app_private` is authorization infrastructure, not application data. It must remain outside Supabase's API-exposed schemas. The `authenticated` role receives only the schema/function access needed to evaluate `public.site_content` RLS; it receives no table access to `app_private.admin_users`.

## Administrator bootstrap

Before adding an administrator, manually inspect Supabase Auth and confirm the canonical Auth UID. In particular, confirm whether Email and GitHub OAuth identities are linked and which exact UID or UIDs should have membership. Use a controlled administrative path to insert only a confirmed UUID:

```sql
insert into app_private.admin_users (user_id)
values ('<verified-canonical-uuid>'::uuid);
```

Do not derive membership from email matching and do not seed an administrator from this repository. A service-role key remains a server-only secret with privileged database capabilities; it is not a client authorization mechanism.

See `tests/site-content-rls-test-plan.md` for the Phase 0C disposable/preview-environment test matrix.
