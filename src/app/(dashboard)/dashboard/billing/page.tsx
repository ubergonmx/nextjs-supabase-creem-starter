import type { Metadata } from "next";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { getUserSubscription } from "@/features/billing/actions";
import { SubscriptionCard } from "@/features/billing/components/subscription-card";
import { ManageSubscription } from "@/features/billing/components/manage-subscription";
import { getCreditsBalance } from "@/features/credits/actions";
import { PLANS } from "@/features/billing/types";
import { CheckoutButton } from "@/features/billing/components/checkout-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Billing",
  description: "Manage your subscription and billing details.",
};

export default async function BillingPage() {
  const [subscription, creditsBalance] = await Promise.all([
    getUserSubscription(),
    getCreditsBalance(),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your subscription and payment details.
          </p>
        </div>

        <SubscriptionCard
          subscription={subscription}
          creditsBalance={creditsBalance}
        />

        {subscription && <ManageSubscription subscription={subscription} />}

        {/* Plan comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Available Plans</CardTitle>
            <CardDescription>Upgrade or change your plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {PLANS.pro.productId && (
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="font-medium">{PLANS.pro.name}</p>
                  <p className="text-2xl font-bold">
                    ${(PLANS.pro.price / 100).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {PLANS.pro.credits.toLocaleString()} credits/month
                  </p>
                  <CheckoutButton productId={PLANS.pro.productId!}>
                    {subscription ? "Switch to Pro" : "Get Pro"}
                  </CheckoutButton>
                </div>
              )}
              {PLANS.business.productId && (
                <div className="rounded-lg border p-4 space-y-2">
                  <p className="font-medium">{PLANS.business.name}</p>
                  <p className="text-2xl font-bold">
                    ${(PLANS.business.price / 100).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">
                      /mo
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Unlimited credits
                  </p>
                  <CheckoutButton
                    productId={PLANS.business.productId!}
                    variant="outline"
                  >
                    {subscription ? "Switch to Business" : "Get Business"}
                  </CheckoutButton>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
