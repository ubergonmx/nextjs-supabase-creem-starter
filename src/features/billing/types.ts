import * as z from "zod";

// ---------- Creem webhook event types ----------
export type CreemWebhookEventType =
  | "checkout.completed"
  | "subscription.active"
  | "subscription.paid"
  | "subscription.canceled"
  | "subscription.expired"
  | "subscription.trialing"
  | "subscription.paused"
  | "subscription.update"
  | "refund.created";

// ---------- Zod schemas for webhook payloads ----------
export const creemCustomerSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export const creemSubscriptionSchema = z.object({
  id: z.string(),
  customer: creemCustomerSchema,
  product_id: z.string(),
  status: z.string(),
  current_period_start: z.string().optional(),
  current_period_end: z.string().optional(),
  cancel_at_period_end: z.boolean().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const creemCheckoutSchema = z.object({
  id: z.string(),
  customer: creemCustomerSchema,
  subscription: creemSubscriptionSchema.optional(),
  product_id: z.string(),
  metadata: z.record(z.string(), z.string()).optional(),
});

export const creemWebhookEventSchema = z.object({
  event_type: z.string(),
  object: z.unknown(),
});

// ---------- App-level types ----------
export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "trialing"
  | "incomplete"
  | "paused";

export type Subscription = {
  id: string;
  userId: string;
  creemSubscriptionId: string | null;
  creemCustomerId: string | null;
  planId: string | null;
  status: SubscriptionStatus;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
};

// ---------- Plan config ----------
export const PLANS = {
  free: { name: "Free", price: 0, credits: 100 },
  pro: {
    name: "Pro",
    price: 1900,
    credits: 5000,
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO,
  },
  business: {
    name: "Business",
    price: 2900,
    credits: -1 /* unlimited */,
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS,
  },
} as const;
