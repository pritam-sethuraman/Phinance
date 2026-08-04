import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChartGrouped } from "@/components/charts/bar-chart-grouped";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORY_META } from "@/config/categories";
import type { BudgetVsActualEntry } from "@/lib/services/analytics";

export function BudgetVsActualSection({
  entries,
  currency,
  locale,
}: {
  entries: BudgetVsActualEntry[];
  currency?: string;
  locale?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Budget vs actual (this month)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No category budgets set"
            description="Set per-category budgets to compare planned vs actual spend."
          />
        ) : (
          <>
            <BudgetVsActualSummary entries={entries} />
            <BarChartGrouped
              data={entries.map((e) => ({
                label: CATEGORY_META[e.category].label,
                budget: e.budget,
                actual: e.actual,
              }))}
              currency={currency}
              locale={locale}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BudgetVsActualSummary({
  entries,
}: {
  entries: BudgetVsActualEntry[];
}) {
  const overCount = entries.filter((e) => e.actual > e.budget).length;
  return (
    <p className="sr-only">
      Budget versus actual spending across {entries.length}{" "}
      {entries.length === 1 ? "category" : "categories"} this month.{" "}
      {overCount > 0
        ? `${overCount} ${overCount === 1 ? "category is" : "categories are"} over budget.`
        : "All categories are within budget."}
    </p>
  );
}
