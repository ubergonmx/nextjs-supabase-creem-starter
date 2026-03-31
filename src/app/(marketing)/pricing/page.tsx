import type { Metadata } from 'next';
import { PricingSection } from '@/features/billing/components/pricing-section';
import { FaqsSection } from '@/features/billing/components/faqs-section';
import { getUserSubscription } from '@/features/billing/actions/subscription';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple plans for side projects, growing SaaS products, and teams.',
};

export default async function PricingPage() {
  const subscription = await getUserSubscription();
  const isActiveSub =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const currentPlanId = isActiveSub ? (subscription?.planId ?? null) : null;

  return (
    <>
      <PricingSection currentPlanId={currentPlanId} isActiveSub={isActiveSub ?? false} />
      <FaqsSection />
    </>
  );
}
