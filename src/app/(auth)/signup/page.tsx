import type { Metadata } from "next";
import { SignupForm } from "@/features/auth/components/signup-form";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your CreemKit account and start selling with Supabase and Creem.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
