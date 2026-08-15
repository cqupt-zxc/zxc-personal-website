-- Existing-project upgrade path for the Phase 0A UID-based admin RLS design.
-- Run only through a trusted Supabase/PostgreSQL administrative path.
-- app_private must not be added to Supabase's API-exposed schemas.

begin;

do $preflight$
declare
  site_content_owner text;
  current_policy_names text[];
begin
  if current_user <> 'postgres' then
    raise exception 'Phase 0B migration must run as postgres; current_user is %', current_user;
  end if;

  if exists (
    select 1
    from pg_namespace
    where nspname = 'app_private'
  ) then
    raise exception 'app_private schema already exists; aborting for manual inspection';
  end if;

  if not exists (
    select 1
    from pg_class as relation
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname = 'site_content'
      and relation.relkind = 'r'
  ) then
    raise exception 'public.site_content is missing or is not a table; aborting for manual inspection';
  end if;

  select owner_role.rolname
  into site_content_owner
  from pg_class as relation
  join pg_namespace as namespace on namespace.oid = relation.relnamespace
  join pg_roles as owner_role on owner_role.oid = relation.relowner
  where namespace.nspname = 'public'
    and relation.relname = 'site_content';

  if site_content_owner <> 'postgres' then
    raise exception 'public.site_content owner is %, expected postgres; aborting for manual inspection', site_content_owner;
  end if;

  if not exists (select 1 from pg_roles where rolname = 'anon')
    or not exists (select 1 from pg_roles where rolname = 'authenticated') then
    raise exception 'expected Supabase anon/authenticated roles are missing; aborting for manual inspection';
  end if;

  select coalesce(array_agg(policy.policyname order by policy.policyname), array[]::text[])
  into current_policy_names
  from pg_policies as policy
  where policy.schemaname = 'public'
    and policy.tablename = 'site_content';

  if current_policy_names <> array[
    'authenticated users can update content',
    'public can read published site content'
  ] then
    raise exception 'public.site_content policies are not the expected legacy baseline; aborting for manual inspection';
  end if;

  if not exists (
    select 1
    from pg_policy as policy
    join pg_class as relation on relation.oid = policy.polrelid
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname = 'site_content'
      and policy.polname = 'authenticated users can update content'
      and policy.polcmd = '*'
      and policy.polroles = array['authenticated'::regrole]::oid[]
      and pg_get_expr(policy.polqual, policy.polrelid) = 'true'
      and pg_get_expr(policy.polwithcheck, policy.polrelid) = 'true'
  ) or not exists (
    select 1
    from pg_policy as policy
    join pg_class as relation on relation.oid = policy.polrelid
    join pg_namespace as namespace on namespace.oid = relation.relnamespace
    where namespace.nspname = 'public'
      and relation.relname = 'site_content'
      and policy.polname = 'public can read published site content'
      and policy.polcmd = 'r'
      and policy.polroles = array[0::oid]
      and pg_get_expr(policy.polqual, policy.polrelid) = 'true'
      and policy.polwithcheck is null
  ) then
    raise exception 'public.site_content legacy policy definitions are unexpected; aborting for manual inspection';
  end if;
end;
$preflight$;

create schema app_private authorization postgres;

revoke all on schema app_private from public, anon, authenticated;
grant usage on schema app_private to authenticated;

alter default privileges for role postgres in schema app_private
  revoke all on tables from public, anon, authenticated;
alter default privileges for role postgres in schema app_private
  revoke all on functions from public, anon, authenticated;
alter default privileges for role postgres in schema app_private
  revoke all on sequences from public, anon, authenticated;

create table app_private.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table app_private.admin_users enable row level security;
revoke all on table app_private.admin_users from public, anon, authenticated;

create function app_private.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $function$
  select exists (
    select 1
    from app_private.admin_users as admin_user
    where admin_user.user_id = (select auth.uid())
  );
$function$;

revoke all on function app_private.is_site_admin() from public, anon, authenticated;
grant execute on function app_private.is_site_admin() to authenticated;

drop policy "authenticated users can update content" on public.site_content;
drop policy "public can read published site content" on public.site_content;

revoke all on table public.site_content from anon, authenticated;
grant select on table public.site_content to anon;
grant select, insert, update on table public.site_content to authenticated;

create policy site_content_public_select
on public.site_content
for select
to anon, authenticated
using (true);

create policy site_content_admin_insert
on public.site_content
for insert
to authenticated
with check ((select app_private.is_site_admin()));

create policy site_content_admin_update
on public.site_content
for update
to authenticated
using ((select app_private.is_site_admin()))
with check ((select app_private.is_site_admin()));

commit;
