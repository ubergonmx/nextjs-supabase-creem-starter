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

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(nextPath, request.url));
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth_callback_failed', request.url));
}
