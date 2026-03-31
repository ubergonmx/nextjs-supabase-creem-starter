import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock both supabase clients
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  refresh: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { createClient, getUser } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { spendCredits } from '../credits';

describe('spendCredits', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };

  beforeEach(() => {
    vi.mocked(getUser).mockResolvedValue(mockUser as never);
    vi.mocked(createClient).mockResolvedValue({} as never);
  });

  it('returns success when RPC returns true', async () => {
    vi.mocked(createAdminClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: true, error: null }),
    } as never);

    const result = await spendCredits(10, 'test spend');
    expect(result).toEqual({ success: true });
  });

  it('returns insufficient credits when RPC returns false', async () => {
    vi.mocked(createAdminClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: false, error: null }),
    } as never);

    const result = await spendCredits(9999, 'too many');
    expect(result).toEqual({ success: false, error: 'Insufficient credits' });
  });

  it('returns error when RPC fails', async () => {
    vi.mocked(createAdminClient).mockReturnValue({
      rpc: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    } as never);

    const result = await spendCredits(10, 'failing spend');
    expect(result).toEqual({ success: false, error: 'DB error' });
  });

  it('returns not authenticated when no user', async () => {
    vi.mocked(getUser).mockResolvedValue(null);

    const result = await spendCredits(10, 'no user');
    expect(result).toEqual({ success: false, error: 'Not authenticated' });
  });
});
