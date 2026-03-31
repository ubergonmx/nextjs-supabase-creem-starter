import type { Metadata } from 'next';
import { getUserSubscription } from '@/features/billing/actions/subscription';
import { PricingSection } from '@/features/billing/components/pricing-section';
import { FaqsSection } from '@/features/billing/components/faqs-section';
import { UrlToast } from '@/components/url-toast';
import { PRICING_ERRORS } from '@/features/billing/errors';
import { resolveError } from '@/lib/errors';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple plans for side projects, growing SaaS products, and teams.',
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, subscription] = await Promise.all([searchParams, getUserSubscription()]);
  const isActiveSub =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const currentPlanId = isActiveSub ? (subscription?.planId ?? null) : null;
  const errorMessage = resolveError(error, PRICING_ERRORS);

  return (
    <>
      {errorMessage && <UrlToast message={errorMessage} />}
      <PricingSection currentPlanId={currentPlanId} isActiveSub={isActiveSub ?? false} />
      <FaqsSection />
    </>
  );
}
