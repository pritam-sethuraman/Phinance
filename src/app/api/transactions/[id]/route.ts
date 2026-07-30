import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiError, apiUnauthorized } from "@/lib/api/response";
import { updateTransactionSchema } from "@/lib/validation/transaction";
import {
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "@/lib/services/transaction";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { id } = await params;
    const txn = await getTransaction(user.id, id);
    return apiOk(txn);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { id } = await params;
    const body = await request.json();
    const input = updateTransactionSchema.parse(body);
    const txn = await updateTransaction(user.id, id, input);
    return apiOk(txn);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { id } = await params;
    await deleteTransaction(user.id, id);
    return apiOk({ id });
  } catch (error) {
    return apiError(error);
  }
}
