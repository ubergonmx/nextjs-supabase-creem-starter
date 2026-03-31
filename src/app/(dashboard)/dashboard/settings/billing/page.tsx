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
import { PLANS } from '@/features/billing/types';

export const metadata: Metadata = {
  title: 'Billing & Usage',
  description: 'Manage your subscription, billing details, and credit usage.',
};

type PlanAction = {
  label: string;
  disabled: boolean;
};

function getPlanAction(
  currentPlanId: string | null,
  targetProductId: string,
  targetPrice: number,
  targetName: string,
): PlanAction {
  if (currentPlanId === targetProductId) {
    return { label: 'Current Plan', disabled: true };
  }
  const currentPrice =
    currentPlanId === PLANS.business.productId
      ? PLANS.business.price
      : currentPlanId === PLANS.pro.productId
        ? PLANS.pro.price
        : 0;
  const label =
    currentPrice > targetPrice ? `Downgrade to ${targetName}` : `Upgrade to ${targetName}`;
  return { label, disabled: false };
}

export default async function BillingPage() {
  const [subscription, creditsBalance, transactions] = await Promise.all([
    getUserSubscription(),
    getCreditsBalance(),
    getCreditTransactions(50),
  ]);

  const currentPlanId = subscription?.planId ?? null;

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
      <SubscriptionCard subscription={subscription} creditsBalance={creditsBalance} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Plans</CardTitle>
          <CardDescription>Upgrade or change your plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Free plan */}
            <div className="space-y-2 rounded-lg border p-4">
              <p className="font-medium">{PLANS.free.name}</p>
              <p className="text-2xl font-bold">
                $0<span className="text-sm font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {PLANS.free.credits.toLocaleString()} credits/month
              </p>
              <Button className="w-full" variant="outline" disabled>
                {!subscription ? 'Current Plan' : 'Free Plan'}
              </Button>
            </div>

            {/* Pro plan */}
            {PLANS.pro.productId && proPlan && (
              <div className="space-y-2 rounded-lg border p-4">
                <p className="font-medium">{PLANS.pro.name}</p>
                <p className="text-2xl font-bold">
                  ${(PLANS.pro.price / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  {PLANS.pro.credits.toLocaleString()} credits/month
                </p>
                {proPlan.disabled ? (
                  <Button className="w-full" disabled>
                    {proPlan.label}
                  </Button>
                ) : subscription ? (
                  <UpgradeButton productId={PLANS.pro.productId!}>{proPlan.label}</UpgradeButton>
                ) : (
                  <CheckoutButton productId={PLANS.pro.productId!}>{proPlan.label}</CheckoutButton>
                )}
              </div>
            )}

            {/* Business plan */}
            {PLANS.business.productId && businessPlan && (
              <div className="space-y-2 rounded-lg border p-4">
                <p className="font-medium">{PLANS.business.name}</p>
                <p className="text-2xl font-bold">
                  ${(PLANS.business.price / 100).toFixed(0)}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground">Unlimited credits</p>
                {businessPlan.disabled ? (
                  <Button className="w-full" disabled>
                    {businessPlan.label}
                  </Button>
                ) : subscription ? (
                  <UpgradeButton productId={PLANS.business.productId!} variant="outline">
                    {businessPlan.label}
                  </UpgradeButton>
                ) : (
                  <CheckoutButton productId={PLANS.business.productId!} variant="outline">
                    {businessPlan.label}
                  </CheckoutButton>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CreditsBalanceCard balance={creditsBalance} />
      <TransactionHistory transactions={transactions} />
    </div>
  );
}
