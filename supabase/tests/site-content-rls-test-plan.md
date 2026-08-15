# `site_content` RLS integration test plan

Phase 0B provides static repository checks only. Execute this matrix in Phase 0C against a disposable or preview Supabase environment after applying the migration and creating two controlled Auth users: one confirmed administrator UID and one normal authenticated UID.

| Actor/state | Operation | Expected result |
| --- | --- | --- |
| anon | `SELECT public.site_content` | Allowed |
| anon | `INSERT`, `UPDATE`, `DELETE public.site_content` | Denied |
| authenticated non-admin | `SELECT public.site_content` | Allowed |
| authenticated non-admin | `INSERT`, `UPDATE`, `DELETE public.site_content` | Denied |
| authenticated admin | `SELECT public.site_content` | Allowed |
| authenticated admin | `INSERT public.site_content` for the existing `id = 1` upsert path | Allowed by RLS (subject to the table constraint) |
| authenticated admin | `UPDATE public.site_content` | Allowed |
| authenticated admin | `DELETE public.site_content` | Denied |
| authenticated user | Read or modify `app_private.admin_users` through normal Supabase Data API access | Inaccessible/denied |
| authenticated non-admin | Call/evaluate `app_private.is_site_admin()` | May only receive its own boolean result; cannot list members, modify state, or self-promote |
| confirmed admin, then membership row deleted | Next direct database `INSERT` or `UPDATE` request | Denied immediately; no JWT-claim refresh dependency |
| same user, membership re-added through trusted administration | Next direct database `INSERT` or `UPDATE` request | Allowed immediately |

Also verify that `app_private` is absent from Supabase's API-exposed schema configuration, that no Storage policy was changed, and that a service-role key was never used in a browser client. Capture the direct API responses and migration/rollback evidence before considering a production rollout.
