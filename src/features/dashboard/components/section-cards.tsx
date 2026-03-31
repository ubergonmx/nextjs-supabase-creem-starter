'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  IconCoins,
  IconCreditCard,
  IconCircleCheck,
  IconCalendarEvent,
  IconAlertCircle,
} from '@tabler/icons-react';

type SectionCardsProps = {
  creditsBalance: number;
  isUnlimited: boolean;
  planName: string;
  isActive: boolean;
  subscriptionStatus: string | null;
  nextRenewal: string | null;
};

function formatRenewalDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function SectionCards({
  creditsBalance,
  isUnlimited,
  planName,
  isActive,
  subscriptionStatus,
  nextRenewal,
}: SectionCardsProps) {
  const days = daysUntil(nextRenewal);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {/* Credit Balance */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Credit Balance</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {isUnlimited ? '∞' : creditsBalance.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCoins />
              Credits
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isUnlimited ? 'Unlimited usage' : 'Available to use'}
          </div>
          <div className="text-muted-foreground">
            {isUnlimited ? 'Business plan benefit' : 'Spend on any feature'}
          </div>
        </CardFooter>
      </Card>

      {/* Current Plan */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Current Plan</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {planName}
          </CardTitle>
          <CardAction>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              <IconCreditCard />
              {isActive ? 'Paid' : 'Free tier'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isActive ? 'Subscription active' : 'No active subscription'}
          </div>
          <div className="text-muted-foreground">
            {isActive ? 'Manage on billing page' : 'Upgrade for more credits'}
          </div>
        </CardFooter>
      </Card>

      {/* Plan Status */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Plan Status</CardDescription>
          <CardTitle className="text-2xl font-semibold capitalize @[250px]/card:text-3xl">
            {subscriptionStatus ?? 'Free'}
          </CardTitle>
          <CardAction>
            <Badge variant={isActive ? 'outline' : 'secondary'}>
              {isActive ? (
                <IconCircleCheck className="text-green-500" />
              ) : (
                <IconAlertCircle className="text-muted-foreground" />
              )}
              {isActive ? 'Healthy' : 'Inactive'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isActive ? 'All features unlocked' : 'Limited feature access'}
          </div>
          <div className="text-muted-foreground">
            {isActive ? 'Subscription in good standing' : 'Subscribe to unlock all features'}
          </div>
        </CardFooter>
      </Card>

      {/* Next Renewal */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Next Renewal</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            {nextRenewal
              ? new Date(nextRenewal).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : '—'}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCalendarEvent />
              {days !== null ? `${days}d` : 'N/A'}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {nextRenewal ? formatRenewalDate(nextRenewal) : 'No renewal scheduled'}
          </div>
          <div className="text-muted-foreground">
            {isActive ? 'Renews automatically' : 'Subscribe to get a renewal date'}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
