"use server";

import { revalidatePath, revalidateTag } from "next/cache";
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

export interface ActionResult<T = undefined> {
  success: boolean;
  data?: T;
  fieldErrors?: Record<string, string[] | undefined>;
  formError?: string;
}

type TransactionData = Awaited<ReturnType<typeof createTransaction>>;

function revalidateTransactionViews(userId: string) {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  revalidatePath("/analytics");
  revalidateTag(`dashboard-${userId}`, "max");
}

export async function createTransactionAction(
  input: unknown,
): Promise<ActionResult<TransactionData>> {
  const user = await requireUser();

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const txn = await createTransaction(user.id, parsed.data);
  revalidateTransactionViews(user.id);
  return { success: true, data: txn };
}

export async function updateTransactionAction(
  id: string,
  input: unknown,
): Promise<ActionResult<TransactionData>> {
  const user = await requireUser();

  const parsed = updateTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const txn = await updateTransaction(user.id, id, parsed.data);
    revalidateTransactionViews(user.id);
    return { success: true, data: txn };
  } catch (error) {
    if (error instanceof NotFoundError)
      return { success: false, formError: "Transaction not found." };
    if (error instanceof ForbiddenError)
      return { success: false, formError: "Not authorized." };
    throw error;
  }
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

  revalidateTransactionViews(user.id);
  return { success: true };
}
