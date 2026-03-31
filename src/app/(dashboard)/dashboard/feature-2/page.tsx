import type { Metadata } from 'next';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { ProGate } from '@/features/pro-showcase/components/pro-gate';
import { AnalyticsContent } from '@/features/pro-showcase/components/analytics-content';
import { getUserSubscription } from '@/features/billing/actions/subscription';
import { PLANS } from '@/features/billing/types';

export const metadata: Metadata = {
  title: 'Advanced Analytics',
  description: 'Premium analytics and conversion insights — Pro and Business plans only.',
};

export default async function AdvancedAnalyticsPage() {
  const subscription = await getUserSubscription();

  const isActive =
    subscription?.status === 'active' || subscription?.status === 'trialing';

  const isPro =
    isActive &&
    (subscription?.planId === PLANS.pro.productId ||
      subscription?.planId === PLANS.business.productId);

  return (
    <>
      <SiteHeader title="Advanced Analytics" />
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {!isPro && (
            <p className="text-sm text-muted-foreground">
              A preview of the premium analytics available on{' '}
              <strong className="text-foreground">Pro</strong> and{' '}
              <strong className="text-foreground">Business</strong> plans.
            </p>
          )}
          <ProGate isLocked={!isPro}>
            <AnalyticsContent />
          </ProGate>
        </div>
      </div>
    </>
  );
}
