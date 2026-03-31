import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@supabase/ssr';
import { proxy } from '@/proxy';

function makeRequest(pathname: string): NextRequest {
  return new NextRequest(`https://example.com${pathname}`);
}

describe('proxy', () => {
  const getUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_test';
    vi.mocked(createServerClient).mockReturnValue({
      auth: { getUser },
    } as never);
  });

  it('redirects unauthenticated users from protected routes to /login', async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await proxy(makeRequest('/dashboard'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/login');
  });

  it('redirects authenticated users away from /login to /dashboard', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'user_1' } } });

    const response = await proxy(makeRequest('/login'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('https://example.com/dashboard');
  });

  it('allows public routes for unauthenticated users', async () => {
    getUser.mockResolvedValue({ data: { user: null } });

    const response = await proxy(makeRequest('/pricing'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('allows protected routes for authenticated users', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'user_2' } } });

    const response = await proxy(makeRequest('/dashboard'));

    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
