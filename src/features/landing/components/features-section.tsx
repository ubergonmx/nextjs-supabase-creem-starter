import { Card } from '@/components/ui/card';
import {
  IconShieldLock,
  IconCreditCard,
  IconCoins,
  IconBrandGoogle,
  IconBrandGithub,
  IconMail,
  IconCheck,
  IconTrendingUp,
} from '@tabler/icons-react';

export default function FeaturesSection() {
  return (
    <section id="features" style={{ contentVisibility: 'auto' }}>
      <div className="py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 className="max-w-2xl text-4xl font-semibold text-balance text-foreground">
              Everything you need to launch and scale your SaaS
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="soft" className="overflow-hidden p-6">
              <IconShieldLock className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Auth &amp; User Management
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Supabase-powered authentication with email, and OAuth — ready out of the box.
              </p>

              <AuthIllustration />
            </Card>

            <Card variant="soft" className="group overflow-hidden px-6 pt-6">
              <IconCreditCard className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Payments &amp; Subscriptions
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Creem integration with checkout, webhooks, and subscription lifecycle fully wired
                up.
              </p>

              <CheckoutIllustration />
            </Card>

            <Card variant="soft" className="group overflow-hidden px-6 pt-6">
              <IconCoins className="size-5 text-primary" stroke={1.5} />
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                Credits &amp; Usage Tracking
              </h3>
              <p className="mt-3 text-balance text-muted-foreground">
                Built-in credits system with purchase, consumption, and balance tracking for
                usage-based billing.
              </p>

              <div className="-mx-2 -mt-2 mask-b-from-50 px-2 pt-2">
                <UsageIllustration />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

const AuthIllustration = () => {
  return (
    <Card aria-hidden className="mt-9 aspect-video p-4">
      <div className="mb-3 text-sm font-semibold">Sign in to your account</div>
      <div className="mb-3 space-y-2">
        <div className="flex h-7 items-center gap-2 rounded-md border bg-background px-2">
          <IconMail className="size-3.5 shrink-0 text-muted-foreground" stroke={1.5} />
          <div className="h-2 w-20 rounded-full bg-foreground/10" />
        </div>
        <div className="flex h-7 items-center gap-2 rounded-md border bg-background px-2">
          <div className="size-3.5 shrink-0 rounded-full border border-muted-foreground/30" />
          <div className="h-2 w-14 rounded-full bg-foreground/15" />
        </div>
      </div>
      <div className="mb-3 flex h-7 w-full items-center justify-center rounded-md bg-primary/90">
        <div className="h-2 w-12 rounded-full bg-primary-foreground/60" />
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted-foreground">or continue with</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="flex gap-2">
        <div className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border bg-background">
          <IconBrandGoogle className="size-3.5 text-muted-foreground" stroke={1.5} />
          <span className="text-[10px] text-muted-foreground">Google</span>
        </div>
        <div className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border bg-background">
          <IconBrandGithub className="size-3.5 text-muted-foreground" stroke={1.5} />
          <span className="text-[10px] text-muted-foreground">GitHub</span>
        </div>
      </div>
    </Card>
  );
};

const CheckoutIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-3 transition-transform duration-200 ease-in-out group-hover:-rotate-3">
        <div className="mb-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
          Order Summary
        </div>
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground">Pro Plan</span>
            <span className="text-xs font-medium">$29/mo</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Discount</span>
            <span className="text-xs font-medium text-green-500">−20%</span>
          </div>
        </div>
        <div className="mb-3 flex items-center justify-between border-t pt-2">
          <span className="text-xs font-semibold">Total</span>
          <span className="text-sm font-bold">$23.20</span>
        </div>
        <div className="flex h-6 w-full items-center justify-center gap-1.5 rounded-md bg-primary/90">
          <IconCheck className="size-3 text-primary-foreground" stroke={2.5} />
          <span className="text-[10px] font-medium text-primary-foreground">Pay now</span>
        </div>
      </Card>
      <Card className="absolute -top-4 right-0 flex aspect-3/5 w-2/5 translate-y-4 flex-col justify-between p-3 transition-transform duration-200 ease-in-out group-hover:rotate-3">
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-foreground/10" />
          <div className="h-1.5 w-3/4 rounded-full bg-foreground/10" />
          <div className="h-1.5 w-1/2 rounded-full bg-foreground/10" />
        </div>
        <div className="flex h-6 items-center justify-center rounded-md bg-primary/15">
          <IconCreditCard className="size-3.5 text-primary" stroke={1.5} />
        </div>
      </Card>
    </div>
  );
};

const UsageIllustration = () => {
  const usageItems = [
    { label: 'API calls', used: 4210, pct: 42 },
    { label: 'Storage', used: 2100, pct: 21 },
    { label: 'Exports', used: 2110, pct: 21 },
  ];

  return (
    <Card
      aria-hidden
      className="mt-6 aspect-video translate-y-4 p-4 pb-6 transition-transform duration-200 group-hover:translate-y-0"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Credits remaining</div>
          <div className="mt-0.5 flex items-end gap-1">
            <span className="text-xl font-bold">8,420</span>
            <span className="mb-0.5 text-xs text-muted-foreground">/ 10,000</span>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-md bg-green-500/10 px-1.5 py-0.5">
          <IconTrendingUp className="size-3 text-green-500" stroke={2} />
          <span className="text-[10px] font-medium text-green-500">84%</span>
        </div>
      </div>
      <div className="mb-4 h-1.5 rounded-full bg-foreground/10">
        <div className="h-1.5 rounded-full bg-primary" style={{ width: '84%' }} />
      </div>
      <div className="space-y-2">
        {usageItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-16 shrink-0 text-[10px] text-muted-foreground">{item.label}</span>
            <div className="h-1 flex-1 rounded-full bg-foreground/10">
              <div className="h-1 rounded-full bg-primary/60" style={{ width: `${item.pct}%` }} />
            </div>
            <span className="w-10 text-right text-[10px] font-medium tabular-nums">
              {item.used.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
