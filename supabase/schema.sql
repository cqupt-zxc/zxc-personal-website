create table if not exists public.site_content (id smallint primary key check (id = 1), content jsonb not null, updated_at timestamptz not null default now());
alter table public.site_content enable row level security;
create policy "public can read published site content" on public.site_content for select using (true);
create policy "authenticated users can update content" on public.site_content for all to authenticated using (true) with check (true);
-- Create a private Storage bucket named private-archive. Do not make it public.
