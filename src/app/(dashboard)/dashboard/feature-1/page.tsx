import type { Metadata } from 'next';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { SummarizeForm } from '@/features/summarizer/components/summarize-form';
import { getCreditsBalance } from '@/features/credits/actions/credits';
import { getUserSubscription } from '@/features/billing/actions/subscription';

export const metadata: Metadata = {
  title: 'AI Summarizer',
  description: 'Summarize any text using AI. Each request costs 1 credit.',
};

export default async function AISummarizerPage() {
  const [balance, subscription] = await Promise.all([
    getCreditsBalance(),
    getUserSubscription(),
  ]);

  const isActive =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const isUnlimited =
    isActive && subscription?.planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS;

  return (
    <>
      <SiteHeader title="AI Summarizer" />
      <div className="flex flex-1 flex-col p-4 md:p-6">
        <SummarizeForm initialBalance={balance} isUnlimited={!!isUnlimited} />
      </div>
    </>
  );
}
