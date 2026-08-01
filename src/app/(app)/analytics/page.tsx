import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { getAnalytics } from "@/lib/services/analytics";
import { RangeSelector } from "@/components/analytics/range-selector";
import { TrendSection } from "@/components/analytics/trend-section";
import { BudgetVsActualSection } from "@/components/analytics/budget-vs-actual-section";
import { CategoryBreakdownSection } from "@/components/analytics/category-breakdown-section";
import { TopCategoriesSection } from "@/components/analytics/top-categories-section";

interface AnalyticsPageProps {
  searchParams: Promise<{ months?: string; month?: string }>;
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const months =
    params.months && ["3", "6", "12"].includes(params.months)
      ? Number(params.months)
      : 6;
  const endMonth =
    params.month && /^\d{4}-\d{2}$/.test(params.month)
      ? params.month
      : undefined;

  const data = await getAnalytics(user.id, { months, endMonth });

  return (
    <div className="flex flex-col gap-fib21">
      <div className="flex items-center justify-between gap-fib13">
        <h2 className="font-display text-xl font-medium">Analytics</h2>
        {/* useSearchParams() (via RangeSelector) requires a Suspense boundary
            — same reasoning as the transactions/budgets/dashboard pages. */}
        <Suspense fallback={<div className="h-10 w-44" />}>
          <RangeSelector months={months} />
        </Suspense>
      </div>

      <div className="grid gap-fib13 lg:grid-cols-2">
        <TrendSection trend={data.trend} />
        <BudgetVsActualSection entries={data.budgetVsActual} />
      </div>

      <div className="grid gap-fib13 lg:grid-cols-2">
        <CategoryBreakdownSection data={data.byCategory} />
        <TopCategoriesSection data={data.topCategories} />
      </div>
    </div>
  );
}
