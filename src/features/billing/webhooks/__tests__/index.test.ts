import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock admin client
vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

import { createAdminClient } from '@/lib/supabase/admin';
import { webhookHandlers, creditsForProductId, mapStatus } from '../index';

/** Creates a Supabase-like chainable mock where every method returns `this`,
 *  and the chain is also a Promise that resolves to { data, error: null }.
 */
function makeChain(returnData: unknown = null) {
  const result = { data: returnData, error: null };

  const chain: Record<string, unknown> = {
    then: (resolve: (v: unknown) => unknown) => Promise.resolve(result).then(resolve),
    catch: (reject: (e: unknown) => unknown) => Promise.resolve(result).catch(reject),
  };

  const methods = [
    'from',
    'select',
    'update',
    'insert',
    'upsert',
    'eq',
    'single',
    'maybeSingle',
    'order',
    'limit',
    'rpc',
  ];

  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }

  (chain.single as ReturnType<typeof vi.fn>).mockResolvedValue(result);
  (chain.maybeSingle as ReturnType<typeof vi.fn>).mockResolvedValue({ data: null, error: null });

  return chain;
}

// Base event fields shared across all webhook events
const baseEvent = { webhookId: 'wh_test_123' };

describe('webhookHandlers', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO = 'prod_pro';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS = 'prod_business';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS = 'prod_credits';
  });

  it('onCheckoutCompleted — upserts subscription when subscription present', async () => {
    const chain = makeChain({ id: 'user-123' });
    // Second maybeSingle call (idempotency check) returns null = not a duplicate
    (chain.maybeSingle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: null,
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    await webhookHandlers.onCheckoutCompleted!({
      ...baseEvent,
      customer: { id: 'cus_1', email: 'user@example.com', name: 'Test User' },
      product: { id: 'prod_pro', name: 'Pro' },
      metadata: { user_id: 'user-123' },
      subscription: {
        id: 'sub_1',
        status: 'active',
        current_period_start_date: new Date('2024-01-01'),
        current_period_end_date: new Date('2024-02-01'),
      },
    } as never);

    expect(chain.upsert).toHaveBeenCalled();
  });

  it('onCheckoutCompleted — skips when no user_id in metadata', async () => {
    const chain = makeChain(null);
    (chain.maybeSingle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: null,
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await webhookHandlers.onCheckoutCompleted!({
      ...baseEvent,
      customer: { id: 'cus_1', email: 'user@example.com' },
      product: { id: 'prod_pro', name: 'Pro' },
      metadata: {},
    } as never);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('no user_id'));
    warnSpy.mockRestore();
  });

  it('onCheckoutCompleted — skips duplicate webhookId', async () => {
    const chain = makeChain(null);
    // Atomic insert reports duplicate via unique violation.
    (chain.insert as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: {
        code: '23505',
        message: 'duplicate key value violates unique constraint',
      },
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    await webhookHandlers.onCheckoutCompleted!({
      ...baseEvent,
      customer: { id: 'cus_1', email: 'user@example.com' },
      product: { id: 'prod_pro', name: 'Pro' },
      metadata: { user_id: 'user-123' },
    } as never);

    // Should not upsert/update profiles since it returned early
    expect(chain.upsert).not.toHaveBeenCalled();
    expect(chain.update).not.toHaveBeenCalled();
  });

  it('onCheckoutCompleted — throws when idempotency insert fails unexpectedly', async () => {
    const chain = makeChain(null);
    (chain.insert as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: {
        code: '08006',
        message: 'connection failure',
      },
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    await expect(
      webhookHandlers.onCheckoutCompleted!({
        ...baseEvent,
        customer: { id: 'cus_1', email: 'user@example.com' },
        product: { id: 'prod_pro', name: 'Pro' },
        metadata: { user_id: 'user-123' },
      } as never),
    ).rejects.toThrow('webhook_events idempotency insert failed');

    expect(chain.upsert).not.toHaveBeenCalled();
    expect(chain.update).not.toHaveBeenCalled();
  });

  it('onSubscriptionCanceled — updates status to canceled', async () => {
    const chain = makeChain(null);
    (chain.maybeSingle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: null,
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    await webhookHandlers.onSubscriptionCanceled!({
      ...baseEvent,
      id: 'sub_1',
    } as never);

    expect(chain.update).toHaveBeenCalledWith({ status: 'canceled' });
  });

  it('onSubscriptionPaused — updates status to paused', async () => {
    const chain = makeChain(null);
    (chain.maybeSingle as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: null,
      error: null,
    });
    vi.mocked(createAdminClient).mockReturnValue(chain as never);

    await webhookHandlers.onSubscriptionPaused!({
      ...baseEvent,
      id: 'sub_1',
    } as never);

    expect(chain.update).toHaveBeenCalledWith({ status: 'paused' });
  });
});

describe('creditsForProductId', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO = 'prod_pro';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS = 'prod_business';
    process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_CREDITS = 'prod_credits';
  });

  it('returns pro credits for pro product', () => {
    expect(creditsForProductId('prod_pro')).toBeGreaterThan(0);
  });

  it('returns -1 for business (unlimited)', () => {
    expect(creditsForProductId('prod_business')).toBe(-1);
  });

  it('returns 500 for one-time credits purchase', () => {
    expect(creditsForProductId('prod_credits')).toBe(500);
  });

  it('returns 0 and warns for unknown product', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(creditsForProductId('prod_unknown')).toBe(0);
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

describe('mapStatus', () => {
  it('maps known statuses correctly', () => {
    expect(mapStatus('active')).toBe('active');
    expect(mapStatus('trialing')).toBe('trialing');
    expect(mapStatus('canceled')).toBe('canceled');
    expect(mapStatus('cancelled')).toBe('canceled'); // Creem UK spelling
    expect(mapStatus('past_due')).toBe('past_due');
    expect(mapStatus('paused')).toBe('paused');
  });

  it('falls back to incomplete for unknown status', () => {
    expect(mapStatus('unknown_status')).toBe('incomplete');
  });
});
