import { PLANS } from '@/features/billing/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { SubscriptionStatus } from '@/features/billing/types';

const ONE_TIME_CREDITS_PURCHASE_AMOUNT = 500;

export function creditsForProductId(productId: string): number {
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO) return PLANS.pro.credits;
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS) return -1; // unlimited
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS)
    return ONE_TIME_CREDITS_PURCHASE_AMOUNT;
  console.warn(`creditsForProductId: unknown product_id "${productId}" — no credits granted`);
  return 0;
}

export function mapStatus(raw: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: 'active',
    trialing: 'trialing',
    canceled: 'canceled',
    cancelled: 'canceled',
    past_due: 'past_due',
    paused: 'paused',
  };
  return map[raw] ?? 'incomplete';
}

/** Inserts a webhook_events row for idempotency. Returns true if already processed. */
export async function isDuplicate(
  admin: SupabaseClient,
  webhookId: string,
  eventType: string,
): Promise<boolean> {
  const { error } = await admin
    .from('webhook_events')
    .insert({ id: webhookId, event_type: eventType });

  if (!error) return false;

  // Duplicate webhook id means this event was already processed.
  if (error.code === '23505') return true;

  throw new Error(`webhook_events idempotency insert failed: ${error.message}`);
}
