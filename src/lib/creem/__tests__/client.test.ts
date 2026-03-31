import { describe, it, expect, vi } from 'vitest';

describe('creemFetch error handling', () => {
  it('throws on non-2xx responses', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Unauthorized',
    } as Response);

    process.env.CREEM_API_KEY = 'test-key';

    const { createCheckout } = await import('../client');

    await expect(
      createCheckout({
        productId: 'prod_123',
        successUrl: 'http://localhost:3000/success',
        customerEmail: 'test@example.com',
      }),
    ).rejects.toThrow('Creem API error 401');
  });
});
