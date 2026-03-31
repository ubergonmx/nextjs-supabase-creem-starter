'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  IconDotsVertical,
  IconUserCircle,
  IconCreditCard,
  IconLogout,
  IconSun,
  IconMoon,
  IconDeviceDesktop,
} from '@tabler/icons-react';
import { logout } from '@/features/auth/actions/auth';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

type PlanName = 'Free' | 'Starter' | 'Pro' | 'Business';

function PlanBadge({ planName }: { planName: PlanName }) {
  if (planName === 'Free') return null;
  return (
    <Badge
      variant={planName === 'Business' ? 'default' : 'secondary'}
      className="shrink-0 px-1.5 py-0 text-[10px] leading-4"
    >
      {planName}
    </Badge>
  );
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
    planName: PlanName;
  };
}) {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />}
          >
            <Avatar className="size-8 rounded-lg grayscale">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="flex min-w-0 items-center gap-1.5">
                <span className="truncate font-medium">{user.name}</span>
                <PlanBadge planName={user.planName} />
              </div>
              <span className="truncate text-xs text-foreground/70">{user.email}</span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate font-medium">{user.name}</span>
                      <PlanBadge planName={user.planName} />
                    </div>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/dashboard/settings/account" />}>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/dashboard/settings/billing" />}>
                <IconCreditCard />
                Billing &amp; Usage
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-sm text-muted-foreground">Theme</span>
              <div className="flex rounded-md border">
                {(
                  [
                    { value: 'light', Icon: IconSun, label: 'Light' },
                    { value: 'dark', Icon: IconMoon, label: 'Dark' },
                    { value: 'system', Icon: IconDeviceDesktop, label: 'System' },
                  ] as const
                ).map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    title={label}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center transition-colors first:rounded-l-sm last:rounded-r-sm',
                      theme === value
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-3.5" />
                  </button>
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />
            <form action={logout}>
              <DropdownMenuItem nativeButton render={<button type="submit" className="w-full" />}>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
