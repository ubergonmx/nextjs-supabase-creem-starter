"use server";

import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AuthActionState } from "../types";

const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
});

export async function updateProfile(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const raw = { fullName: formData.get("fullName") };
  const result = profileSchema.safeParse(raw);

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: result.data.fullName })
    .eq("id", user.id);

  if (error) return { error: error.message };

  return {};
}
