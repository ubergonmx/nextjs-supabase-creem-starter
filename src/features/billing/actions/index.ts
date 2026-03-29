"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createCheckout,
  getCustomerPortalLink,
  cancelSubscription,
  resumeSubscription,
  upgradeSubscription,
  pauseSubscription,
} from "@/lib/creem/client";
import { redirect } from "next/navigation";
import type { Subscription } from "../types";
import { createCheckoutSchema } from "../schema";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// ---------- Helpers ----------
function mapRow(row: Record<string, unknown>): Subscription {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    creemSubscriptionId: (row.creem_subscription_id as string) ?? null,
    creemCustomerId: (row.creem_customer_id as string) ?? null,
    planId: (row.plan_id as string) ?? null,
    status: row.status as Subscription["status"],
    currentPeriodStart: (row.current_period_start as string) ?? null,
    currentPeriodEnd: (row.current_period_end as string) ?? null,
    cancelAtPeriodEnd: (row.cancel_at_period_end as boolean) ?? false,
  };
}

// ---------- Checkout ----------
export async function createCheckoutSession(
  productId: string,
): Promise<void> {
  if (!createCheckoutSchema.safeParse({ productId }).success) {
    redirect("/pricing?error=product_not_configured");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { checkout_url } = await createCheckout({
    productId,
    successUrl: `${APP_URL}/dashboard?checkout=success`,
    customerEmail: user.email!,
    metadata: { user_id: user.id },
  });

  redirect(checkout_url);
}

// ---------- Subscription queries ----------
export async function getUserSubscription(): Promise<Subscription | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;
  return mapRow(data as Record<string, unknown>);
}

// ---------- Customer Portal ----------
export async function openCustomerPortal(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("creem_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.creem_customer_id) {
    redirect("/dashboard/billing?error=no_customer");
  }

  const { customer_portal_link } = await getCustomerPortalLink(
    profile.creem_customer_id,
  );

  redirect(customer_portal_link);
}

// ---------- Cancel ----------
export async function cancelUserSubscription(
  mode: "scheduled" | "immediate",
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("creem_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.creem_subscription_id) return { error: "No active subscription" };

  try {
    await cancelSubscription(sub.creem_subscription_id, mode);
    if (mode === "scheduled") {
      await supabase
        .from("subscriptions")
        .update({ cancel_at_period_end: true })
        .eq("creem_subscription_id", sub.creem_subscription_id);
    } else {
      await supabase
        .from("subscriptions")
        .update({ status: "canceled" })
        .eq("creem_subscription_id", sub.creem_subscription_id);
    }
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ---------- Resume ----------
export async function resumeUserSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("creem_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.creem_subscription_id) return { error: "No active subscription" };

  try {
    await resumeSubscription(sub.creem_subscription_id);
    await supabase
      .from("subscriptions")
      .update({ cancel_at_period_end: false, status: "active" })
      .eq("creem_subscription_id", sub.creem_subscription_id);
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}

// ---------- Upgrade ----------
export async function upgradeUserSubscription(
  newProductId: string,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("creem_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.creem_subscription_id) redirect("/dashboard/billing");

  try {
    await upgradeSubscription(sub.creem_subscription_id, newProductId);
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unable to upgrade subscription";
    redirect(
      `/dashboard/billing?error=${encodeURIComponent(message)}`,
    );
  }

  // Actual status change comes back via webhook
  redirect("/dashboard/billing?upgraded=1");
}

// ---------- Pause ----------
export async function pauseUserSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("creem_subscription_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.creem_subscription_id) return { error: "No active subscription" };

  try {
    await pauseSubscription(sub.creem_subscription_id);
    await supabase
      .from("subscriptions")
      .update({ status: "paused" })
      .eq("creem_subscription_id", sub.creem_subscription_id);
    return {};
  } catch (e) {
    return { error: (e as Error).message };
  }
}
