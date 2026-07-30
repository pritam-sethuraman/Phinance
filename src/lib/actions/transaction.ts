"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/lib/validation/transaction";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/services/transaction";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export interface ActionResult {
  success: boolean;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
}

function revalidateTransactionViews() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  revalidatePath("/analytics");
}

export async function createTransactionAction(
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await createTransaction(user.id, parsed.data);
  revalidateTransactionViews();
  return { success: true };
}

export async function updateTransactionAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  const user = await requireUser();

  const parsed = updateTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await updateTransaction(user.id, id, parsed.data);
  } catch (error) {
    if (error instanceof NotFoundError)
      return { success: false, formError: "Transaction not found." };
    if (error instanceof ForbiddenError)
      return { success: false, formError: "Not authorized." };
    throw error;
  }

  revalidateTransactionViews();
  return { success: true };
}

export async function deleteTransactionAction(
  id: string,
): Promise<ActionResult> {
  const user = await requireUser();

  try {
    await deleteTransaction(user.id, id);
  } catch (error) {
    if (error instanceof NotFoundError)
      return { success: false, formError: "Transaction not found." };
    if (error instanceof ForbiddenError)
      return { success: false, formError: "Not authorized." };
    throw error;
  }

  revalidateTransactionViews();
  return { success: true };
}
