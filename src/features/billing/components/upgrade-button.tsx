'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { upgradeUserSubscription } from '@/features/billing/actions/subscription';
import { toast } from 'sonner';

export function UpgradeButton({
  productId,
  children,
  variant = 'default',
}: {
  productId: string;
  children: React.ReactNode;
  variant?: 'default' | 'outline';
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      const result = await upgradeUserSubscription(productId);
      setOpen(false);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Plan updated successfully!');
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant={variant} className="w-full" disabled={pending} />}
      >
        {pending ? 'Processing\u2026' : children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm plan change</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;re about to switch your subscription plan. Creem automatically prorates charges
            &mdash; you&apos;ll be credited for unused time on your current plan and charged for the
            remainder of the new billing period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button disabled={pending} onClick={handleConfirm}>
            {pending ? 'Processing\u2026' : 'Confirm change'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
