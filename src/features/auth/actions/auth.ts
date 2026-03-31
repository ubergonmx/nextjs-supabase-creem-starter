'use server';

import * as z from 'zod';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import type { AuthActionState, OAuthProvider } from '../types';
import { loginSchema, signupSchema } from '../schema';

function getAuthRedirectBaseUrl(headersList: Headers): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const isProduction =
    configuredAppUrl &&
    !configuredAppUrl.includes('localhost') &&
    !configuredAppUrl.includes('127.0.0.1');

  // In production use the configured URL; in dev prefer incoming headers so
  // tunnels like ngrok work without changing any env vars.
  if (isProduction) {
    return configuredAppUrl.replace(/\/+$/, '');
  }

  const forwardedHost = headersList.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = headersList.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const host = forwardedHost ?? headersList.get('host');

  if (host) {
    const proto =
      forwardedProto ??
      (host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https');
    return `${proto}://${host}`;
  }

  return configuredAppUrl ?? 'http://localhost:3000';
}

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: z.flattenError(result.error).fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: 'Invalid email or password' };
  }

  redirect('/dashboard');
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    fullName: String(formData.get('fullName') ?? ''),
    email: String(formData.get('email') ?? ''),
    password: String(formData.get('password') ?? ''),
    confirmPassword: String(formData.get('confirmPassword') ?? ''),
  };
  const signupInputs = {
    fullName: raw.fullName,
    email: raw.email,
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return {
      fieldErrors: z.flattenError(result.error).fieldErrors,
      inputs: signupInputs,
    };
  }

  const headersList = await headers();
  const baseUrl = getAuthRedirectBaseUrl(headersList);


  console.log('Signup base URL', baseUrl);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: { full_name: result.data.fullName },
      emailRedirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message, inputs: signupInputs };
  }

  if (!data.session) {
    redirect('/login?signup=pending');
  }

  redirect('/dashboard');
}

export async function loginWithOAuth(provider: OAuthProvider): Promise<void> {
  const headersList = await headers();
  const baseUrl = getAuthRedirectBaseUrl(headersList);

  console.log('Login with OAuth base URL', baseUrl);
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect('/login?error=oauth_failed');
  }

  redirect(data.url);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
