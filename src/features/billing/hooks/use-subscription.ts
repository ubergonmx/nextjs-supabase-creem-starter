"use client";

import { useCallback, useEffect, useState } from "react";
import { getUserSubscription } from "@/features/billing/actions";
import type { Subscription } from "@/features/billing/types";

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const sub = await getUserSubscription();
    setSubscription(sub);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { subscription, loading, refresh };
}
