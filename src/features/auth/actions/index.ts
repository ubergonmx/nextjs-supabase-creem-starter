"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { AuthActionState, OAuthProvider } from "../types";
import { loginSchema, signupSchema } from "../schema";

function getAuthRedirectBaseUrl(headersList: Headers): string {
  const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configuredAppUrl) {
    return configuredAppUrl.replace(/\/+$/, "");
  }

  const forwardedHost = headersList
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = headersList
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const host = forwardedHost ?? headersList.get("host");

  if (host) {
    const proto =
      forwardedProto ??
      (host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https");
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

// -- Actions --

export async function login(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: "Invalid email or password" };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  const result = signupSchema.safeParse(raw);
  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const headersList = await headers();
  const baseUrl = getAuthRedirectBaseUrl(headersList);

  console.log("Signup action - baseUrl:", baseUrl); // Debug log for base URL

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
    return { error: error.message };
  }

  if (!data.session) {
    redirect("/login?signup=pending");
  }

  redirect("/dashboard");
}

export async function loginWithOAuth(provider: OAuthProvider): Promise<void> {
  const headersList = await headers();
  const baseUrl = getAuthRedirectBaseUrl(headersList);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${baseUrl}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth_failed");
  }

  redirect(data.url);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
