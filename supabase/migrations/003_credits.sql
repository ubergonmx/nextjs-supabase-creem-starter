-- ============================================================
-- credits table
-- Wallet balance per user (integer, e.g. 1 credit = 1 AI generation)
-- ============================================================

create table if not exists public.credits (
  user_id    uuid primary key references public.profiles (id) on delete cascade,
  balance    integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create trigger credits_updated_at
  before update on public.credits
  for each row execute function public.handle_updated_at();

-- Seed a credits row when a profile is created
create or replace function public.handle_new_profile_credits()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.credits (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_profile_created_seed_credits
  after insert on public.profiles
  for each row execute function public.handle_new_profile_credits();

-- ============================================================
-- credit_transactions table
-- Immutable ledger of every credit change
-- ============================================================

create type public.credit_transaction_type as enum (
  'purchase',
  'topup',
  'spend',
  'refund',
  'adjustment'
);

create table if not exists public.credit_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  amount      integer not null,  -- positive = credit, negative = debit
  type        public.credit_transaction_type not null,
  description text,
  created_at  timestamptz not null default now()
);

create index credit_transactions_user_id_idx on public.credit_transactions (user_id);
create index credit_transactions_created_at_idx on public.credit_transactions (created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.credits enable row level security;

create policy "Users can view their own credit balance"
  on public.credits for select
  using (auth.uid() = user_id);

create policy "Service role can manage credits"
  on public.credits for all
  using (auth.role() = 'service_role');

alter table public.credit_transactions enable row level security;

create policy "Users can view their own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

create policy "Service role can manage credit transactions"
  on public.credit_transactions for all
  using (auth.role() = 'service_role');
