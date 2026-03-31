'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function SignupPendingToast() {
  const router = useRouter();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    toast.success('Account created! Check your email to confirm, then sign in.', {
      duration: 6000,
    });
    router.replace('/login');
  }, [router]);

  return null;
}
