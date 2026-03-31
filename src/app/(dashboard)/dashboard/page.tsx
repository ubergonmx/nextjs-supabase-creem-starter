import type { Metadata } from 'next';
import { ChartAreaInteractive } from '@/features/dashboard/components/chart-area-interactive';
import { SectionCards } from '@/features/dashboard/components/section-cards';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { SubscriptionCard } from '@/features/billing/components/subscription-card';
import { CheckoutSuccessToast } from '@/features/billing/components/checkout-success-toast';
import { getUserSubscription } from '@/features/billing/actions/subscription';
import { getCreditsBalance } from '@/features/credits/actions/credits';
import { planNameFromId } from '@/features/billing/types';

export const metadata: Metadata = {
  title: 'Overview',
  description: 'View your key metrics, usage data, and recent activity.',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const [{ checkout }, subscription, creditsBalance] = await Promise.all([
    searchParams,
    getUserSubscription(),
    getCreditsBalance(),
  ]);

  const isActive =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const isUnlimited =
    isActive && subscription?.planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS;
  const planName = planNameFromId(isActive ? (subscription?.planId ?? null) : null);

  return (
    <>
      {checkout === 'success' && <CheckoutSuccessToast />}
      <SiteHeader title="Overview" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SubscriptionCard subscription={subscription} />
            </div>
            <SectionCards
              creditsBalance={creditsBalance}
              isUnlimited={isUnlimited ?? false}
              planName={planName}
              isActive={isActive ?? false}
              subscriptionStatus={subscription?.status ?? null}
              nextRenewal={subscription?.currentPeriodEnd ?? null}
            />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
