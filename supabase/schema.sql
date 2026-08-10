-- Fresh-install canonical schema for the Phase 0A UID-based admin RLS design.
-- Keep app_private out of Supabase's API-exposed schemas.

create table public.site_content (
  id smallint primary key check (id = 1),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

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

-- Create a private Storage bucket named private-archive. Do not make it public.
