import { Button } from '@/components/ui/button';
import { IconLock, IconCrown } from '@tabler/icons-react';
import Link from 'next/link';

type ProGateProps = {
  isLocked: boolean;
  requiredPlan?: 'Pro' | 'Business';
  children: React.ReactNode;
};

export function ProGate({ isLocked, requiredPlan = 'Pro', children }: ProGateProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred preview of the content */}
      <div className="pointer-events-none select-none blur-sm" aria-hidden>
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center ring-1 ring-foreground/10 shadow-xl">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
            <IconLock className="size-6 text-primary" stroke={1.5} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {requiredPlan}+ Required
            </h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Upgrade to <strong className="text-foreground">{requiredPlan}</strong> or{' '}
              <strong className="text-foreground">Business</strong> to unlock Advanced Analytics and
              premium insights.
            </p>
          </div>
          <Button render={<Link href="/dashboard/settings/billing" />} nativeButton={false} className="gap-2 w-full">
            <IconCrown className="size-4" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
}
