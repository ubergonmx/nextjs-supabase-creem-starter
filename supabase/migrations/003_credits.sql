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
security definer set search_path = ''
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
  using ((select auth.uid()) = user_id);

-- Note: service_role bypasses RLS entirely — no explicit policy needed
alter table public.credits force row level security;

alter table public.credit_transactions enable row level security;

create policy "Users can view their own transactions"
  on public.credit_transactions for select
  using ((select auth.uid()) = user_id);

-- Note: service_role bypasses RLS entirely — no explicit policy needed
alter table public.credit_transactions force row level security;

-- ============================================================
-- RPCs: spend_credits, add_credits
--
-- These live in the same file as the schema because they are
-- tightly coupled to the credits/credit_transactions tables —
-- they encode the only safe ways to mutate balances (atomic
-- upsert, FOR UPDATE row lock, input validation). Keeping
-- schema and its business-logic RPCs together makes it easier
-- to reason about the full credits domain in one place.
--
-- Both functions are security definer with search_path = '' to
-- prevent search_path hijacking. Execute is revoked from all
-- non-service roles because they are only ever called from the
-- server-side admin client, never directly by users.
-- ============================================================

create or replace function public.spend_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text default null
)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    return false;
  end if;

  -- Lock the row to prevent race conditions on concurrent webhook retries
  select balance into v_balance
  from public.credits
  where user_id = p_user_id
  for update;

  if v_balance is null or v_balance < p_amount then
    return false;
  end if;

  update public.credits
  set balance = balance - p_amount
  where user_id = p_user_id;

  insert into public.credit_transactions (user_id, amount, type, description)
  values (p_user_id, -p_amount, 'spend', p_description);

  return true;
end;
$$;

create or replace function public.add_credits(
  p_user_id uuid,
  p_amount integer,
  p_type text,
  p_description text default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if p_amount <= 0 then
    return;
  end if;

  -- Atomic upsert prevents double-grant on concurrent webhook retries
  insert into public.credits (user_id, balance)
  values (p_user_id, p_amount)
  on conflict (user_id)
  do update set balance = public.credits.balance + excluded.balance;

  insert into public.credit_transactions (user_id, amount, type, description)
  values (p_user_id, p_amount, p_type::public.credit_transaction_type, p_description);
end;
$$;

-- Dedicated RPC for credit deductions (refunds, adjustments).
-- Separate from spend_credits (which requires sufficient balance) because refunds
-- should always succeed even if the user already spent the credits — balance floors at 0.
create or replace function public.deduct_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if p_amount <= 0 then
    return;
  end if;

  -- Floor at 0 — refunds should not fail if the user already spent the credits
  update public.credits
  set balance = greatest(0, balance - p_amount)
  where user_id = p_user_id;

  insert into public.credit_transactions (user_id, amount, type, description)
  values (p_user_id, -p_amount, 'refund', p_description);
end;
$$;

revoke execute on function public.spend_credits(uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.add_credits(uuid, integer, text, text) from public, anon, authenticated;
revoke execute on function public.deduct_credits(uuid, integer, text) from public, anon, authenticated;
