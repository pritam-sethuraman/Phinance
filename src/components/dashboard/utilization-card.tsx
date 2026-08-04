import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPercent } from "@/lib/money";
import type { DashboardData } from "@/lib/services/analytics";

const STATUS_INDICATOR_CLASS = {
  ok: "bg-status-ok",
  warn: "bg-status-warn",
  over: "bg-status-over",
} as const;

export function UtilizationCard({
  overallBudget,
  locale,
}: {
  overallBudget: DashboardData["overallBudget"];
  locale?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">Utilization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-fib8">
        {overallBudget ? (
          <>
            <p className="font-mono text-2xl font-semibold">{formatPercent(overallBudget.pct, locale)}</p>
            <Progress
              value={Math.min(overallBudget.pct, 1) * 100}
              indicatorClassName={STATUS_INDICATOR_CLASS[overallBudget.status]}
              aria-label={`${formatPercent(overallBudget.pct, locale)} of overall budget used`}
            />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Set an overall budget to see this</p>
        )}
      </CardContent>
    </Card>
  );
}
