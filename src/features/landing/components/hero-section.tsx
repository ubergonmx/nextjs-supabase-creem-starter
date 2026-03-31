import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { TextEffect } from '@/components/ui/text-effect';
import { AnimatedGroup } from '@/components/ui/animated-group';
import { LogoBar } from './logo-bar';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring' as const,
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <div aria-hidden className="absolute inset-0 isolate hidden contain-strict lg:block">
          <div className="absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
          <div className="absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
        <section>
          <div className="relative pt-24">
            <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
            <div className="mx-auto max-w-5xl px-6">
              <div className="sm:mx-auto lg:mt-0 lg:mr-auto">
                <TextEffect
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  as="h1"
                  className="mt-8 max-w-2xl text-5xl font-medium text-balance md:text-6xl lg:mt-16"
                >
                  Ship Your SaaS in Days, Not Months
                </TextEffect>
                <TextEffect
                  per="line"
                  preset="fade-in-blur"
                  speedSegment={0.3}
                  delay={0.5}
                  as="p"
                  className="mt-8 max-w-2xl text-lg text-pretty"
                >
                  A production-ready Next.js starter with Supabase auth, Creem payments, and a
                  credits system — pre-wired so you can focus on building your product.
                </TextEffect>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.05,
                          delayChildren: 0.75,
                        },
                      },
                    },
                    ...transitionVariants,
                  }}
                  className="mt-12 flex flex-wrap items-center gap-3"
                >
                  <Button
                    key={1}
                    size="lg"
                    className="rounded-xl px-6 text-base shadow-lg shadow-primary/20"
                    render={<Link href="/login" />}
                    nativeButton={false}
                  >
                    <span className="text-nowrap">Start Building</span>
                    <IconArrowRight className="ml-2 size-4" />
                  </Button>
                  <Button
                    key={2}
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-6 text-base"
                    render={<Link href="/pricing" transitionTypes={['same-layout']} />}
                    nativeButton={false}
                  >
                    <span className="text-nowrap">View Pricing</span>
                  </Button>
                </AnimatedGroup>
              </div>
            </div>
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
            >
              <div className="relative mt-8 -mr-56 overflow-hidden mask-b-from-55% px-2 sm:mt-12 sm:mr-0 md:mt-20">
                <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border bg-background p-4 shadow-lg ring-1 inset-shadow-2xs shadow-zinc-950/15 ring-background dark:inset-shadow-white/20">
                  <Image
                    className="relative hidden aspect-15/8 rounded-2xl bg-background dark:block"
                    src="/landing/mail2.webp"
                    alt="app screen"
                    width="2700"
                    height="1440"
                    priority
                  />
                  <Image
                    className="relative z-2 aspect-15/8 rounded-2xl border border-border/25 dark:hidden"
                    src="/landing/mail2-light.webp"
                    alt="app screen"
                    width="2700"
                    height="1440"
                    priority
                  />
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>
        <LogoBar />
      </main>
    </>
  );
}
