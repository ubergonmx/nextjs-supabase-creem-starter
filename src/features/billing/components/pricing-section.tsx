import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { IconCheck } from '@tabler/icons-react'
import { CheckoutButton } from '@/features/billing/components/checkout-button'

export function PricingSection() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold lg:text-5xl">Pricing</h1>
          <p className="max-w-2xl text-muted-foreground">
            Simple, transparent pricing. Start free and upgrade as you grow — no hidden fees.
          </p>
        </div>

        <div className="mt-8 grid gap-6 [--color-card:var(--color-muted)] *:border-none *:shadow-none md:mt-20 md:grid-cols-3 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="flex flex-col bg-muted">
            <CardHeader>
              <CardTitle className="font-medium">Free</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
              <CardDescription className="text-sm">For side projects and testing</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  'Supabase auth (email + OAuth)',
                  '100 credits included',
                  'Community support',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <IconCheck size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto border-t-0 bg-transparent">
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/signup" />}
                nativeButton={false}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>

          <Card className="relative flex flex-col overflow-visible bg-muted">
            <span className="absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 px-3 py-1 text-xs font-semibold text-amber-950 shadow-sm">
              Popular
            </span>
            <CardHeader>
              <CardTitle className="font-medium">Pro</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$19 / mo</span>
              <CardDescription className="text-sm">For growing SaaS products</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />
              <ul className="list-outside space-y-3 text-sm">
                {[
                  'Everything in Free',
                  '5,000 credits / month',
                  'Custom domain support',
                  'Webhook event logs',
                  'Priority email support',
                  'Role-based access control',
                  'Usage analytics dashboard',
                  'API rate limit increase',
                  'Monthly product updates',
                  'Advanced security features',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <IconCheck size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto border-t-0 bg-transparent">
              <CheckoutButton productId={process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_PRO ?? ""}>
                Get Started
              </CheckoutButton>
            </CardFooter>
          </Card>

          <Card className="flex flex-col bg-muted">
            <CardHeader>
              <CardTitle className="font-medium">Business</CardTitle>
              <span className="my-3 block text-2xl font-semibold">$29 / mo</span>
              <CardDescription className="text-sm">For teams and agencies</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <hr className="border-dashed" />

              <ul className="list-outside space-y-3 text-sm">
                {[
                  'Everything in Pro',
                  'Unlimited credits',
                  'Dedicated support channel',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <IconCheck size={12} />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="mt-auto border-t-0 bg-transparent">
              <CheckoutButton
                productId={process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS ?? ""}
                variant="outline"
              >
                Get Started
              </CheckoutButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
