"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/features/auth/actions/profile";

export function SettingsProfileCard({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle className="text-base">Profile</CardTitle>
        <CardDescription>Update your display name.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                defaultValue={fullName}
                placeholder="Your name"
                required
              />
              {state?.fieldErrors?.fullName && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.fullName[0]}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                readOnly
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here.
              </p>
            </Field>
            {state?.error && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            {state !== undefined && !state?.error && !state?.fieldErrors && (
              <p className="text-sm text-green-600">Profile updated!</p>
            )}
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Changes"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
