-- ============================================================
-- profiles table
-- Synced with auth.users via trigger
-- ============================================================

create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  email             text unique not null,
  full_name         text,
  avatar_url        text,
  creem_customer_id text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Partial unique index: only enforce uniqueness when creem_customer_id is set
create unique index if not exists profiles_creem_customer_id_idx
  on public.profiles (creem_customer_id)
  where creem_customer_id is not null;

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Sync new auth users into profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

alter table public.profiles force row level security;

-- Prevent users from changing fields managed by the system
revoke update (email, creem_customer_id) on public.profiles from authenticated;
