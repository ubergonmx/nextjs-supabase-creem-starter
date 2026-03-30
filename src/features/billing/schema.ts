import * as z from 'zod';

// ---------- Action input schemas ----------

export const createCheckoutSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
});

// ---------- Creem webhook payload schemas ----------

export const creemCustomerSchema = z.object({
  id: z.string(),
  email: z.email(),
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
