import { describe, it, expect, vi, beforeEach } from "vitest";
import * as crypto from "node:crypto";

// We test verifyWebhookSignature in isolation by importing it after
// setting up the env var
describe("verifyWebhookSignature", () => {
  const secret = "test-webhook-secret";
  const body = JSON.stringify({ event_type: "checkout.completed" });

  beforeEach(() => {
    process.env.CREEM_WEBHOOK_SECRET = secret;
  });

  it("returns true for a valid signature", async () => {
    const { verifyWebhookSignature } = await import("../client");
    const sig = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    expect(verifyWebhookSignature(body, sig)).toBe(true);
  });

  it("returns false for an invalid signature", async () => {
    const { verifyWebhookSignature } = await import("../client");
    expect(verifyWebhookSignature(body, "bad-signature")).toBe(false);
  });

  it("returns false when signature is empty", async () => {
    const { verifyWebhookSignature } = await import("../client");
    expect(verifyWebhookSignature(body, "")).toBe(false);
  });
});

describe("creemFetch error handling", () => {
  it("throws on non-2xx responses", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => "Unauthorized",
    } as Response);

    process.env.CREEM_API_KEY = "test-key";

    const { createCheckout } = await import("../client");

    await expect(
      createCheckout({
        productId: "prod_123",
        successUrl: "http://localhost:3000/success",
        customerEmail: "test@example.com",
      }),
    ).rejects.toThrow("Creem API error 401");
  });
});
