import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupPendingToast } from "@/features/auth/components/signup-pending-toast";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log in",
  description: "Access your CreemKit account to manage subscriptions and credits.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ signup?: string }>;
}) {
  const { signup } = await searchParams;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      {signup === "pending" && <SignupPendingToast />}
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Logo />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
