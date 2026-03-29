import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock admin client
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
}));

import { createAdminClient } from "@/lib/supabase/admin";
import { handleWebhookEvent } from "../index";

/** Creates a Supabase-like chainable mock where every method returns `this`,
 *  and the chain is also a Promise that resolves to { data, error: null }.
 */
function makeChain(returnData: unknown = null) {
  const result = { data: returnData, error: null };

  // Make the chain itself thenable so `await chain.update().eq()` works
  const chain: Record<string, unknown> = {
    then: (
      resolve: (v: unknown) => unknown,
      _reject?: (e: unknown) => unknown,
    ) => Promise.resolve(result).then(resolve),
    catch: (reject: (e: unknown) => unknown) =>
      Promise.resolve(result).catch(reject),
  };

  const methods = [
    "from",
    "select",
    "update",
    "insert",
    "upsert",
    "eq",
    "single",
    "order",
    "limit",
    "rpc",
  ];

  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }

  // single() should still resolve to { data, error: null }
  (chain.single as ReturnType<typeof vi.fn>).mockResolvedValue(result);

  return chain;
}

describe("handleWebhookEvent", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO = "prod_pro";
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS = "prod_business";
  });

  it("handles checkout.completed with subscription", async () => {
    const chain = makeChain({ id: "user-123" });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    const payload = JSON.stringify({
      event_type: "checkout.completed",
      object: {
        id: "checkout_1",
        customer: { id: "cus_1", email: "user@example.com" },
        product_id: "prod_pro",
        metadata: { user_id: "user-123" },
        subscription: {
          id: "sub_1",
          customer: { id: "cus_1", email: "user@example.com" },
          product_id: "prod_pro",
          status: "active",
        },
      },
    });

    await expect(handleWebhookEvent(payload)).resolves.toBeUndefined();
    expect(chain.upsert).toHaveBeenCalled();
  });

  it("handles subscription.canceled", async () => {
    const chain = makeChain({ id: "user-123" });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    const payload = JSON.stringify({
      event_type: "subscription.canceled",
      object: {
        id: "sub_1",
        customer: { id: "cus_1", email: "user@example.com" },
        product_id: "prod_pro",
        status: "canceled",
      },
    });

    await expect(handleWebhookEvent(payload)).resolves.toBeUndefined();
    expect(chain.update).toHaveBeenCalled();
  });

  it("throws on invalid Zod payload", async () => {
    // event_type is missing — creemWebhookEventSchema will throw
    const payload = JSON.stringify({ bad: "payload" });
    await expect(handleWebhookEvent(payload)).rejects.toThrow();
  });

  it("logs a warning for unhandled event types", async () => {
    const consoleSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    const payload = JSON.stringify({
      event_type: "unknown.event",
      object: {},
    });

    await handleWebhookEvent(payload);
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Unhandled webhook event"),
    );

    consoleSpy.mockRestore();
  });
});
