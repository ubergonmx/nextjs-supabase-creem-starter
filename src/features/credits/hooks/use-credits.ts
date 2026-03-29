"use client";

import { useCallback, useEffect, useState } from "react";
import { getCreditsBalance } from "@/features/credits/actions";

export function useCredits() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const b = await getCreditsBalance();
    setBalance(b);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { balance, loading, refresh };
}
