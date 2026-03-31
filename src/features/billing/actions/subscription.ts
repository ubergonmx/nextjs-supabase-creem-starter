'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  cancelSubscription,
  resumeSubscription,
  upgradeSubscription,
  pauseSubscription,
} from '@/lib/creem/client';
import { refresh, revalidatePath } from 'next/cache';
import type { Subscription } from '../types';

function mapRow(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    creemSubscriptionId: (row.creem_subscription_id as string) ?? null,
    creemCustomerId: (row.creem_customer_id as string) ?? null,
    planId: (row.plan_id as string) ?? null,
    status: row.status as Subscription['status'],
    currentPeriodStart: (row.current_period_start as string) ?? null,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
    cancelAtPeriodEnd: (row.cancel_at_period_end as boolean) ?? false,
  };
}

async function getLatestActiveSubscription(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('creem_subscription_id')
    .eq('user_id', userId)
    .not('status', 'eq', 'canceled')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getUserSubscription(): Promise<Subscription | null> {
  const user = await getUser();

  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;
  return mapRow(data as Record<string, unknown>);
}

export async function cancelUserSubscription(): Promise<{ error?: string }> {
  const user = await getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await cancelSubscription(sub.creem_subscription_id, 'scheduled');
    const admin = createAdminClient();
    await admin
      .from('subscriptions')
      .update({ cancel_at_period_end: true })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    revalidatePath('/dashboard', 'layout');
    refresh();
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function resumeUserSubscription(): Promise<{ error?: string }> {
  const user = await getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await resumeSubscription(sub.creem_subscription_id);
    const admin = createAdminClient();
    await admin
      .from('subscriptions')
      .update({ cancel_at_period_end: false, status: 'active' })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    revalidatePath('/dashboard', 'layout');
    refresh();
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function upgradeUserSubscription(
  newProductId: string,
): Promise<{ error?: string }> {
  const user = await getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await upgradeSubscription(sub.creem_subscription_id, newProductId);
    const admin = createAdminClient();
    await admin
      .from('subscriptions')
      .update({ plan_id: newProductId, status: 'active', cancel_at_period_end: false })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    revalidatePath('/dashboard', 'layout');
    refresh();
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unable to upgrade subscription' };
  }
}

export async function pauseUserSubscription(): Promise<{ error?: string }> {
  const user = await getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await pauseSubscription(sub.creem_subscription_id);
    const admin = createAdminClient();
    await admin
      .from('subscriptions')
      .update({ status: 'paused' })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    revalidatePath('/dashboard', 'layout');
    refresh();
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}
