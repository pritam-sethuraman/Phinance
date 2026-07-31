import { requireUser } from "@/lib/auth/session";
import { listTransactions } from "@/lib/services/transaction";
import { transactionQuerySchema } from "@/lib/validation/transaction";
import { TransactionsClient } from "@/components/transactions/transactions-client";

// Full querying (filter/search/sort/pagination controls) lands in M5 — for
// now we fetch a generous single page so the CRUD UI has real data to work
// with. pageSize here is just large enough to cover typical demo/seed data.
export default async function TransactionsPage() {
  const user = await requireUser();
  const query = transactionQuerySchema.parse({ pageSize: "100" });
  const { items } = await listTransactions(user.id, query);

  return <TransactionsClient initialItems={items} />;
}
