'use client';

import * as React from 'react';
import Link from 'next/link';

import { NavMain } from '@/features/dashboard/components/nav-main';
import { NavFeatures } from './nav-features';
import { NavSecondary } from '@/features/dashboard/components/nav-secondary';
import { NavUser } from '@/features/dashboard/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogMedia,
} from '@/components/ui/alert-dialog';
import {
  IconDashboard,
  IconHelp,
  IconCreditCard,
  IconSparkles,
  IconChartBar,
} from '@tabler/icons-react';
import { Logo } from '@/components/logo';

const navMain = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: <IconDashboard />,
  },
  {
    title: 'Billing',
    url: '/dashboard/settings/billing',
    icon: <IconCreditCard />,
  },
];

const navFeatures = [
  {
    name: 'AI Summarizer',
    url: '/dashboard/feature-1',
    icon: <IconSparkles />,
  },
  {
    name: 'Analytics',
    url: '/dashboard/feature-2',
    icon: <IconChartBar />,
  },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar: string;
    planName: 'Free' | 'Starter' | 'Pro' | 'Business';
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [helpOpen, setHelpOpen] = React.useState(false);

  const navSecondary = [
    {
      title: 'Get Help',
      url: '#',
      icon: <IconHelp />,
      onClick: () => setHelpOpen(true),
    },
  ];

  return (
    <>
      <Sidebar collapsible="offcanvas" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<Link href="/dashboard" />}
              >
                <Logo className="[&>svg]:h-auto [&>svg]:w-28" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
          <NavFeatures items={navFeatures} />
          <NavSecondary items={navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      <AlertDialog open={helpOpen} onOpenChange={setHelpOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <IconSparkles />
            </AlertDialogMedia>
            <AlertDialogTitle>You&apos;re in demo mode</AlertDialogTitle>
            <AlertDialogDescription>
              This is a demo. When testing payments, use Creem&apos;s test card number{' '}
              <strong className="font-semibold text-foreground">4242 4242 4242 4242</strong> and
              enter discount code{' '}
              <strong className="font-semibold text-foreground">CREEMKIT2026</strong> when you
              upgrade.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setHelpOpen(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
