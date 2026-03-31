import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_PATHS = ['/dashboard'];
const AUTH_PATHS = ['/login', '/signup'];

/**
 * Shared Supabase auth middleware logic.
 *
 * - Refreshes the Supabase session (via auth.getUser()) so cookies stay in sync
 * - Redirects unauthenticated users away from protected routes
 * - Redirects authenticated users away from auth pages
 *
 * Used by src/proxy.ts as the Next.js middleware entry point.
 */
export async function updateSession(request: NextRequest): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Refresh session — MUST call getUser() not getSession()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
  const isAuthPage = AUTH_PATHS.some((p) => path.startsWith(p));

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

