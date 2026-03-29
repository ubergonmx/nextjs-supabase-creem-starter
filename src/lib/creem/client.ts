import * as crypto from "node:crypto";

const CREEM_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://api.creem.io"
    : "https://test-api.creem.io";

// ---------- Types ----------
export type CreemSubscription = {
  id: string;
  customer: { id: string; email: string; name?: string };
  product_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  metadata?: Record<string, string>;
};

// ---------- Internal helper ----------
async function creemFetch<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    params?: Record<string, string>;
  },
): Promise<T> {
  const url = new URL(`${CREEM_BASE_URL}${path}`);
  if (options?.params) {
    for (const [key, value] of Object.entries(options.params)) {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    method: options?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.CREEM_API_KEY!,
    },
    ...(options?.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "unknown error");
    throw new Error(
      `Creem API error ${res.status} on ${options?.method ?? "GET"} ${path}: ${text}`,
    );
  }

  return res.json() as Promise<T>;
}

// ---------- Checkout ----------
export async function createCheckout(params: {
  productId: string;
  successUrl: string;
  customerEmail: string;
  metadata?: Record<string, string>;
}): Promise<{ checkout_url: string }> {
  return creemFetch<{ checkout_url: string }>("/v1/checkouts", {
    method: "POST",
    body: {
      product_id: params.productId,
      success_url: params.successUrl,
      customer_email: params.customerEmail,
      metadata: params.metadata,
    },
  });
}

// ---------- Subscriptions ----------
export async function getSubscription(
  subscriptionId: string,
): Promise<CreemSubscription> {
  return creemFetch<CreemSubscription>("/v1/subscriptions", {
    params: { subscription_id: subscriptionId },
  });
}

export async function cancelSubscription(
  subscriptionId: string,
  mode: "scheduled" | "immediate",
): Promise<void> {
  await creemFetch<void>(`/v1/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: { mode },
  });
}

export async function pauseSubscription(
  subscriptionId: string,
): Promise<void> {
  await creemFetch<void>(`/v1/subscriptions/${subscriptionId}/pause`, {
    method: "POST",
  });
}

export async function resumeSubscription(
  subscriptionId: string,
): Promise<void> {
  await creemFetch<void>(`/v1/subscriptions/${subscriptionId}/resume`, {
    method: "POST",
  });
}

export async function upgradeSubscription(
  subscriptionId: string,
  productId: string,
): Promise<void> {
  await creemFetch<void>(`/v1/subscriptions/${subscriptionId}/upgrade`, {
    method: "POST",
    body: {
      product_id: productId,
      update_behavior: "proration-charge-immediately",
    },
  });
}

// ---------- Customer Portal ----------
export async function getCustomerPortalLink(
  customerId: string,
): Promise<{ customer_portal_link: string }> {
  return creemFetch<{ customer_portal_link: string }>("/v1/customers/billing", {
    method: "POST",
    body: { customer_id: customerId },
  });
}

// ---------- Webhook Verification ----------
export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}
