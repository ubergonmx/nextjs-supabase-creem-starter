create or replace function public.spend_credits(
  p_user_id uuid,
  p_amount integer,
  p_description text default null
)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_balance integer;
begin
  -- Lock the row to prevent race conditions
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
