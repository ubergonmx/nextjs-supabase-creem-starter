import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="py-16 md:py-32" style={{ contentVisibility: 'auto' }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-4xl font-semibold text-balance lg:text-5xl">
            Start building your SaaS today
          </h2>
          <p className="mt-4">
            Clone, configure, and ship in hours with Next.js, Supabase, and Creem pre-wired.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button size="lg" render={<Link href="/login" />} nativeButton={false}>
              <span>Get Started</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              render={<Link href="https://github.com/ubergonmx/nextjs-supabase-creem-starter" />}
              nativeButton={false}
            >
              <span>View on Github</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
