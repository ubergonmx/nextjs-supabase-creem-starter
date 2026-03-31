'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: React.ReactNode;
    onClick?: () => void;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) =>
            item.onClick ? (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton onClick={item.onClick}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ),
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
