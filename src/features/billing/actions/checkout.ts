'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { createCheckout } from '@/lib/creem/client';
import { redirect } from 'next/navigation';
import { PLANS } from '../types';
import { createCheckoutSchema } from '../schema';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function createCheckoutSession(productId: string): Promise<void> {
  const normalizedProductId = productId.trim();

  if (!createCheckoutSchema.safeParse({ productId: normalizedProductId }).success) {
    redirect('/pricing?error=product_not_configured');
  }

  const allowedProductIds = new Set(
    [PLANS.starter.productId, PLANS.pro.productId, PLANS.business.productId].filter(
      (id): id is string => typeof id === 'string' && id.length > 0,
    ),
  );

  if (!allowedProductIds.has(normalizedProductId)) {
    redirect('/pricing?error=product_not_configured');
  }

  const user = await getUser();

  if (!user) redirect('/login');

  const supabase = await createClient();
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .limit(1)
    .maybeSingle();

  if (existingSub) {
    redirect('/dashboard/settings/billing?error=already_subscribed');
  }

  const customerEmail = user.email?.trim();
  if (!customerEmail) {
    redirect('/pricing?error=missing_email');
  }

  let checkoutUrl: string;
  try {
    const result = await createCheckout({
      productId: normalizedProductId,
      successUrl: `${APP_URL}/dashboard/settings/billing?checkout=success`,
      customerEmail,
      metadata: { user_id: user.id },
    });
    checkoutUrl = result.checkout_url;
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Checkout unavailable';
    console.error('createCheckoutSession failed: ', message);
    redirect('/pricing?error=checkout_unavailable');
  }

  redirect(checkoutUrl);
}
