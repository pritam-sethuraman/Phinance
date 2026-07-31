import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { computeUtilization } from "@/lib/services/budget";
import { currentMonthKey } from "@/lib/date";
import { BudgetsClient } from "@/components/budgets/budgets-client";

interface BudgetsPageProps {
  searchParams: Promise<{ month?: string }>;
}

export default async function BudgetsPage({ searchParams }: BudgetsPageProps) {
  const user = await requireUser();
  const params = await searchParams;
  const month =
    params.month && /^\d{4}-\d{2}$/.test(params.month)
      ? params.month
      : currentMonthKey();

  const entries = await computeUtilization(user.id, month);

  return (
    // useSearchParams() (via useBudgetMonth) requires a Suspense boundary —
    // same reasoning as the transactions page in M5.
    <Suspense fallback={<div className="h-10" />}>
      <BudgetsClient month={month} entries={entries} />
    </Suspense>
  );
}
