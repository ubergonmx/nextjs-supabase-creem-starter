import type { Metadata } from 'next';
import { ViewTransition } from 'react';
import { Header } from '@/components/header';
import { CallToAction } from '@/features/landing/components/call-to-action';
import { FooterSection } from '@/features/landing/components/footer-section';

export const metadata: Metadata = {
  title: {
    template: '%s | CreemKit',
    default: 'CreemKit',
  },
  description:
    'Production-ready Next.js starter with Supabase auth and Creem payments pre-integrated.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ViewTransition>{children}</ViewTransition>
      <CallToAction />
      <FooterSection />
    </>
  );
}
