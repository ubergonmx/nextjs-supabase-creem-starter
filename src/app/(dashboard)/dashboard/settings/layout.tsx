import type { ReactNode } from 'react';
import { SiteHeader } from '@/features/dashboard/components/site-header';
import { SettingsNav } from './_components/settings-nav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader title="Settings" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your account and billing preferences.
          </p>
        </div>
        <SettingsNav />
        {children}
      </div>
    </>
  );
}
