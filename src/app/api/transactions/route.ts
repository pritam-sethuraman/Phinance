import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiOk, apiError, apiUnauthorized } from "@/lib/api/response";
import {
  createTransactionSchema,
  transactionQuerySchema,
} from "@/lib/validation/transaction";
import {
  listTransactions,
  createTransaction,
} from "@/lib/services/transaction";

export async function GET(request: NextRequest) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const query = transactionQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams),
    );
    const { items, meta } = await listTransactions(user.id, query);
    return apiOk(items, { meta });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  const user = await getApiUser();
  if (!user) return apiUnauthorized();

  try {
    const body = await request.json();
    const input = createTransactionSchema.parse(body);
    const txn = await createTransaction(user.id, input);
    return apiOk(txn, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
