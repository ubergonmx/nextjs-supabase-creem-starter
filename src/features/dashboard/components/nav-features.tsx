'use client';

import Link from 'next/link';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { IconDots, IconEyeOff, IconPin } from '@tabler/icons-react';

export function NavFeatures({
  items,
  label = 'Features',
}: {
  items: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
  label?: string;
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton render={<Link href={item.url} />}>
                {item.icon}
                <span>{item.name}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<SidebarMenuAction showOnHover className="aria-expanded:bg-muted" />}
                >
                  <IconDots />
                  <span className="sr-only">Feature actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem>
                    <IconPin />
                    <span>Pin</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconEyeOff />
                    <span>Hide</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
