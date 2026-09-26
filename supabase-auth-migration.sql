-- Safe, additive Supabase Auth setup. Run this file in the Supabase SQL Editor.
-- Do not run supabase-schema.sql against an existing database: it drops and
-- recreates the bus-ticketing tables before seeding demo data.

-- Use a dedicated table because this project already has an unrelated
-- public.profiles table with a different column layout.
create table if not exists public.auth_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  name text not null default '',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill Auth accounts created before this trigger was installed.
insert into public.auth_profiles (id, email, name, phone)
select
  id,
  coalesce(email, ''),
  coalesce(raw_user_meta_data ->> 'name', ''),
  nullif(raw_user_meta_data ->> 'phone', '')
from auth.users
on conflict (id) do nothing;

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.auth_profiles (id, email, name, phone)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do update set
    name = excluded.name,
    phone = excluded.phone,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update of raw_user_meta_data on auth.users
  for each row execute function public.handle_new_auth_user();

create table if not exists public.user_login_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  name text,
  phone text,
  login_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Add these fields when upgrading a login-log table created by an earlier version.
alter table public.user_login_logs add column if not exists email text;
alter table public.user_login_logs add column if not exists name text;
alter table public.user_login_logs add column if not exists phone text;

-- Fill identity details for old events without overwriting existing snapshots.
update public.user_login_logs as logs
set email = coalesce(logs.email, auth_user.email),
    name = coalesce(logs.name, profile.name, auth_user.raw_user_meta_data ->> 'name'),
    phone = coalesce(logs.phone, profile.phone)
from auth.users as auth_user
left join public.auth_profiles as profile on profile.id = auth_user.id
where logs.user_id = auth_user.id
  and (logs.email is null or logs.name is null or logs.phone is null);

create index if not exists user_login_logs_user_login_at_idx
  on public.user_login_logs (user_id, login_at desc);

alter table public.auth_profiles enable row level security;
alter table public.user_login_logs enable row level security;

drop policy if exists "Users can read own auth profile" on public.auth_profiles;
create policy "Users can read own auth profile" on public.auth_profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "Users can update own auth profile" on public.auth_profiles;
create policy "Users can update own auth profile" on public.auth_profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can read own login events" on public.user_login_logs;
create policy "Users can read own login events" on public.user_login_logs
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users can record own login events" on public.user_login_logs;
create policy "Users can record own login events" on public.user_login_logs
  for insert to authenticated with check (auth.uid() = user_id);

revoke all on public.user_login_logs from anon;
grant select, insert on public.user_login_logs to authenticated;
revoke all on public.auth_profiles from anon;
grant select, update on public.auth_profiles to authenticated;
