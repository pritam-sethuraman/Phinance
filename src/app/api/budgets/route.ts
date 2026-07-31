import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiError, apiUnauthorized } from "@/lib/api/response";
import { upsertBudgetSchema, budgetQuerySchema } from "@/lib/validation/budget";
import { listBudgets, upsertBudget } from "@/lib/services/budget";
import { currentMonthKey } from "@/lib/date";

export async function GET(request: NextRequest) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const { month } = budgetQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const budgets = await listBudgets(user.id, month ?? currentMonthKey());
    return apiOk(budgets);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const body = await request.json();
    const input = upsertBudgetSchema.parse(body);
    const budget = await upsertBudget(user.id, input);
    return apiOk(budget, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
