'use client';

import { useTransition, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  cancelUserSubscription,
  resumeUserSubscription,
} from '@/features/billing/actions/subscription';
import { openCustomerPortal } from '@/features/billing/actions/portal';
import type { Subscription } from '@/features/billing/types';
import { toast } from 'sonner';

export function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const [pending, startTransition] = useTransition();
  const [cancelMode, setCancelMode] = useState<'scheduled' | 'immediate'>('scheduled');

  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelUserSubscription(cancelMode);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          cancelMode === 'scheduled'
            ? 'Subscription will cancel at end of period.'
            : 'Subscription canceled immediately.',
        );
      }
    });
  }

  function handleResume() {
    startTransition(async () => {
      const result = await resumeUserSubscription();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Subscription resumed!');
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      <form action={openCustomerPortal}>
        <Button size="sm" variant="outline" type="submit" disabled={pending}>
          Manage Subscription
        </Button>
      </form>

      {subscription.cancelAtPeriodEnd && (
        <Button variant="default" size="sm" disabled={pending} onClick={handleResume}>
          Resume Subscription
        </Button>
      )}

      {isActive && !subscription.cancelAtPeriodEnd && (
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="destructive" size="sm" disabled={pending} />}
          >
            Cancel Subscription
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>Choose how you want to cancel:</AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex flex-col gap-2 py-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="cancelMode"
                  value="scheduled"
                  checked={cancelMode === 'scheduled'}
                  onChange={() => setCancelMode('scheduled')}
                />
                <span className="text-sm">
                  <strong>At end of period</strong> &mdash; keep access until{' '}
                  {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'period end'}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="cancelMode"
                  value="immediate"
                  checked={cancelMode === 'immediate'}
                  onChange={() => setCancelMode('immediate')}
                />
                <span className="text-sm">
                  <strong>Immediately</strong> &mdash; access ends now
                </span>
              </label>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="text-destructive-foreground bg-destructive hover:bg-destructive/90"
              >
                Confirm Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
