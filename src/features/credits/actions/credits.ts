'use server';

import { createClient, getUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { refresh, revalidatePath } from 'next/cache';
import type { CreditTransaction } from '../types';
import { spendCreditsSchema } from '../schema';

export async function getCreditsBalance(): Promise<number> {
  const user = await getUser();

  if (!user) return 0;

  const supabase = await createClient();
  const { data } = await supabase.from('credits').select('balance').eq('user_id', user.id).single();

  return data?.balance ?? 0;
}

export async function spendCredits(
  amount: number,
  description: string,
): Promise<{ success: boolean; error?: string }> {
  const validation = spendCreditsSchema.safeParse({ amount, description });
  if (!validation.success) {
    return { success: false, error: validation.error.issues[0].message };
  }

  const user = await getUser();

  if (!user) return { success: false, error: 'Not authenticated' };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc('spend_credits', {
    p_user_id: user.id,
    p_amount: amount,
    p_description: description,
  });

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: 'Insufficient credits' };

  revalidatePath('/dashboard', 'layout');
  refresh();
  return { success: true };
}

export async function getCreditTransactions(limit = 50): Promise<CreditTransaction[]> {
  const user = await getUser();

  if (!user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    amount: row.amount as number,
    type: row.type as CreditTransaction['type'],
    description: (row.description as string) ?? null,
    createdAt: row.created_at as string,
  }));
}
