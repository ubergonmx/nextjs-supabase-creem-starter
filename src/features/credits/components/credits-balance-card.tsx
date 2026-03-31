import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CreditTransaction } from '@/features/credits/types';
import { IconCoins } from '@tabler/icons-react';

function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function CreditsBalanceCard({
  balance,
  isUnlimited = false,
  lastTransaction,
}: {
  balance: number;
  isUnlimited?: boolean;
  lastTransaction?: CreditTransaction | null;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>Credit Balance</CardDescription>
        <CardTitle className="text-4xl font-bold tracking-tight tabular-nums @[250px]/card:text-5xl">
          {isUnlimited ? '∞' : balance.toLocaleString()}
        </CardTitle>
        <CardAction>
          <Badge variant="outline" className="font-normal">
            <IconCoins />
            Credits
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-start gap-1 text-sm">
        {lastTransaction ? (
          <>
            <p className="font-medium">
              {lastTransaction.amount > 0 ? '+' : ''}
              {lastTransaction.amount.toLocaleString()} &mdash;{' '}
              {lastTransaction.description ?? lastTransaction.type}
            </p>
            <p className="text-muted-foreground">
              Last activity {formatRelativeDate(lastTransaction.createdAt)}
            </p>
          </>
        ) : (
          <p className="text-muted-foreground">No credit activity yet</p>
        )}
      </CardFooter>
    </Card>
  );
}
