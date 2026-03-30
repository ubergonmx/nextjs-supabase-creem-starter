import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { FooterSection } from '@/features/landing/components/footer-section';

export const metadata: Metadata = {
  title: {
    template: '%s | Legal | CreemKit',
    default: 'Legal | CreemKit',
  },
  description: 'Legal documents for CreemKit, including privacy policy and terms of service.',
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-3xl px-4 py-28 lg:pt-44 lg:pb-32">
        <article className="prose prose-lg dark:prose-invert">{children}</article>
      </section>
      <FooterSection />
    </>
  );
}
