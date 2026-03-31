-- ============================================================
-- webhook_events table
-- Idempotency log for Creem webhook events (admin visibility)
-- ============================================================

create table if not exists public.webhook_events (
  id          text primary key,         -- Creem webhookId — natural dedup key
  event_type  text not null,
  received_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security — admin (service_role) only
-- ============================================================

alter table public.webhook_events enable row level security;

-- No SELECT policy for end-users; service_role bypasses RLS entirely.
-- Add an authenticated read policy only if you build an admin UI.
alter table public.webhook_events force row level security;
