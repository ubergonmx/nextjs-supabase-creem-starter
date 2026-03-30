import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS } from "@/features/billing/types";
import type { SubscriptionStatus } from "@/features/billing/types";
import type { Webhook } from "@creem_io/nextjs";

// ---------- Types ----------

type WebhookHandlers = Omit<NonNullable<Parameters<typeof Webhook>[0]>, "webhookSecret">;

// ---------- Helpers ----------

const ONE_TIME_CREDITS_PURCHASE_AMOUNT = 500;

export function creditsForProductId(productId: string): number {
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO) return PLANS.pro.credits;
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS) return -1; // unlimited
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS) return ONE_TIME_CREDITS_PURCHASE_AMOUNT;
  console.warn(`creditsForProductId: unknown product_id "${productId}" — no credits granted`);
  return 0;
}

export function mapStatus(raw: string): SubscriptionStatus {
  const map: Record<string, SubscriptionStatus> = {
    active: "active",
    trialing: "trialing",
    canceled: "canceled",
    cancelled: "canceled",
    past_due: "past_due",
    paused: "paused",
  };
  return map[raw] ?? "incomplete";
}

/** Inserts a webhook_events row for idempotency. Returns true if already processed. */
export async function isDuplicate(webhookId: string, eventType: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("webhook_events")
    .select("id")
    .eq("id", webhookId)
    .maybeSingle();

  if (existing) return true;

  await admin.from("webhook_events").insert({ id: webhookId, event_type: eventType });
  return false;
}

// ---------- Handlers ----------

export const webhookHandlers: WebhookHandlers = {
  onCheckoutCompleted: async (event) => {
    if (await isDuplicate(event.webhookId, "checkout.completed")) return;

    const userId = (event.metadata as Record<string, string> | undefined)?.user_id;
    if (!userId) {
      console.warn("[webhook] checkout.completed: no user_id in metadata, skipping");
      return;
    }

    const admin = createAdminClient();

    await admin
      .from("profiles")
      .update({ creem_customer_id: event.customer.id })
      .eq("id", userId);

    if (event.subscription) {
      const sub = event.subscription;
      await admin.from("subscriptions").upsert(
        {
          user_id: userId,
          creem_subscription_id: sub.id,
          creem_customer_id: event.customer.id,
          plan_id: event.product.id,
          status: mapStatus(sub.status ?? "active"),
          current_period_start: sub.current_period_start_date
            ? new Date(sub.current_period_start_date).toISOString()
            : null,
          current_period_end: sub.current_period_end_date
            ? new Date(sub.current_period_end_date).toISOString()
            : null,
          cancel_at_period_end: false,
        },
        { onConflict: "creem_subscription_id" },
      );
    } else {
      // One-time credit purchase
      const credits = creditsForProductId(event.product.id);
      if (credits > 0) {
        const { error } = await admin.rpc("add_credits", {
          p_user_id: userId,
          p_amount: credits,
          p_type: "purchase",
          p_description: `Purchased ${credits} credits`,
        });
        if (error) throw new Error(`add_credits RPC failed: ${error.message}`);
      }
    }
  },

  onSubscriptionActive: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.active")) return;
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({
        status: "active",
        current_period_end: event.current_period_end_date
          ? new Date(event.current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", event.id);
  },

  onSubscriptionPaid: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.paid")) return;
    const admin = createAdminClient();

    await admin
      .from("subscriptions")
      .update({
        status: "active",
        current_period_end: event.current_period_end_date
          ? new Date(event.current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", event.id);

    // Top up credits on each billing cycle
    const { data: sub } = await admin
      .from("subscriptions")
      .select("user_id, plan_id")
      .eq("creem_subscription_id", event.id)
      .single();

    if (sub?.plan_id) {
      const credits = creditsForProductId(sub.plan_id as string);
      if (credits > 0) {
        const { error } = await admin.rpc("add_credits", {
          p_user_id: sub.user_id,
          p_amount: credits,
          p_type: "topup",
          p_description: "Monthly credit top-up",
        });
        if (error) throw new Error(`add_credits RPC failed: ${error.message}`);
      }
    }
  },

  onSubscriptionTrialing: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.trialing")) return;
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({
        status: "trialing",
        current_period_end: event.current_period_end_date
          ? new Date(event.current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", event.id);
  },

  onSubscriptionCanceled: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.canceled")) return;
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("creem_subscription_id", event.id);
  },

  onSubscriptionExpired: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.expired")) return;
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("creem_subscription_id", event.id);
  },

  onSubscriptionPaused: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.paused")) return;
    const admin = createAdminClient();
    await admin
      .from("subscriptions")
      .update({ status: "paused" })
      .eq("creem_subscription_id", event.id);
  },

  onSubscriptionUpdate: async (event) => {
    if (await isDuplicate(event.webhookId, "subscription.update")) return;
    const admin = createAdminClient();
    const productId =
      typeof event.product === "string" ? event.product : (event.product as { id: string }).id;
    await admin
      .from("subscriptions")
      .update({
        plan_id: productId,
        status: mapStatus(event.status ?? "active"),
        current_period_end: event.current_period_end_date
          ? new Date(event.current_period_end_date).toISOString()
          : undefined,
      })
      .eq("creem_subscription_id", event.id);
  },

  onRefundCreated: async (event) => {
    if (await isDuplicate(event.webhookId, "refund.created")) return;
    const admin = createAdminClient();

    const subscriptionId =
      typeof event.subscription === "string"
        ? event.subscription
        : (event.subscription as { id?: string } | undefined)?.id;

    if (!subscriptionId) return;

    const { data: sub } = await admin
      .from("subscriptions")
      .select("user_id, plan_id")
      .eq("creem_subscription_id", subscriptionId)
      .maybeSingle();

    if (!sub) return;

    const creditsToDeduct = sub.plan_id ? creditsForProductId(sub.plan_id as string) : 0;
    if (creditsToDeduct > 0) {
      const { error } = await admin.rpc("deduct_credits", {
        p_user_id: sub.user_id,
        p_amount: creditsToDeduct,
        p_description: "Refund processed",
      });
      if (error) throw new Error(`deduct_credits RPC failed: ${error.message}`);
    }
  },
};
