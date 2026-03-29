export type CreditBalance = {
  userId: string;
  balance: number;
  updatedAt: string;
};

export type CreditTransaction = {
  id: string;
  userId: string;
  amount: number;
  type: "purchase" | "topup" | "spend" | "refund" | "adjustment";
  description: string | null;
  createdAt: string;
};
