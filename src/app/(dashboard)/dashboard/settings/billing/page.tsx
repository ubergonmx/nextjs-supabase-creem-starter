import type { Metadata } from 'next';
import { getUserSubscription } from '@/features/billing/actions/subscription';
import { getCreditsBalance, getCreditTransactions } from '@/features/credits/actions/credits';
import { SubscriptionCard } from '@/features/billing/components/subscription-card';
import { CreditsBalanceCard } from '@/features/credits/components/credits-balance-card';
import { TransactionHistory } from '@/features/credits/components/transaction-history';
import { CheckoutButton } from '@/features/billing/components/checkout-button';
import { UpgradeButton } from '@/features/billing/components/upgrade-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UrlToast } from '@/components/url-toast';
import { CheckoutSuccessToast } from '@/features/billing/components/checkout-success-toast';
import { PLANS, getPlanAction } from '@/features/billing/types';
import { BILLING_ERRORS } from '@/features/billing/errors';
import { resolveError } from '@/lib/errors';

export const metadata: Metadata = {
  title: 'Billing & Usage',
  description: 'Manage your subscription, billing details, and credit usage.',
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; checkout?: string }>;
}) {
  const [{ error, checkout }, subscription, creditsBalance, transactions] = await Promise.all([
    searchParams,
    getUserSubscription(),
    getCreditsBalance(),
    getCreditTransactions(50),
  ]);

  const errorMessage = resolveError(error, BILLING_ERRORS);
  const isActiveSub =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const currentPlanId = isActiveSub ? (subscription?.planId ?? null) : null;
  const isUnlimited =
    isActiveSub && subscription?.planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS;

  const starterPlan = PLANS.starter.productId
    ? getPlanAction(currentPlanId, PLANS.starter.productId, PLANS.starter.price, PLANS.starter.name)
    : null;
  const proPlan = PLANS.pro.productId
    ? getPlanAction(currentPlanId, PLANS.pro.productId, PLANS.pro.price, PLANS.pro.name)
    : null;
  const businessPlan = PLANS.business.productId
    ? getPlanAction(
        currentPlanId,
        PLANS.business.productId,
        PLANS.business.price,
        PLANS.business.name,
      )
    : null;

  return (
    <div className="flex flex-col gap-6">
      {checkout === 'success' && <CheckoutSuccessToast />}
      {errorMessage && <UrlToast message={errorMessage} />}
      {/* Top row: subscription status + credit balance side by side */}
      <div className="grid gap-4 sm:grid-cols-2">
        <SubscriptionCard subscription={subscription} />
        <CreditsBalanceCard
          balance={creditsBalance}
          isUnlimited={isUnlimited}
          lastTransaction={transactions[0] ?? null}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Plans</CardTitle>
          <CardDescription>Upgrade or change your plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {PLANS.starter.productId && starterPlan && (
              <div className="flex flex-col gap-3 rounded-lg border p-4">
                <p className="font-medium">{PLANS.starter.name}</p>
                <p className="text-2xl font-bold">
                  ${(PLANS.starter.price / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="grow space-y-1 text-sm text-muted-foreground">
                  <li>250 credits / month</li>
                  <li>Webhook event logs</li>
                  <li>Email support</li>
                </ul>
                <div className="mt-auto">
                  {starterPlan.disabled ? (
                    <Button className="w-full" variant="outline" disabled>
                      {starterPlan.label}
                    </Button>
                  ) : isActiveSub ? (
                    <UpgradeButton productId={PLANS.starter.productId!} variant="outline">
                      {starterPlan.label}
                    </UpgradeButton>
                  ) : (
                    <CheckoutButton productId={PLANS.starter.productId!} variant="outline">
                      {starterPlan.label}
                    </CheckoutButton>
                  )}
                </div>
              </div>
            )}

            {PLANS.pro.productId && proPlan && (
              <div className="flex flex-col gap-3 rounded-lg border p-4">
                <p className="font-medium">{PLANS.pro.name}</p>
                <p className="text-2xl font-bold">
                  ${(PLANS.pro.price / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="grow space-y-1 text-sm text-muted-foreground">
                  <li>5,000 credits / month</li>
                  <li>Priority email support</li>
                  <li>Advanced security features</li>
                </ul>
                <div className="mt-auto">
                  {proPlan.disabled ? (
                    <Button className="w-full" disabled>
                      {proPlan.label}
                    </Button>
                  ) : isActiveSub ? (
                    <UpgradeButton productId={PLANS.pro.productId!}>{proPlan.label}</UpgradeButton>
                  ) : (
                    <CheckoutButton productId={PLANS.pro.productId!}>
                      {proPlan.label}
                    </CheckoutButton>
                  )}
                </div>
              </div>
            )}

            {PLANS.business.productId && businessPlan && (
              <div className="flex flex-col gap-3 rounded-lg border p-4">
                <p className="font-medium">{PLANS.business.name}</p>
                <p className="text-2xl font-bold">
                  ${(PLANS.business.price / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="grow space-y-1 text-sm text-muted-foreground">
                  <li>Unlimited credits</li>
                  <li>Dedicated support</li>
                  <li>SLA guarantee</li>
                </ul>
                <div className="mt-auto">
                  {businessPlan.disabled ? (
                    <Button className="w-full" disabled>
                      {businessPlan.label}
                    </Button>
                  ) : isActiveSub ? (
                    <UpgradeButton productId={PLANS.business.productId!} variant="outline">
                      {businessPlan.label}
                    </UpgradeButton>
                  ) : (
                    <CheckoutButton productId={PLANS.business.productId!} variant="outline">
                      {businessPlan.label}
                    </CheckoutButton>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TransactionHistory transactions={transactions} />
    </div>
  );
}
