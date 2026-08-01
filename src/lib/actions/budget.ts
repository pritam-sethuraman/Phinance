"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { upsertBudgetSchema } from "@/lib/validation/budget";
import { upsertBudget, deleteBudget } from "@/lib/services/budget";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
}

type BudgetData = Awaited<ReturnType<typeof upsertBudget>>;

function revalidateBudgetViews() {
  revalidatePath("/budgets");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
}

export async function upsertBudgetAction(input: unknown): Promise<ActionResult<BudgetData>> {
  const user = await requireUser();

  const parsed = upsertBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const budget = await upsertBudget(user.id, parsed.data);
  revalidateBudgetViews();
  return { success: true, data: budget };
}

export async function deleteBudgetAction(id: string): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await deleteBudget(user.id, id);
  } catch (error) {
    if (error instanceof NotFoundError) return { success: false, formError: "Budget not found." };
    if (error instanceof ForbiddenError) return { success: false, formError: "Not authorized." };
    throw error;
  }

  revalidateBudgetViews();
  return { success: true };
}
