'use client';

import { useTransition, useState } from 'react';
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
import {
  cancelUserSubscription,
  resumeUserSubscription,
} from '@/features/billing/actions/subscription';
import { openCustomerPortal } from '@/features/billing/actions/portal';
import type { Subscription } from '@/features/billing/types';
import { toast } from 'sonner';

export function SubscriptionActions({ subscription }: { subscription: Subscription }) {
  const [pending, startTransition] = useTransition();
  const [cancelOpen, setCancelOpen] = useState(false);

  const isActive = subscription.status === 'active' || subscription.status === 'trialing';

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelUserSubscription();
      setCancelOpen(false);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Subscription will cancel at end of billing period.');
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

      {isActive && subscription.cancelAtPeriodEnd && (
        <Button variant="default" size="sm" disabled={pending} onClick={handleResume}>
          Resume Subscription
        </Button>
      )}

      {isActive && !subscription.cancelAtPeriodEnd && (
        <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
          <AlertDialogTrigger
            render={<Button variant="destructive" size="sm" disabled={pending} />}
          >
            Cancel Subscription
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
              <AlertDialogDescription>
                Your subscription will remain active until{' '}
                <strong>
                  {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'the end of your billing period'}
                </strong>
                . After that, you&apos;ll be moved to the Free plan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
              <Button
                variant="destructive"
                disabled={pending}
                onClick={handleCancel}
              >
                {pending ? 'Canceling\u2026' : 'Confirm Cancel'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
