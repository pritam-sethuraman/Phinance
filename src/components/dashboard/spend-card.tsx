import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCents, formatPercent } from "@/lib/money";
import { cn } from "@/lib/utils";

export function SpendCard({
  spend,
  momDeltaPct,
  currency,
  locale,
}: {
  spend: number;
  momDeltaPct: number | null;
  currency?: string;
  locale?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">This month</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-2xl font-semibold">{formatCents(spend, { currency, locale })}</p>
        {momDeltaPct !== null && (
          <p
            className={cn(
              "mt-fib3 flex items-center gap-fib3 text-xs",
              momDeltaPct > 0 ? "text-status-over" : "text-status-ok",
            )}
          >
            {momDeltaPct > 0 ? (
              <TrendingUp className="h-3 w-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="h-3 w-3" aria-hidden="true" />
            )}
            {formatPercent(Math.abs(momDeltaPct), locale)} vs last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
