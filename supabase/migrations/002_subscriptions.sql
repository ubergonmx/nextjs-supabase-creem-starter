-- ============================================================
-- subscriptions table
-- Tracks Creem subscription state per user
-- ============================================================

create type public.subscription_status as enum (
  'active',
  'canceled',
  'past_due',
  'trialing',
  'incomplete',
  'paused'
);

create table if not exists public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references public.profiles (id) on delete cascade,
  creem_subscription_id  text unique,
  creem_customer_id      text,
  plan_id                text,
  status                 public.subscription_status not null default 'incomplete',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index subscriptions_user_id_idx on public.subscriptions (user_id);
create index subscriptions_creem_subscription_id_idx on public.subscriptions (creem_subscription_id);

-- Auto-update updated_at
create trigger subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Only the service role can insert/update subscriptions (via webhooks)
create policy "Service role can manage subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');
