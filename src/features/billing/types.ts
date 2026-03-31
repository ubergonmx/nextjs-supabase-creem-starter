// ---------- Creem webhook event types ----------
export type CreemWebhookEventType =
  | 'checkout.completed'
  | 'subscription.active'
  | 'subscription.paid'
  | 'subscription.canceled'
  | 'subscription.expired'
  | 'subscription.trialing'
  | 'subscription.paused'
  | 'subscription.update'
  | 'refund.created';

// ---------- App-level types ----------
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete'
  | 'paused';

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

// ---------- Plan helpers ----------
export function planNameFromId(planId: string | null): string {
  if (!planId) return 'Free';
  if (planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER) return 'Starter';
  if (planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO) return 'Pro';
  if (planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS) return 'Business';
  return 'Free';
}

// ---------- Plan config ----------
export const PLANS = {
  free: { name: 'Free', price: 0, credits: 100 },
  starter: {
    name: 'Starter',
    price: 900,
    credits: 250,
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_STARTER,
  },
  pro: {
    name: 'Pro',
    price: 1900,
    credits: 5000,
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO,
  },
  business: {
    name: 'Business',
    price: 9900,
    credits: -1 /* unlimited */,
    productId: process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS,
  },
} as const;
