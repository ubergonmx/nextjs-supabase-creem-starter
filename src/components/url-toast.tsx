'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

type Props = {
  message: string;
  variant?: 'success' | 'error';
};

/**
 * Fires a toast on mount then cleans the triggering query param from the URL.
 * Render conditionally from a Server Component after resolving the error/success param.
 *
 * @example
 * // In a Server Component:
 * const { error } = await searchParams;
 * const msg = ERROR_MESSAGES[error] ?? error;
 * return <>{msg && <UrlToast message={msg} />}</>
 */
export function UrlToast({ message, variant = 'error' }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    if (variant === 'success') {
      toast.success(message, { duration: 6000 });
    } else {
      toast.error(message, { duration: 6000 });
    }
    router.replace(pathname);
  }, [router, pathname, message, variant]);

  return null;
}
