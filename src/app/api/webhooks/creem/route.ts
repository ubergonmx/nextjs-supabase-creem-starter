import { Webhook } from "@creem_io/nextjs";
import { webhookHandlers } from "@/features/billing/webhooks";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  ...webhookHandlers,
});
