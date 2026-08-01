import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardTrendPoint } from "@/lib/services/analytics";

const monthLabelFormatter = new Intl.DateTimeFormat("en-CA", { month: "short" });

function monthLabel(key: string): string {
  const [year, mon] = key.split("-").map(Number);
  return monthLabelFormatter.format(new Date(Date.UTC(year!, mon! - 1, 1)));
}

const WIDTH = 280;
const HEIGHT = 64;

export function TrendSparklineCard({ trend }: { trend: DashboardTrendPoint[] }) {
  const max = Math.max(...trend.map((t) => t.spent), 1);
  const stepX = WIDTH / Math.max(trend.length - 1, 1);

  const points = trend.map((t, i) => ({
    x: i * stepX,
    y: HEIGHT - (t.spent / max) * HEIGHT,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <Card>
      <CardHeader className="pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">Spending trend</CardTitle>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label={`6-month spending trend, from ${monthLabel(trend[0]!.month)} to ${monthLabel(trend[trend.length - 1]!.month)}`}
        >
          <path d={areaPath} className="fill-primary/10" />
          <path d={linePath} fill="none" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="2.5" className="fill-primary" />
          ))}
        </svg>
        <div className="mt-fib5 flex justify-between text-xs text-muted-foreground">
          <span>{monthLabel(trend[0]!.month)}</span>
          <span>{monthLabel(trend[trend.length - 1]!.month)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
