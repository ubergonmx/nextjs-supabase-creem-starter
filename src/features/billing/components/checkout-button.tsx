"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/features/billing/actions";
import { useTransition } from "react";

export function CheckoutButton({
  productId,
  children,
  variant = "default",
}: {
  productId: string;
  children: React.ReactNode;
  variant?: "default" | "outline";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={variant}
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(() => createCheckoutSession(productId))
      }
    >
      {pending ? "Redirecting…" : children}
    </Button>
  );
}
