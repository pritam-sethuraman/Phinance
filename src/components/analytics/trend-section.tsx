import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineAreaChart } from "@/components/charts/line-area-chart";
import { formatCents } from "@/lib/money";
import type { AnalyticsTrendPoint } from "@/lib/services/analytics";

const monthLabelFormatter = new Intl.DateTimeFormat("en-CA", { month: "short" });
function monthLabel(key: string): string {
  const [year, mon] = key.split("-").map(Number);
  return monthLabelFormatter.format(new Date(Date.UTC(year!, mon! - 1, 1)));
}

export function TrendSection({ trend }: { trend: AnalyticsTrendPoint[] }) {
  const chartData = trend.map((t) => ({ label: monthLabel(t.month), value: t.spent }));
  const max = Math.max(...trend.map((t) => t.spent), 0);
  const last = trend[trend.length - 1];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Monthly spending trend</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="sr-only">
          Spending trend over the last {trend.length} months. Highest month was {formatCents(max)}.
          {last ? ` Most recently, ${formatCents(last.spent)} in ${monthLabel(last.month)}.` : ""}
        </p>
        <LineAreaChart data={chartData} />
      </CardContent>
    </Card>
  );
}
