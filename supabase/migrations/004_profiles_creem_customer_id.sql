alter table public.profiles add column if not exists creem_customer_id text;
create index if not exists profiles_creem_customer_id_idx on public.profiles (creem_customer_id);
