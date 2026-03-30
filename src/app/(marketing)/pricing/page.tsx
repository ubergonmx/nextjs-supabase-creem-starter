import type { Metadata } from 'next';
import { PricingSection } from '@/features/billing/components/pricing-section';
import { FaqsSection } from '@/features/billing/components/faqs-section';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple plans for side projects, growing SaaS products, and teams.',
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <FaqsSection />
    </>
  );
}
