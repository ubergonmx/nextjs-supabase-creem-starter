-- ============================================================
-- Explicit permission hardening for public schema functions
--
-- Context: 003_credits.sql already revokes execute on the
-- three credit RPCs from public/anon/authenticated. This
-- migration completes the surface by:
--
--   1. Revoking EXECUTE on trigger/utility functions from
--      anon and authenticated. PostgreSQL already blocks
--      direct calls on trigger-returning functions, but
--      explicit revoke removes them from PostgREST RPC
--      discovery and makes the permission model unambiguous.
--
--   2. Explicitly granting EXECUTE on credit RPCs to
--      service_role. The REVOKE in 003 stripped the PUBLIC
--      grant; this grant ensures the service_role (used by
--      the admin client in webhooks) retains access through
--      any future permission resets or Supabase upgrades.
-- ============================================================

-- ---- Trigger / utility functions ----

revoke execute on function public.handle_updated_at()
  from anon, authenticated;

revoke execute on function public.handle_new_user()
  from anon, authenticated;

revoke execute on function public.handle_new_profile_credits()
  from anon, authenticated;

-- ---- Credit RPCs: service_role-only ----

grant execute on function public.spend_credits(uuid, integer, text)
  to service_role;

grant execute on function public.add_credits(uuid, integer, text, text)
  to service_role;

grant execute on function public.deduct_credits(uuid, integer, text)
  to service_role;
