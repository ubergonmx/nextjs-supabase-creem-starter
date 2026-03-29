import type { Metadata } from "next";
import { ChartAreaInteractive } from "@/features/dashboard/components/chart-area-interactive";
import { DataTable } from "@/features/dashboard/components/data-table";
import { SectionCards } from "@/features/dashboard/components/section-cards";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { SubscriptionCard } from "@/features/billing/components/subscription-card";
import { getUserSubscription } from "@/features/billing/actions";
import { getCreditsBalance } from "@/features/credits/actions";

import data from "./data.json";

export const metadata: Metadata = {
  title: "Overview",
  description: "View your key metrics, usage data, and recent activity.",
};

export default async function Page() {
  const [subscription, creditsBalance] = await Promise.all([
    getUserSubscription(),
    getCreditsBalance(),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <SubscriptionCard
                subscription={subscription}
                creditsBalance={creditsBalance}
              />
            </div>
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
