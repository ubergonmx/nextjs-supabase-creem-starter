import type { Metadata } from 'next';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { getUserSubscription } from '@/features/billing/actions';
import { SubscriptionCard } from '@/features/billing/components/subscription-card';
import { ManageSubscription } from '@/features/billing/components/manage-subscription';
import { getCreditsBalance } from '@/features/credits/actions';
import { PLANS } from '@/features/billing/types';
import { CheckoutButton } from '@/features/billing/components/checkout-button';
import { UpgradeButton } from '@/features/billing/components/upgrade-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your subscription and billing details.',
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
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription and payment details.
          </p>
        </div>

        <SubscriptionCard subscription={subscription} creditsBalance={creditsBalance} />

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
                <div className="space-y-2 rounded-lg border p-4">
                  <p className="font-medium">{PLANS.pro.name}</p>
                  <p className="text-2xl font-bold">
                    ${(PLANS.pro.price / 100).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {PLANS.pro.credits.toLocaleString()} credits/month
                  </p>
                  {subscription ? (
                    <UpgradeButton productId={PLANS.pro.productId!}>Switch to Pro</UpgradeButton>
                  ) : (
                    <CheckoutButton productId={PLANS.pro.productId!}>Get Pro</CheckoutButton>
                  )}
                </div>
              )}
              {PLANS.business.productId && (
                <div className="space-y-2 rounded-lg border p-4">
                  <p className="font-medium">{PLANS.business.name}</p>
                  <p className="text-2xl font-bold">
                    ${(PLANS.business.price / 100).toFixed(0)}
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Unlimited credits</p>
                  {subscription ? (
                    <UpgradeButton productId={PLANS.business.productId!} variant="outline">
                      Switch to Business
                    </UpgradeButton>
                  ) : (
                    <CheckoutButton productId={PLANS.business.productId!} variant="outline">
                      Get Business
                    </CheckoutButton>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
