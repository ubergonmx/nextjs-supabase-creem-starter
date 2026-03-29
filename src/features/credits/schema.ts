import * as z from "zod";

export const spendCreditsSchema = z.object({
  amount: z.int().min(1, "Amount must be a positive integer"),
  description: z.string(),
});
