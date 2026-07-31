import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiError, apiUnauthorized } from "@/lib/api/response";
import { updateBudgetSchema } from "@/lib/validation/budget";
import { getBudget, updateBudget, deleteBudget } from "@/lib/services/budget";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { id } = await params;
    const budget = await getBudget(user.id, id);
    return apiOk(budget);
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
    const input = updateBudgetSchema.parse(body);
    const budget = await updateBudget(user.id, id, input);
    return apiOk(budget);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { id } = await params;
    await deleteBudget(user.id, id);
    return apiOk({ id });
  } catch (error) {
    return apiError(error);
  }
}
