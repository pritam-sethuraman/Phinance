import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/lib/services/analytics";

export function RemainingBudgetCard({
  overallBudget,
  currency,
  locale,
}: {
  overallBudget: DashboardData["overallBudget"];
  currency?: string;
  locale?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
      </CardHeader>
      <CardContent>
        {overallBudget ? (
          <>
            <p
              className={cn(
                "font-mono text-2xl font-semibold",
                overallBudget.remaining < 0 && "text-status-over",
              )}
            >
              {formatCents(overallBudget.remaining, { currency, locale })}
            </p>
            <p className="mt-fib3 text-xs text-muted-foreground">
              {overallBudget.remaining < 0 ? "over " : "of "}
              {formatCents(overallBudget.limit, { currency, locale })}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No overall budget set</p>
        )}
      </CardContent>
    </Card>
  );
}
