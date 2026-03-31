'use server';

import { createClient } from '@/lib/supabase/server';
import {
  cancelSubscription,
  resumeSubscription,
  upgradeSubscription,
  pauseSubscription,
} from '@/lib/creem/client';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

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

export async function cancelUserSubscription(
  mode: 'scheduled' | 'immediate',
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await cancelSubscription(sub.creem_subscription_id, mode);
    if (mode === 'scheduled') {
      await supabase
        .from('subscriptions')
        .update({ cancel_at_period_end: true })
        .eq('creem_subscription_id', sub.creem_subscription_id);
    } else {
      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('creem_subscription_id', sub.creem_subscription_id);
    }
    revalidatePath('/dashboard/billing');
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function resumeUserSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await resumeSubscription(sub.creem_subscription_id);
    await supabase
      .from('subscriptions')
      .update({ cancel_at_period_end: false, status: 'active' })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    revalidatePath('/dashboard/billing');
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function upgradeUserSubscription(newProductId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) redirect('/dashboard/billing');

  try {
    await upgradeSubscription(sub.creem_subscription_id, newProductId);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unable to upgrade subscription';
    redirect(`/dashboard/billing?error=${encodeURIComponent(message)}`);
  }

  redirect('/dashboard/billing?upgraded=1');
}

export async function pauseUserSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: 'Not authenticated' };

  const sub = await getLatestActiveSubscription(user.id);
  if (!sub?.creem_subscription_id) return { error: 'No active subscription' };

  try {
    await pauseSubscription(sub.creem_subscription_id);
    await supabase
      .from('subscriptions')
      .update({ status: 'paused' })
      .eq('creem_subscription_id', sub.creem_subscription_id);
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}
