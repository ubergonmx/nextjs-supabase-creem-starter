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
  IconDashboard,
  IconSettings,
  IconHelp,
  IconCreditCard,
  IconCoins,
  IconCalendarWeek,
  IconMessageCircleUser,
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
    url: '/dashboard/billing',
    icon: <IconCreditCard />,
  },
  {
    title: 'Credits',
    url: '/dashboard/credits',
    icon: <IconCoins />,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: <IconSettings />,
  },
];

const navSecondary = [
  {
    title: 'Get Help',
    url: '#',
    icon: <IconHelp />,
  },
];

const navFeatures = [
  {
    name: 'Feature 1',
    url: '#',
    icon: <IconMessageCircleUser />,
  },
  {
    name: 'Feature 2',
    url: '#',
    icon: <IconCalendarWeek />,
  },
];

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
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
  );
}
