-- Hometown family 报到 / check-in
-- Apply in the same Supabase project as hongfa4 if you want one backend,
-- or a dedicated project. Anon key is public (static export).
--
-- Dashboard: SQL editor → paste this file.
-- Then set on the Vercel/ichina.co site:
--   NEXT_PUBLIC_SUPABASE_URL
--   NEXT_PUBLIC_SUPABASE_ANON_KEY
--
-- Board is public (name + claimed person + optional photo).
-- WeChat / phone / email are stored, not selected by anon.

create table if not exists public.hometown_checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  person_id text not null check (char_length(person_id) between 1 and 64),
  display_name text not null check (char_length(display_name) between 1 and 80),
  wechat text check (wechat is null or char_length(wechat) <= 80),
  phone text check (phone is null or char_length(phone) <= 40),
  email text check (email is null or char_length(email) <= 120),
  photo_url text,
  locale text check (locale is null or char_length(locale) <= 16)
);

create index if not exists hometown_checkins_created_at_idx
  on public.hometown_checkins (created_at desc);

create index if not exists hometown_checkins_person_id_idx
  on public.hometown_checkins (person_id);

alter table public.hometown_checkins enable row level security;

drop policy if exists hometown_checkins_insert_anon on public.hometown_checkins;
create policy hometown_checkins_insert_anon
  on public.hometown_checkins
  for insert
  to anon, authenticated
  with check (
    char_length(trim(display_name)) >= 1
    and char_length(trim(person_id)) >= 1
  );

-- No direct SELECT on the table for anon.
drop policy if exists hometown_checkins_select_none on public.hometown_checkins;

create or replace view public.hometown_checkins_board
with (security_invoker = false)
as
select id, created_at, person_id, display_name, photo_url
from public.hometown_checkins;

grant usage on schema public to anon, authenticated;
grant insert on public.hometown_checkins to anon, authenticated;
grant select on public.hometown_checkins_board to anon, authenticated;

-- Optional photos
insert into storage.buckets (id, name, public)
values ('hometown-checkins', 'hometown-checkins', true)
on conflict (id) do nothing;

drop policy if exists hometown_checkins_storage_read on storage.objects;
create policy hometown_checkins_storage_read
  on storage.objects
  for select
  to public
  using (bucket_id = 'hometown-checkins');

drop policy if exists hometown_checkins_storage_insert on storage.objects;
create policy hometown_checkins_storage_insert
  on storage.objects
  for insert
  to anon, authenticated
  with check (
    bucket_id = 'hometown-checkins'
    and (storage.foldername(name))[1] = 'checkins'
  );
