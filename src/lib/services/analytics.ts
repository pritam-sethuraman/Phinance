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

async function groupExpensesByCategory(
  userId: string,
  month: string,
): Promise<DashboardCategoryBreakdown[]> {
  const { gte, lt } = monthRange(month);
  const rows = await prisma.transaction.groupBy({
    by: ["category"],
    where: { userId, type: "EXPENSE", date: { gte, lt } },
    _sum: { amount: true },
  });
  return rows
    .map((row) => ({
      category: row.category as CategoryKey,
      amount: row._sum.amount ?? 0,
    }))
    .sort((a, b) => b.amount - a.amount);
}

async function computeDashboard(
  userId: string,
  month: string,
): Promise<DashboardData> {
  const previousMonth = shiftMonth(month, -1);
  const trendMonths = Array.from({ length: 6 }, (_, i) =>
    shiftMonth(month, -(5 - i)),
  );

  const [
    currentMonthSpend,
    previousMonthSpend,
    overallBudgetRow,
    categoryBreakdown,
    recentTransactions,
    trendSpends,
    anyTransaction,
  ] = await Promise.all([
    sumExpensesForMonth(userId, month),
    sumExpensesForMonth(userId, previousMonth),
    prisma.budget.findFirst({ where: { userId, month, category: null } }),
    groupExpensesByCategory(userId, month),
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

// ---------------------------------------------------------------------------
// M8 — Analytics page (trend, budget-vs-actual, category breakdown, top
// categories over a selectable range). Deliberately NOT wrapped in
// unstable_cache like getDashboard — the M8 spec doesn't call for it, and
// keeping this module's caching surface smaller reduces the amount of
// unverified caching behavior in play at once.
// ---------------------------------------------------------------------------

export interface AnalyticsTrendPoint {
  month: string; // "YYYY-MM"
  spent: number; // cents
}

export interface BudgetVsActualEntry {
  category: CategoryKey;
  budget: number; // cents
  actual: number; // cents
}

export type CategoryAmount = DashboardCategoryBreakdown;

export interface AnalyticsData {
  range: { from: string; to: string; months: number };
  trend: AnalyticsTrendPoint[];
  budgetVsActual: BudgetVsActualEntry[];
  byCategory: CategoryAmount[];
  topCategories: CategoryAmount[];
}

export interface AnalyticsOptions {
  /** 3, 6, or 12 — validated at the API/query-schema boundary, not here. */
  months?: number;
  /** Last month in the range. Defaults to the current month. */
  endMonth?: string;
}

const TOP_CATEGORIES_LIMIT = 5;

export async function getAnalytics(
  userId: string,
  options: AnalyticsOptions = {},
): Promise<AnalyticsData> {
  const months = options.months ?? 6;
  const endMonth = options.endMonth ?? currentMonthKey();
  const startMonth = shiftMonth(endMonth, -(months - 1));
  const trendMonths = Array.from({ length: months }, (_, i) =>
    shiftMonth(endMonth, -(months - 1 - i)),
  );

  const [trendSpends, byCategory, categoryBudgets] = await Promise.all([
    Promise.all(trendMonths.map((m) => sumExpensesForMonth(userId, m))),
    groupExpensesByCategory(userId, endMonth),
    prisma.budget.findMany({
      where: { userId, month: endMonth, category: { not: null } },
    }),
  ]);

  const trend: AnalyticsTrendPoint[] = trendMonths.map((m, i) => ({
    month: m,
    spent: trendSpends[i]!,
  }));

  const spentByCategory = new Map(
    byCategory.map((c) => [c.category, c.amount]),
  );
  const budgetVsActual: BudgetVsActualEntry[] = categoryBudgets.map((b) => {
    const category = b.category as CategoryKey;
    return {
      category,
      budget: b.amount,
      actual: spentByCategory.get(category) ?? 0,
    };
  });

  return {
    range: { from: startMonth, to: endMonth, months },
    trend,
    budgetVsActual,
    byCategory,
    topCategories: byCategory.slice(0, TOP_CATEGORIES_LIMIT),
  };
}
