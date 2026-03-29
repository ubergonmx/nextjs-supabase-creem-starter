import { createAdminClient } from "@/lib/supabase/admin";
import {
  creemWebhookEventSchema,
  creemCheckoutSchema,
  creemSubscriptionSchema,
} from "../schema";
import { PLANS } from "../types";
import type { CreemWebhookEventType, SubscriptionStatus } from "../types";

const ONE_TIME_CREDITS_PURCHASE_AMOUNT = 500;

function mapCreemStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "canceled":
    case "cancelled":
      return "canceled";
    case "past_due":
      return "past_due";
    case "paused":
      return "paused";
    default:
      return "incomplete";
  }
}

function creditsForProductId(productId: string): number {
  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO) {
    return PLANS.pro.credits;
  }

  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS) {
    return -1; // unlimited — no top-up needed
  }

  if (productId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS) {
    return ONE_TIME_CREDITS_PURCHASE_AMOUNT;
  }

  console.warn(
    `creditsForProductId: unknown product_id "${productId}" — no credits granted`,
  );
  return 0;
}

export async function handleWebhookEvent(rawBody: string): Promise<void> {
  const parsed = creemWebhookEventSchema.parse(JSON.parse(rawBody));
  const eventType = parsed.event_type as CreemWebhookEventType;

  switch (eventType) {
    case "checkout.completed":
      return handleCheckoutCompleted(parsed.object);
    case "subscription.active":
    case "subscription.paid":
    case "subscription.trialing":
    case "subscription.update":
      return handleSubscriptionUpsert(parsed.object, eventType);
    case "subscription.canceled":
    case "subscription.expired":
      return handleSubscriptionEnded(parsed.object);
    case "subscription.paused":
      return handleSubscriptionPaused(parsed.object);
    case "refund.created":
      return handleRefundCreated(parsed.object);
    default:
      console.warn(`Unhandled webhook event: ${eventType}`);
  }
}

async function handleCheckoutCompleted(object: unknown): Promise<void> {
  const checkout = creemCheckoutSchema.parse(object);
  const admin = createAdminClient();

  const userId = checkout.metadata?.user_id;
  if (!userId) {
    console.warn("checkout.completed: no user_id in metadata");
    return;
  }

  // Store creem_customer_id on profiles
  await admin
    .from("profiles")
    .update({ creem_customer_id: checkout.customer.id })
    .eq("id", userId);

  if (checkout.subscription) {
    const sub = checkout.subscription;
    await admin.from("subscriptions").upsert(
      {
        user_id: userId,
        creem_subscription_id: sub.id,
        creem_customer_id: checkout.customer.id,
        plan_id: sub.product_id,
        status: mapCreemStatus(sub.status),
        current_period_start: sub.current_period_start ?? null,
        current_period_end: sub.current_period_end ?? null,
        cancel_at_period_end: sub.cancel_at_period_end ?? false,
      },
      { onConflict: "creem_subscription_id" },
    );
  } else {
    // One-time credit purchase
    const credits = creditsForProductId(checkout.product_id);
    if (credits > 0) {
      const { error } = await admin.rpc("add_credits", {
        p_user_id: userId,
        p_amount: credits,
        p_type: "purchase",
        p_description: `Purchased ${credits} credits`,
      });

      if (error) {
        throw new Error(`add_credits RPC failed: ${error.message}`);
      }
    }
  }
}

async function handleSubscriptionUpsert(
  object: unknown,
  eventType: CreemWebhookEventType,
): Promise<void> {
  const sub = creemSubscriptionSchema.parse(object);
  const admin = createAdminClient();

  // Look up user_id via creem_customer_id on profiles
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("creem_customer_id", sub.customer.id)
    .single();

  if (!profile) {
    console.warn(
      `handleSubscriptionUpsert: no profile for customer ${sub.customer.id}`,
    );
    return;
  }

  await admin.from("subscriptions").upsert(
    {
      user_id: profile.id,
      creem_subscription_id: sub.id,
      creem_customer_id: sub.customer.id,
      plan_id: sub.product_id,
      status: mapCreemStatus(sub.status),
      current_period_start: sub.current_period_start ?? null,
      current_period_end: sub.current_period_end ?? null,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    },
    { onConflict: "creem_subscription_id" },
  );

  // On subscription.paid → top up credits based on plan
  if (eventType === "subscription.paid") {
    const credits = creditsForProductId(sub.product_id);
    if (credits > 0) {
      const { error } = await admin.rpc("add_credits", {
        p_user_id: profile.id,
        p_amount: credits,
        p_type: "topup",
        p_description: "Monthly credit top-up",
      });

      if (error) {
        throw new Error(`add_credits RPC failed: ${error.message}`);
      }
    }
  }
}

async function handleSubscriptionEnded(object: unknown): Promise<void> {
  const sub = creemSubscriptionSchema.parse(object);
  const admin = createAdminClient();

  await admin
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("creem_subscription_id", sub.id);
}

async function handleSubscriptionPaused(object: unknown): Promise<void> {
  const sub = creemSubscriptionSchema.parse(object);
  const admin = createAdminClient();

  await admin
    .from("subscriptions")
    .update({ status: "paused" })
    .eq("creem_subscription_id", sub.id);
}

async function handleRefundCreated(object: unknown): Promise<void> {
  // Refund payload has minimal shape — just need subscription or customer ref
  const refund = object as Record<string, unknown>;
  const customerId = (refund.customer as { id?: string } | undefined)?.id;
  if (!customerId) return;

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("creem_customer_id", customerId)
    .single();

  if (!profile) return;

  const refundAmount = typeof refund.amount === "number" ? refund.amount : 0;

  if (refundAmount > 0) {
    const { error } = await admin.rpc("deduct_credits", {
      p_user_id: profile.id,
      p_amount: refundAmount,
      p_description: "Refund processed",
    });

    if (error) {
      throw new Error(`deduct_credits RPC failed: ${error.message}`);
    }
  }
}
