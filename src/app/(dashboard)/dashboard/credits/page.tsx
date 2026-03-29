import type { Metadata } from "next";
import { SiteHeader } from "@/features/dashboard/components/site-header";
import { CreditsBalanceCard } from "@/features/credits/components/credits-balance-card";
import { TransactionHistory } from "@/features/credits/components/transaction-history";
import { getCreditsBalance, getCreditTransactions } from "@/features/credits/actions";

export const metadata: Metadata = {
  title: "Credits",
  description: "View your credits balance and transaction history.",
};

export default async function CreditsPage() {
  const [balance, transactions] = await Promise.all([
    getCreditsBalance(),
    getCreditTransactions(50),
  ]);

  return (
    <>
      <SiteHeader />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Credits</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your credit balance and transaction history.
          </p>
        </div>
        <CreditsBalanceCard balance={balance} />
        <TransactionHistory transactions={transactions} />
      </div>
    </>
  );
}
