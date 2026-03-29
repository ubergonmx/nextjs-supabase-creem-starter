import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { purchaseCredits } from "@/features/credits/actions";

export function CreditsBalanceCard({ balance }: { balance: number }) {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle className="text-base">Credit Balance</CardTitle>
        <CardDescription>Available credits in your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-5xl font-bold tracking-tight">
          {balance.toLocaleString()}
        </p>
        <form action={purchaseCredits}>
          <Button type="submit" variant="outline" size="sm">
            Buy Credits
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
