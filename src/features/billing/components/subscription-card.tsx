import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SubscriptionActions } from './subscription-actions';
import { planNameFromId } from '@/features/billing/types';
import type { Subscription } from '@/features/billing/types';
import Link from 'next/link';

type Props = {
  subscription: Subscription | null;
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

export function SubscriptionCard({ subscription }: Props) {
  const isActive =
    subscription && (subscription.status === 'active' || subscription.status === 'trialing');

  const planName = planNameFromId(isActive ? (subscription?.planId ?? null) : null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subscription</CardTitle>
        <CardDescription>{planName} plan</CardDescription>
        <CardAction>
          {subscription ? (
            <Badge variant={statusVariant(subscription.status)}>
              {formatStatus(subscription.status)}
            </Badge>
          ) : (
            <Badge variant="secondary">Free</Badge>
          )}
        </CardAction>
      </CardHeader>

      {subscription && isActive && (
        <CardContent className="space-y-3">
          {/* Period dates — 2-col grid so dates never wrap */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Period start</p>
              <p className="text-sm font-medium">{formatDate(subscription.currentPeriodStart)}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Renews on</p>
              <p className="text-sm font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
            </div>
          </div>

          {subscription.cancelAtPeriodEnd && (
            <p className="rounded-md bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              &#9888;&#xFE0E; Cancels at end of current billing period
            </p>
          )}
        </CardContent>
      )}

      <CardFooter className="mt-auto">
        {subscription ? (
          <SubscriptionActions subscription={subscription} />
        ) : (
          <Button size="sm" variant="outline" render={<Link href="/pricing" />} nativeButton={false}>
            View Plans
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
