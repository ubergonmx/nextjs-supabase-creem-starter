import type { Metadata } from 'next'
import FeaturesSection from '@/features/landing/components/features-section'
import HeroSection from '@/features/landing/components/hero-section'

export const metadata: Metadata = {
  title: 'CreemKit - The Next.js supabase creem starter',
}

export default function Page() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
    </>
  )
}
