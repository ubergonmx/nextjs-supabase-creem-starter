import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) {
    return '/dashboard';
  }

  if (!nextParam.startsWith('/') || nextParam.startsWith('//')) {
    return '/dashboard';
  }

  return nextParam;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const nextPath = getSafeNextPath(searchParams.get('next'));

  // Next.js sees requests as localhost even when tunnelled via ngrok.
  // Use forwarded headers to redirect back to the actual origin.
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const origin = forwardedHost
    ? `${forwardedProto ?? 'https'}://${forwardedHost}`
    : new URL(request.url).origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(nextPath, origin));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', origin));
}
