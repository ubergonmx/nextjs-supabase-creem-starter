import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature } from "@/lib/creem/client";
import { handleWebhookEvent } from "@/features/billing/webhooks";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("creem-signature");

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    await handleWebhookEvent(rawBody);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
