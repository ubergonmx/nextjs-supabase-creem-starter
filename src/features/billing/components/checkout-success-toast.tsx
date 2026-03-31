'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function CheckoutSuccessToast() {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toast.success('Payment successful! Your plan will update shortly.', {
      duration: 6000,
    });
    router.replace('/dashboard');
  }, [router]);

  return null;
}
