import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import { CATEGORY_META, type CategoryKey } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { DashboardData } from "@/lib/services/analytics";

const dateFormatter = new Intl.DateTimeFormat("en-CA", { month: "short", day: "numeric" });

export function RecentTransactionsCard({
  transactions,
  currency,
  locale,
}: {
  transactions: DashboardData["recentTransactions"];
  currency?: string;
  locale?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-fib5">
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent transactions</CardTitle>
        <Button variant="ghost" size="sm" asChild className="h-auto px-fib5 py-fib1 text-xs">
          <Link href="/transactions">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-fib13 text-center text-sm text-muted-foreground">No transactions yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {transactions.map((txn) => {
              const meta = CATEGORY_META[txn.category as CategoryKey];
              const isIncome = txn.type === "INCOME";
              return (
                <li key={txn.id} className="flex items-center justify-between gap-fib8 py-fib8">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{txn.merchant || meta.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {dateFormatter.format(new Date(txn.date))}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-sm font-medium",
                      isIncome ? "text-status-ok" : "text-foreground",
                    )}
                  >
                    {isIncome ? "+" : "-"}
                    {formatCents(txn.amount, { currency, locale })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
