-- Hometown 报到 · ichina.co/hometown
-- Apply in the Supabase SQL editor. Static export inlines
-- NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY at build.
-- Public board never selects wechat / phone / email.

create table if not exists public.hometown_checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  person_id text not null,
  display_name text not null,
  wechat text,
  phone text,
  email text,
  photo_url text,
  locale text
);

create index if not exists hometown_checkins_created_at_idx
  on public.hometown_checkins (created_at desc);

create index if not exists hometown_checkins_person_id_idx
  on public.hometown_checkins (person_id);

alter table public.hometown_checkins enable row level security;

revoke all on public.hometown_checkins from anon, authenticated, public;

grant insert (
  person_id,
  display_name,
  wechat,
  phone,
  email,
  photo_url,
  locale
) on public.hometown_checkins to anon, authenticated;

grant select (
  id,
  created_at,
  person_id,
  display_name,
  photo_url
) on public.hometown_checkins to anon, authenticated;

drop policy if exists hometown_checkins_insert on public.hometown_checkins;
create policy hometown_checkins_insert
  on public.hometown_checkins
  for insert
  to anon, authenticated
  with check (
    char_length(trim(display_name)) between 1 and 80
    and char_length(person_id) between 1 and 64
    and char_length(coalesce(wechat, '')) <= 80
    and char_length(coalesce(phone, '')) <= 40
    and char_length(coalesce(email, '')) <= 120
  );

drop policy if exists hometown_checkins_select on public.hometown_checkins;
create policy hometown_checkins_select
  on public.hometown_checkins
  for select
  to anon, authenticated
  using (true);

insert into storage.buckets (id, name, public)
values ('hometown-checkins', 'hometown-checkins', true)
on conflict (id) do nothing;

drop policy if exists hometown_checkins_storage_insert on storage.objects;
create policy hometown_checkins_storage_insert
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'hometown-checkins'
    and (storage.foldername(name))[1] = 'checkins'
  );

drop policy if exists hometown_checkins_storage_select on storage.objects;
create policy hometown_checkins_storage_select
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'hometown-checkins');
