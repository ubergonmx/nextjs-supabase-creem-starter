import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { CreemFull } from './svg/creem'
import { BaseUI } from './svg/baseui'
import { OXCFull } from './svg/oxc'
import { ShadcnFull } from './svg/shadcn'
import { NextjsFull } from './svg/nextjs'
import { SupabaseFull } from './svg/supabase'
import { VercelFull } from './svg/vercel'

export function LogoBar() {
  return (
    <section className="overflow-hidden bg-background py-16">
      <div className="group relative m-auto max-w-5xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:max-w-44 md:border-r md:pr-6">
            <p className="text-end text-sm font-medium text-foreground">Powered by the best</p>
          </div>
          <div className="relative py-6 **:fill-foreground md:w-[calc(100%-11rem)]">
            <InfiniteSlider speedOnHover={20} speed={40} gap={80}>
              <NextjsFull style={{ height: 24, width: 118, flexShrink: 0, alignSelf: 'center' }} />
              <VercelFull style={{ height: 24, width: 123, flexShrink: 0, alignSelf: 'center' }} />
              <SupabaseFull
                style={{ height: 24, width: 121, flexShrink: 0, alignSelf: 'center' }}
              />
              <CreemFull style={{ height: 24, width: 111, flexShrink: 0, alignSelf: 'center' }} />
              <BaseUI style={{ height: 32, width: 23, flexShrink: 0, alignSelf: 'center' }} />
              <OXCFull style={{ height: 18, width: 98, flexShrink: 0, alignSelf: 'center' }} />
              <ShadcnFull style={{ height: 24, width: 82, flexShrink: 0, alignSelf: 'center' }} />
            </InfiniteSlider>

            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background"
            />
            <ProgressiveBlur
              className="pointer-events-none absolute top-0 left-0 h-full w-20"
              direction="left"
              blurIntensity={1}
            />
            <ProgressiveBlur
              className="pointer-events-none absolute top-0 right-0 h-full w-20"
              direction="right"
              blurIntensity={1}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
