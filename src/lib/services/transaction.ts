import { prisma } from "@/lib/db/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionQueryInput,
} from "@/lib/validation/transaction";

/**
 * Pure business logic — no Next.js/framework imports, so this is
 * unit-testable in isolation (see tests/unit/transaction.test.ts) and
 * portable if the API layer is ever extracted (docs/02 §1).
 *
 * Every function takes `userId` explicitly and scopes its query to it.
 * Callers (route handlers, server actions) are responsible for deriving
 * `userId` from the session — never from client-supplied data.
 */

function monthRange(month: string): { gte: Date; lt: Date } {
  const [year, mon] = month.split("-").map(Number);
  const gte = new Date(Date.UTC(year!, mon! - 1, 1));
  const lt = new Date(Date.UTC(year!, mon!, 1));
  return { gte, lt };
}

function sortToOrderBy(
  sort: TransactionQueryInput["sort"],
): Prisma.TransactionOrderByWithRelationInput {
  switch (sort) {
    case "date_asc":
      return { date: "asc" };
    case "amount_desc":
      return { amount: "desc" };
    case "amount_asc":
      return { amount: "asc" };
    case "date_desc":
    default:
      return { date: "desc" };
  }
}

export interface TransactionListResult {
  items: Awaited<ReturnType<typeof prisma.transaction.findMany>>;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export async function listTransactions(
  userId: string,
  query: TransactionQueryInput,
): Promise<TransactionListResult> {
  const where: Prisma.TransactionWhereInput = { userId };

  if (query.month) where.date = monthRange(query.month);
  if (query.category) where.category = query.category;
  if (query.type) where.type = query.type;
  if (query.q) {
    where.OR = [
      { merchant: { contains: query.q, mode: "insensitive" } },
      { note: { contains: query.q, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: sortToOrderBy(query.sort),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    },
  };
}

/** Throws NotFoundError if the id doesn't exist, ForbiddenError if it exists but isn't owned by userId. */
export async function getTransaction(userId: string, id: string) {
  const txn = await prisma.transaction.findUnique({ where: { id } });
  if (!txn) throw new NotFoundError("Transaction not found.");
  if (txn.userId !== userId)
    throw new ForbiddenError("You don't have access to this transaction.");
  return txn;
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput,
) {
  return prisma.transaction.create({
    data: { ...input, userId },
  });
}

export async function updateTransaction(
  userId: string,
  id: string,
  input: UpdateTransactionInput,
) {
  await getTransaction(userId, id); // existence + ownership check
  return prisma.transaction.update({ where: { id }, data: input });
}

export async function deleteTransaction(userId: string, id: string) {
  await getTransaction(userId, id); // existence + ownership check
  await prisma.transaction.delete({ where: { id } });
}
