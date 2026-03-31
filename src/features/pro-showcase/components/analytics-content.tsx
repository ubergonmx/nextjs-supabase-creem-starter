import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  IconTrendingUp,
  IconUsers,
  IconActivity,
  IconArrowUpRight,
} from '@tabler/icons-react';

const stats = [
  {
    label: 'Conversion Rate',
    value: '8.4%',
    delta: '+2.1%',
    icon: IconTrendingUp,
    footer: 'Up from 6.3% last month',
    sub: 'Visitors to sign-ups',
  },
  {
    label: 'Active Users',
    value: '1,284',
    delta: '+142',
    icon: IconUsers,
    footer: '142 new users this month',
    sub: 'Logged in at least once',
  },
  {
    label: 'Avg. Session',
    value: '4m 32s',
    delta: '+18s',
    icon: IconActivity,
    footer: 'Up 7% vs. last month',
    sub: 'Across all devices',
  },
  {
    label: 'Revenue MoM',
    value: '$3,840',
    delta: '+$620',
    icon: IconArrowUpRight,
    footer: '$620 above last month',
    sub: 'Recurring + one-time',
  },
];

const funnelSteps = [
  { stage: 'Visitors', count: 12_400, pct: 100 },
  { stage: 'Sign-ups', count: 2_480, pct: 20 },
  { stage: 'Trial started', count: 992, pct: 8 },
  { stage: 'Converted to paid', count: 248, pct: 2 },
];

const topPages = [
  { path: '/dashboard', visits: 4_210, bounce: '18%' },
  { path: '/pricing', visits: 1_890, bounce: '41%' },
  { path: '/features', visits: 1_240, bounce: '33%' },
  { path: '/login', visits: 980, bounce: '12%' },
  { path: '/settings', visits: 640, bounce: '22%' },
];

export function AnalyticsContent() {
  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards — mirrors section-cards.tsx pattern */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4 *:data-[slot=card]:shadow-xs">
        {stats.map(({ label, value, delta, icon: Icon, footer, sub }) => (
          <Card key={label} className="@container/card">
            <CardHeader>
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <Icon />
                  {delta}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">{footer}</div>
              <div className="text-muted-foreground">{sub}</div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversion Funnel</CardTitle>
          <CardDescription>
            Visitor → Trial → Paid conversion over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelSteps.map(({ stage, count, pct }) => (
              <div key={stage} className="grid grid-cols-[10rem_1fr_auto] items-center gap-4">
                <span className="truncate text-sm text-muted-foreground">{stage}</span>
                <div className="h-2 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-2 rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex w-24 items-center justify-end gap-2">
                  <span className="text-sm font-medium tabular-nums">
                    {count.toLocaleString()}
                  </span>
                  <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
                    {pct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Pages</CardTitle>
          <CardDescription>Most visited pages in the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-8 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span>Page</span>
            <span className="text-right">Visits</span>
            <span className="w-16 text-right">Bounce</span>
          </div>
          <div className="divide-y">
            {topPages.map(({ path, visits, bounce }) => (
              <div
                key={path}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-x-8 py-2.5"
              >
                <span className="truncate text-sm font-medium">{path}</span>
                <span className="text-sm tabular-nums text-muted-foreground">
                  {visits.toLocaleString()}
                </span>
                <Badge
                  variant="outline"
                  className="w-16 justify-center font-normal tabular-nums"
                >
                  {bounce}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
