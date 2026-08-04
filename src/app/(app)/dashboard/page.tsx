import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getCurrentUserPrefs } from "@/lib/auth/current-user";
import { getDashboard } from "@/lib/services/analytics";
import { currentMonthKey } from "@/lib/date";
import { EmptyState } from "@/components/shared/empty-state";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QuickAddButton } from "@/components/dashboard/quick-add-button";
import { SpendCard } from "@/components/dashboard/spend-card";
import { RemainingBudgetCard } from "@/components/dashboard/remaining-budget-card";
import { UtilizationCard } from "@/components/dashboard/utilization-card";
import { TrendSparklineCard } from "@/components/dashboard/trend-sparkline-card";
import { RecentTransactionsCard } from "@/components/dashboard/recent-transactions-card";
import { CategoryDonutCard } from "@/components/dashboard/category-donut-card";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const user = await requireUser();
  const prefs = await getCurrentUserPrefs();
  const params = await searchParams;
  const month =
    params.month && /^\d{4}-\d{2}$/.test(params.month)
      ? params.month
      : currentMonthKey();

  const data = await getDashboard(user.id, month);

  if (!data.hasAnyData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          icon={LayoutDashboard}
          title="Add your first expense"
          description="Once you log a transaction, your dashboard fills in with spend, budgets, and trends."
          action={
            <QuickAddButton currency={prefs.currency} locale={prefs.locale} />
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-fib21">
      {/* useSearchParams() (via useMonthParam) requires a Suspense boundary
          — same reasoning as the transactions/budgets pages. */}
      <Suspense fallback={<div className="h-10" />}>
        <DashboardHeader
          userName={user.name}
          currency={prefs.currency}
          locale={prefs.locale}
        />
      </Suspense>

      <div className="grid gap-fib13 sm:grid-cols-2 lg:grid-cols-4">
        <SpendCard
          spend={data.currentMonthSpend}
          momDeltaPct={data.momDeltaPct}
          currency={prefs.currency}
          locale={prefs.locale}
        />
        <RemainingBudgetCard
          overallBudget={data.overallBudget}
          currency={prefs.currency}
          locale={prefs.locale}
        />
        <UtilizationCard
          overallBudget={data.overallBudget}
          locale={prefs.locale}
        />
        <TrendSparklineCard trend={data.trend} />
      </div>

      <div className="grid gap-fib13 lg:grid-cols-2">
        <CategoryDonutCard
          breakdown={data.categoryBreakdown}
          currency={prefs.currency}
          locale={prefs.locale}
        />
        <RecentTransactionsCard
          transactions={data.recentTransactions}
          currency={prefs.currency}
          locale={prefs.locale}
        />
      </div>
    </div>
  );
}
