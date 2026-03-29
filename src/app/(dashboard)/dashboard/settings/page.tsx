import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { SettingsProfileCard } from "@/features/auth/components/settings-profile-card";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName =
    (user?.user_metadata?.full_name as string) ?? "";
  const email = user?.email ?? "";

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your account information.
          </p>
        </div>
        <SettingsProfileCard fullName={fullName} email={email} />
      </div>
    </>
  );
}
