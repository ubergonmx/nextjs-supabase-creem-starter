"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/features/dashboard/components/nav-main";
import { NavSecondary } from "@/features/dashboard/components/nav-secondary";
import { NavUser } from "@/features/dashboard/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconSettings,
  IconHelp,
  IconCreditCard,
  IconCoins,
  IconInnerShadowTop,
} from "@tabler/icons-react";

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <IconDashboard />,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: <IconCreditCard />,
  },
  {
    title: "Credits",
    url: "/dashboard/credits",
    icon: <IconCoins />,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <IconSettings />,
  },
];

const navSecondary = [
  {
    title: "Get Help",
    url: "#",
    icon: <IconHelp />,
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
              render={
                <Link href="/dashboard">
                  <span className="sr-only">Dashboard</span>
                </Link>
              }
            >
              <IconInnerShadowTop className="size-5!" />
              <span className="text-base font-semibold">CreemKit</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
