"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import {
  updateSettingsSchema,
  updateProfileSchema,
} from "@/lib/validation/user";
import { updateSettings, updateProfile } from "@/lib/services/user";

export interface ActionResult {
  success: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
}

/** Currency/locale/theme affect every money-formatting surface in the app shell. */
function revalidateAppShell() {
  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/budgets");
  revalidatePath("/analytics");
  revalidatePath("/settings");
  revalidatePath("/profile");
}

export async function updateSettingsAction(
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = updateSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateSettings(user.id, parsed.data);
  revalidateAppShell();
  return { success: true };
}

export async function updateProfileAction(
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await updateProfile(user.id, {
    name: parsed.data.name,
    image: parsed.data.image ? parsed.data.image : null,
  });
  revalidateAppShell();
  return { success: true };
}
