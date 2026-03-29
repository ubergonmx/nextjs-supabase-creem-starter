"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createCheckout } from "@/lib/creem/client";
import { redirect } from "next/navigation";
import type { CreditTransaction } from "../types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function getCreditsBalance(): Promise<number> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { data } = await supabase
    .from("credits")
    .select("balance")
    .eq("user_id", user.id)
    .single();

  return data?.balance ?? 0;
}

export async function purchaseCredits(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { checkout_url } = await createCheckout({
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS!,
    successUrl: `${APP_URL}/dashboard/credits?purchased=1`,
    customerEmail: user.email!,
    metadata: { user_id: user.id },
  });

  redirect(checkout_url);
}

export async function spendCredits(
  amount: number,
  description: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated" };

  const admin = createAdminClient();
  const { data, error } = await admin.rpc("spend_credits", {
    p_user_id: user.id,
    p_amount: amount,
    p_description: description,
  });

  if (error) return { success: false, error: error.message };
  if (!data) return { success: false, error: "Insufficient credits" };

  return { success: true };
}

export async function getCreditTransactions(
  limit = 50,
): Promise<CreditTransaction[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("credit_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!data) return [];

  return data.map((row) => ({
    id: row.id as string,
    userId: row.user_id as string,
    amount: row.amount as number,
    type: row.type as CreditTransaction["type"],
    description: (row.description as string) ?? null,
    createdAt: row.created_at as string,
  }));
}
