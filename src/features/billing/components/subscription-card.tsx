import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SubscriptionActions } from './subscription-actions';
import { planNameFromId } from '@/features/billing/types';
import type { Subscription } from '@/features/billing/types';
import { PLANS } from '@/features/billing/types';
import Link from 'next/link';

type Props = {
  subscription: Subscription | null;
  creditsBalance: number;
};

function statusVariant(
  status: Subscription['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'trialing':
      return 'secondary';
    case 'canceled':
    case 'past_due':
      return 'destructive';
    default:
      return 'outline';
  }
}

function formatStatus(status: Subscription['status']): string {
  const labels: Record<Subscription['status'], string> = {
    active: 'Active',
    trialing: 'Trialing',
    canceled: 'Canceled',
    past_due: 'Past Due',
    incomplete: 'Incomplete',
    paused: 'Paused',
  };
  return labels[status] ?? status;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function SubscriptionCard({ subscription, creditsBalance }: Props) {
  const isActive =
    subscription && (subscription.status === 'active' || subscription.status === 'trialing');

  const isUnlimited =
    isActive && subscription?.planId === process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID_BUSINESS;

  const planName = planNameFromId(isActive ? (subscription?.planId ?? null) : null);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Subscription card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Subscription</CardTitle>
            {subscription ? (
              <Badge variant={statusVariant(subscription.status)}>
                {formatStatus(subscription.status)}
              </Badge>
            ) : (
              <Badge variant="secondary">{planName}</Badge>
            )}
          </div>
          <CardDescription>{planName} plan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {subscription && isActive && (
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                Current period:{' '}
                <span className="text-foreground">
                  {formatDate(subscription.currentPeriodStart)} &rarr;{' '}
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
              </p>
              {subscription.cancelAtPeriodEnd && (
                <p className="rounded-md bg-yellow-50 px-3 py-1.5 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                  &#9888; Cancels at end of current period
                </p>
              )}
            </div>
          )}
          {subscription ? (
            <SubscriptionActions subscription={subscription} />
          ) : (
            <div className="flex flex-wrap gap-2">
              {PLANS.pro.productId && (
                <Button size="sm" render={<Link href="/pricing" />} nativeButton={false}>
                  Upgrade to Pro
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Credits card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Credits</CardTitle>
          <CardDescription>Available to use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-3xl font-bold">
            {isUnlimited ? '∞' : creditsBalance.toLocaleString()}
          </p>
          <Button
            size="sm"
            variant="outline"
            render={<Link href="/dashboard/settings/billing" />}
            nativeButton={false}
          >
            View details
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
