import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { monthRange, currentMonthKey } from "@/lib/date";
import { budgetStatus, type BudgetStatus } from "@/config/thresholds";
import type { CategoryKey } from "@/config/categories";

export interface DashboardTrendPoint {
  month: string; // "YYYY-MM"
  spent: number; // cents
}

export interface DashboardCategoryBreakdown {
  category: CategoryKey;
  amount: number; // cents
}

export interface DashboardOverallBudget {
  limit: number;
  spent: number;
  remaining: number; // can be negative when over budget
  pct: number;
  status: BudgetStatus;
}

export interface DashboardData {
  month: string;
  currentMonthSpend: number;
  previousMonthSpend: number;
  /** null when the previous month had zero spend — a % change is meaningless there. */
  momDeltaPct: number | null;
  overallBudget: DashboardOverallBudget | null;
  /** Oldest to newest, 6 points including the current month. */
  trend: DashboardTrendPoint[];
  recentTransactions: Awaited<ReturnType<typeof prisma.transaction.findMany>>;
  categoryBreakdown: DashboardCategoryBreakdown[];
  /** false only when the user has never logged a single transaction — drives the empty state. */
  hasAnyData: boolean;
}

/** Shifts a "YYYY-MM" key by `delta` months (negative goes back). */
export function shiftMonth(month: string, delta: number): string {
  const [year, mon] = month.split("-").map(Number);
  const d = new Date(Date.UTC(year!, mon! - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

async function sumExpensesForMonth(
  userId: string,
  month: string,
): Promise<number> {
  const { gte, lt } = monthRange(month);
  const result = await prisma.transaction.aggregate({
    where: { userId, type: "EXPENSE", date: { gte, lt } },
    _sum: { amount: true },
  });
  return result._sum.amount ?? 0;
}

async function computeDashboard(
  userId: string,
  month: string,
): Promise<DashboardData> {
  const previousMonth = shiftMonth(month, -1);
  const trendMonths = Array.from({ length: 6 }, (_, i) =>
    shiftMonth(month, -(5 - i)),
  );
  const { gte, lt } = monthRange(month);

  const [
    currentMonthSpend,
    previousMonthSpend,
    overallBudgetRow,
    categoryRows,
    recentTransactions,
    trendSpends,
    anyTransaction,
  ] = await Promise.all([
    sumExpensesForMonth(userId, month),
    sumExpensesForMonth(userId, previousMonth),
    prisma.budget.findFirst({ where: { userId, month, category: null } }),
    prisma.transaction.groupBy({
      by: ["category"],
      where: { userId, type: "EXPENSE", date: { gte, lt } },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 8,
    }),
    Promise.all(trendMonths.map((m) => sumExpensesForMonth(userId, m))),
    prisma.transaction.findFirst({ where: { userId }, select: { id: true } }),
  ]);

  const trend: DashboardTrendPoint[] = trendMonths.map((m, i) => ({
    month: m,
    spent: trendSpends[i]!,
  }));

  const categoryBreakdown: DashboardCategoryBreakdown[] = categoryRows
    .map((row) => ({
      category: row.category as CategoryKey,
      amount: row._sum.amount ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const momDeltaPct =
    previousMonthSpend > 0
      ? (currentMonthSpend - previousMonthSpend) / previousMonthSpend
      : null;

  const overallBudget: DashboardOverallBudget | null = overallBudgetRow
    ? {
        limit: overallBudgetRow.amount,
        spent: currentMonthSpend,
        remaining: overallBudgetRow.amount - currentMonthSpend,
        pct:
          overallBudgetRow.amount > 0
            ? currentMonthSpend / overallBudgetRow.amount
            : 0,
        status: budgetStatus(currentMonthSpend, overallBudgetRow.amount),
      }
    : null;

  return {
    month,
    currentMonthSpend,
    previousMonthSpend,
    momDeltaPct,
    overallBudget,
    trend,
    recentTransactions,
    categoryBreakdown,
    hasAnyData: anyTransaction !== null,
  };
}

/**
 * Cached per (userId, month) via Next.js's Data Cache, tagged
 * `dashboard-${userId}` so transaction/budget mutations can invalidate just
 * this user's cached dashboard (see revalidateTag calls in
 * lib/actions/transaction.ts and lib/actions/budget.ts). The short
 * `revalidate` window is a deliberate safety net on top of tag
 * invalidation — Next.js's caching layers have real subtlety I can't fully
 * exercise without a live deployment, so worth confirming locally that a
 * new transaction shows up on the dashboard promptly.
 */
export async function getDashboard(
  userId: string,
  month: string = currentMonthKey(),
): Promise<DashboardData> {
  const cached = unstable_cache(
    () => computeDashboard(userId, month),
    ["dashboard", userId, month],
    {
      tags: [`dashboard-${userId}`],
      revalidate: 60,
    },
  );
  return cached();
}
