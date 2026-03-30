import { Webhook } from "@creem_io/nextjs";
import { webhookHandlers } from "@/features/billing/webhooks";

const rawSecret = process.env.CREEM_WEBHOOK_SECRET ?? "";
const webhookSecret = rawSecret.startsWith("whsec_") ? rawSecret.slice(6) : rawSecret;

export const POST = Webhook({
  webhookSecret,
  ...webhookHandlers,
});
