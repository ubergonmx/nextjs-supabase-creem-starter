import type { Metadata } from 'next';
import { getUser } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/features/dashboard/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ProgressProvider } from '@/components/progress-provider';
import { getUserSubscription } from '@/features/billing/actions/subscription';
import { planNameFromId } from '@/features/billing/types';

export const metadata: Metadata = {
  title: {
    template: '%s | Dashboard | CreemKit',
    default: 'Dashboard | CreemKit',
  },
  description: 'Private dashboard for managing subscriptions, credits, and product data.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, subscription] = await Promise.all([getUser(), getUserSubscription()]);

  if (!user) redirect('/login');
  const isActiveSub =
    subscription?.status === 'active' || subscription?.status === 'trialing';
  const planName = planNameFromId(isActiveSub ? (subscription?.planId ?? null) : null) as
    | 'Free'
    | 'Starter'
    | 'Pro'
    | 'Business';

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        user={{
          name: (user.user_metadata?.full_name as string) ?? user.email ?? '',
          email: user.email ?? '',
          avatar: (user.user_metadata?.avatar_url as string) ?? '',
          planName,
        }}
      />
      <SidebarInset>
        <ProgressProvider>{children}</ProgressProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
