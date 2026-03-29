import { createAdminClient } from "@/lib/supabase/admin";
import {
  creemWebhookEventSchema,
  creemCheckoutSchema,
  creemSubscriptionSchema,
  PLANS,
} from "../types";
import type { CreemWebhookEventType, SubscriptionStatus } from "../types";

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
  // credits product or unknown — default to 500
  return 500;
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
      const { data: existing } = await admin
        .from("credits")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (existing) {
        await admin
          .from("credits")
          .update({ balance: existing.balance + credits })
          .eq("user_id", userId);
      } else {
        await admin
          .from("credits")
          .insert({ user_id: userId, balance: credits });
      }

      await admin.from("credit_transactions").insert({
        user_id: userId,
        amount: credits,
        type: "purchase",
        description: `Purchased ${credits} credits`,
      });
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
      const { data: existing } = await admin
        .from("credits")
        .select("balance")
        .eq("user_id", profile.id)
        .single();

      if (existing) {
        await admin
          .from("credits")
          .update({ balance: existing.balance + credits })
          .eq("user_id", profile.id);
      } else {
        await admin
          .from("credits")
          .insert({ user_id: profile.id, balance: credits });
      }

      await admin.from("credit_transactions").insert({
        user_id: profile.id,
        amount: credits,
        type: "topup",
        description: `Monthly credit top-up`,
      });
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
    const { data: existing } = await admin
      .from("credits")
      .select("balance")
      .eq("user_id", profile.id)
      .single();

    if (existing) {
      const newBalance = Math.max(0, existing.balance - refundAmount);
      await admin
        .from("credits")
        .update({ balance: newBalance })
        .eq("user_id", profile.id);

      await admin.from("credit_transactions").insert({
        user_id: profile.id,
        amount: -refundAmount,
        type: "refund",
        description: "Refund processed",
      });
    }
  }
}
