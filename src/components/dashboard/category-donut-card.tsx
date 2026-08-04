import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents } from "@/lib/money";
import { CATEGORY_META } from "@/config/categories";
import type { DashboardData } from "@/lib/services/analytics";

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CategoryDonutCard({
  breakdown,
  currency,
  locale,
}: {
  breakdown: DashboardData["categoryBreakdown"];
  currency?: string;
  locale?: string;
}) {
  const total = breakdown.reduce((sum, b) => sum + b.amount, 0);

  return (
    <Card>
      <CardHeader className="pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">Category breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="py-fib13 text-center text-sm text-muted-foreground">No spending yet this month.</p>
        ) : (
          <DonutBody breakdown={breakdown} total={total} currency={currency} locale={locale} />
        )}
      </CardContent>
    </Card>
  );
}

function DonutBody({
  breakdown,
  total,
  currency,
  locale,
}: {
  breakdown: DashboardData["categoryBreakdown"];
  total: number;
  currency?: string;
  locale?: string;
}) {
  const sorted = [...breakdown].sort((a, b) => b.amount - a.amount);

  let cumulative = 0;
  const segments = sorted.map((entry) => {
    const fraction = entry.amount / total;
    const dash = fraction * CIRCUMFERENCE;
    const segment = { ...entry, dash, offset: cumulative };
    cumulative += dash;
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-fib21 sm:flex-row">
      <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0 -rotate-90" role="img" aria-label="Spending by category">
        <circle cx="80" cy="80" r={RADIUS} fill="none" className="stroke-muted" strokeWidth="20" />
        {segments.map((segment) => (
          <circle
            key={segment.category}
            cx="80"
            cy="80"
            r={RADIUS}
            fill="none"
            stroke={CATEGORY_META[segment.category].color}
            strokeWidth="20"
            strokeDasharray={`${segment.dash} ${CIRCUMFERENCE - segment.dash}`}
            strokeDashoffset={-segment.offset}
          />
        ))}
      </svg>
      <ul className="flex w-full flex-col gap-fib5">
        {segments.slice(0, 6).map((segment) => (
          <li key={segment.category} className="flex items-center justify-between gap-fib8 text-sm">
            <span className="flex min-w-0 items-center gap-fib5 truncate">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: CATEGORY_META[segment.category].color }}
                aria-hidden="true"
              />
              <span className="truncate">{CATEGORY_META[segment.category].label}</span>
            </span>
            <span className="shrink-0 font-mono text-muted-foreground">
              {formatCents(segment.amount, { currency, locale })}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
