import { Suspense } from "react";
import { requireUser } from "@/lib/auth/session";
import { listTransactions } from "@/lib/services/transaction";
import { transactionQuerySchema } from "@/lib/validation/transaction";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import { TransactionFilterBar } from "@/components/transactions/filter-bar";
import { PaginationControls } from "@/components/transactions/pagination-controls";

interface TransactionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** Repeated query params (e.g. `?category=A&category=B`) collapse to the first value. */
function normalizeParams(
  params: Record<string, string | string[] | undefined>,
) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ]),
  );
}

/** A malformed/tampered URL (e.g. `?page=abc`) falls back to defaults rather than crashing the page. */
function parseQuerySafely(params: Record<string, string | undefined>) {
  const result = transactionQuerySchema.safeParse(params);
  return result.success ? result.data : transactionQuerySchema.parse({});
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const user = await requireUser();
  const query = parseQuerySafely(normalizeParams(await searchParams));
  const { items, meta } = await listTransactions(user.id, query);
  const hasFilters = Boolean(query.month || query.category || query.q);

  return (
    <div className="flex flex-col gap-fib21">
      {/* useSearchParams() (via useTransactionFilters) requires a Suspense
          boundary so client-side navigations between filter states don't
          force a full-page client-render bailout. */}
      <Suspense fallback={<div className="h-10" />}>
        <TransactionFilterBar />
      </Suspense>

      <TransactionsClient initialItems={items} hasFilters={hasFilters} />

      <Suspense fallback={null}>
        <PaginationControls
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
        />
      </Suspense>
    </div>
  );
}
