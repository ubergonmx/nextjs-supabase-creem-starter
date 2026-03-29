import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CreditTransaction } from "@/features/credits/types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function typeBadgeVariant(type: CreditTransaction["type"]): BadgeVariant {
  switch (type) {
    case "purchase":
    case "topup":
      return "default";
    case "spend":
      return "secondary";
    case "refund":
    case "adjustment":
      return "outline";
    default:
      return "secondary";
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TransactionHistory({
  transactions,
}: {
  transactions: CreditTransaction[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Transaction History</CardTitle>
        <CardDescription>Your recent credit activity</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={typeBadgeVariant(tx.type)}>
                    {tx.type}
                  </Badge>
                  <span className="text-muted-foreground">
                    {tx.description ?? "—"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={
                      tx.amount >= 0
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {tx.amount.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground w-24 text-right">
                    {formatDate(tx.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
