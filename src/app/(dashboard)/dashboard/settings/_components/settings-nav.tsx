'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const tabs = [
  { label: 'Account', href: '/dashboard/settings/account' },
  { label: 'Billing & Usage', href: '/dashboard/settings/billing' },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-0 border-b">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
            pathname === tab.href || pathname.startsWith(tab.href + '/')
              ? 'border-foreground text-foreground'
              : 'border-transparent text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
