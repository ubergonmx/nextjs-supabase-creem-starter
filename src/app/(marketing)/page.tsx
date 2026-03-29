import type { Metadata } from 'next'
import FeaturesSection from '@/features/landing/components/features-section'
import HeroSection from '@/features/landing/components/hero-section'

export const metadata: Metadata = {
  title: 'Next.js + Supabase + Creem Starter',
  description:
    'Launch your SaaS faster with prebuilt auth, billing, subscriptions, and credits.',
}

export default function Page() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  )
}
