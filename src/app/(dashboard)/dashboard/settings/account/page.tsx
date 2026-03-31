import type { Metadata } from 'next';
import { getUser } from '@/lib/supabase/server';
import { SettingsProfileCard } from '@/features/auth/components/settings-profile-card';

export const metadata: Metadata = {
  title: 'Account',
  description: 'Manage your account settings and preferences.',
};

export default async function AccountPage() {
  const user = await getUser();

  const fullName = (user?.user_metadata?.full_name as string) ?? '';
  const email = user?.email ?? '';

  return <SettingsProfileCard fullName={fullName} email={email} />;
}
