'use server';

import { createClient } from '@/lib/supabase/server';
import { getCustomerPortalLink } from '@/lib/creem/client';
import { redirect } from 'next/navigation';

export async function openCustomerPortal(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('creem_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.creem_customer_id) {
    redirect('/dashboard/billing?error=no_customer');
  }

  let portalUrl: string;
  try {
    const result = await getCustomerPortalLink(profile.creem_customer_id);
    portalUrl = result.customer_portal_link;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Portal unavailable';
    redirect(`/dashboard/billing?error=${encodeURIComponent(message)}`);
  }

  redirect(portalUrl);
}
