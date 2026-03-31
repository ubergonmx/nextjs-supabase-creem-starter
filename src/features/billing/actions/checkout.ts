'use server';

import { createClient } from '@/lib/supabase/server';
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
    [PLANS.pro.productId, PLANS.business.productId].filter(
      (id): id is string => typeof id === 'string' && id.length > 0,
    ),
  );

  if (!allowedProductIds.has(normalizedProductId)) {
    redirect('/pricing?error=product_not_configured');
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const customerEmail = user.email?.trim();
  if (!customerEmail) {
    redirect('/pricing?error=missing_email');
  }

  let checkoutUrl: string;
  try {
    const result = await createCheckout({
      productId: normalizedProductId,
      successUrl: `${APP_URL}/dashboard?checkout=success`,
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
