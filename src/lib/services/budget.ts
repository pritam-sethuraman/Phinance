import { prisma } from "@/lib/db/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { monthRange } from "@/lib/date";
import { budgetStatus, type BudgetStatus } from "@/config/thresholds";
import type { CategoryKey } from "@/config/categories";
import type {
  UpsertBudgetInput,
  UpdateBudgetInput,
} from "@/lib/validation/budget";

export interface UtilizationEntry {
  budgetId: string;
  /** null = the overall monthly budget */
  category: CategoryKey | null;
  limit: number; // cents
  spent: number; // cents
  pct: number; // spent / limit
  status: BudgetStatus;
}

export async function listBudgets(userId: string, month: string) {
  return prisma.budget.findMany({ where: { userId, month } });
}

/**
 * For every budget the user has set in `month` (overall + per-category),
 * compute how much they've actually spent against it. Spend comes from
 * EXPENSE transactions only — INCOME never counts against a budget.
 */
export async function computeUtilization(
  userId: string,
  month: string,
): Promise<UtilizationEntry[]> {
  const budgets = await prisma.budget.findMany({ where: { userId, month } });
  if (budgets.length === 0) return [];

  const { gte, lt } = monthRange(month);
  const grouped = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "EXPENSE", date: { gte, lt } },
    _sum: { amount: true },
  });

  const spentByCategory = new Map<string, number>();
  let totalSpent = 0;
  for (const row of grouped) {
    const amount = row._sum.amount ?? 0;
    spentByCategory.set(row.category, amount);
    totalSpent += amount;
  }

  return budgets.map((budget) => {
    const spent = budget.category
      ? (spentByCategory.get(budget.category) ?? 0)
      : totalSpent;
    return {
      budgetId: budget.id,
      category: budget.category as CategoryKey | null,
      limit: budget.amount,
      spent,
      pct: budget.amount > 0 ? spent / budget.amount : 0,
      status: budgetStatus(spent, budget.amount),
    };
  });
}

/**
 * Create-or-update by the natural key (userId, category, month) — this is
 * how the "New budget" / "Edit budget" dialog saves, so the caller never
 * needs to know whether a budget already exists for that category+month.
 */
export async function upsertBudget(userId: string, input: UpsertBudgetInput) {
  const existing = await prisma.budget.findFirst({
    where: {
      userId,
      month: input.month,
      category: input.category,
    },
  });

  if (existing) {
    return prisma.budget.update({
      where: { id: existing.id },
      data: {
        amount: input.amount,
        period: input.period,
      },
    });
  }

  return prisma.budget.create({
    data: {
      ...input,
      userId,
    },
  });
}

export async function getBudget(userId: string, id: string) {
  const budget = await prisma.budget.findUnique({ where: { id } });
  if (!budget) throw new NotFoundError("Budget not found.");
  if (budget.userId !== userId)
    throw new ForbiddenError("You don't have access to this budget.");
  return budget;
}

export async function updateBudget(
  userId: string,
  id: string,
  input: UpdateBudgetInput,
) {
  await getBudget(userId, id); // existence + ownership check
  return prisma.budget.update({ where: { id }, data: input });
}

export async function deleteBudget(userId: string, id: string) {
  await getBudget(userId, id); // existence + ownership check
  await prisma.budget.delete({ where: { id } });
}
