import type { TransactionListResult } from "@/lib/services/transaction";

/** Type-only import — no server code ends up in the client bundle. */
export type TransactionRow = TransactionListResult["items"][number];
