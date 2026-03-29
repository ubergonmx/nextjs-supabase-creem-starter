"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import {
  cancelUserSubscription,
  resumeUserSubscription,
  pauseUserSubscription,
  openCustomerPortal,
} from "@/features/billing/actions";
import type { Subscription } from "@/features/billing/types";
import { toast } from "sonner";

export function ManageSubscription({
  subscription,
}: {
  subscription: Subscription;
}) {
  const [pending, startTransition] = useTransition();
  const [cancelMode, setCancelMode] = useState<"scheduled" | "immediate">(
    "scheduled",
  );

  const isActive =
    subscription.status === "active" || subscription.status === "trialing";
  const isPaused = subscription.status === "paused";

  async function handleCancel() {
    startTransition(async () => {
      const result = await cancelUserSubscription(cancelMode);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          cancelMode === "scheduled"
            ? "Subscription will cancel at end of period."
            : "Subscription canceled immediately.",
        );
      }
    });
  }

  async function handleResume() {
    startTransition(async () => {
      const result = await resumeUserSubscription();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Subscription resumed!");
      }
    });
  }

  async function handlePause() {
    startTransition(async () => {
      const result = await pauseUserSubscription();
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Subscription paused.");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Manage Subscription</CardTitle>
        <CardDescription>
          Cancel, pause, or manage your plan via the customer portal.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        {/* Customer Portal */}
        <form action={openCustomerPortal}>
          <Button type="submit" variant="outline" size="sm" disabled={pending}>
            Open Customer Portal
          </Button>
        </form>

        {/* Resume (shown when scheduled to cancel) */}
        {subscription.cancelAtPeriodEnd && (
          <Button
            variant="default"
            size="sm"
            disabled={pending}
            onClick={handleResume}
          >
            Resume Subscription
          </Button>
        )}

        {/* Pause / Resume paused */}
        {isActive && !subscription.cancelAtPeriodEnd && (
          <Button
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={handlePause}
          >
            Pause Subscription
          </Button>
        )}

        {isPaused && (
          <Button
            variant="default"
            size="sm"
            disabled={pending}
            onClick={handleResume}
          >
            Resume Subscription
          </Button>
        )}

        {/* Cancel */}
        {isActive && !subscription.cancelAtPeriodEnd && (
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm" disabled={pending} />
              }
            >
              Cancel Subscription
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                <AlertDialogDescription>
                  Choose how you want to cancel:
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelMode"
                    value="scheduled"
                    checked={cancelMode === "scheduled"}
                    onChange={() => setCancelMode("scheduled")}
                  />
                  <span className="text-sm">
                    <strong>At end of period</strong> — keep access until{" "}
                    {subscription.currentPeriodEnd
                      ? new Date(
                          subscription.currentPeriodEnd,
                        ).toLocaleDateString()
                      : "period end"}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelMode"
                    value="immediate"
                    checked={cancelMode === "immediate"}
                    onChange={() => setCancelMode("immediate")}
                  />
                  <span className="text-sm">
                    <strong>Immediately</strong> — access ends now
                  </span>
                </label>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Cancel
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardContent>
    </Card>
  );
}
