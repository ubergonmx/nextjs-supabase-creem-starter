import type { ReactNode } from 'react';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { SettingsNav } from './_components/settings-nav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <SettingsNav />
        {children}
      </div>
    </>
  );
}
