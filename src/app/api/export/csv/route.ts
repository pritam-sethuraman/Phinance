import { NextRequest } from "next/server";
import { getApiUser } from "@/lib/api/auth";
import { apiUnauthorized } from "@/lib/api/response";
import { transactionQuerySchema } from "@/lib/validation/transaction";
import { iterateTransactions } from "@/lib/services/transaction";
import { getUser } from "@/lib/services/user";
import { csvRow } from "@/lib/csv";
import { formatCentsPlain } from "@/lib/money";
import { CATEGORY_META, type CategoryKey } from "@/config/categories";

const CSV_HEADERS = ["Date", "Type", "Category", "Merchant", "Note", "Amount"];

export async function GET(request: NextRequest) {
  const sessionUser = await getApiUser();
  if (!sessionUser) return apiUnauthorized();

  const parsed = transactionQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );
  if (!parsed.success) {
    return Response.json(
      { data: null, error: { message: "Invalid filters", fields: parsed.error.flatten().fieldErrors } },
      { status: 422 },
    );
  }
  // Pagination doesn't apply to an export — every matching row streams out.
  const { page: _page, pageSize: _pageSize, ...filters } = parsed.data;

  // Locale for number formatting — session only carries id/role (see
  // lib/auth/current-user.ts for why), so fetch the full record here.
  const { locale } = await getUser(sessionUser.id);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(csvRow(CSV_HEADERS)));

        for await (const batch of iterateTransactions(sessionUser.id, filters)) {
          for (const txn of batch) {
            controller.enqueue(
              encoder.encode(
                csvRow([
                  new Date(txn.date).toISOString().slice(0, 10),
                  txn.type === "INCOME" ? "Income" : "Expense",
                  CATEGORY_META[txn.category as CategoryKey].label,
                  txn.merchant ?? "",
                  txn.note ?? "",
                  formatCentsPlain(txn.amount, locale),
                ]),
              ),
            );
          }
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  const filenameSuffix = filters.month ?? "all";
  return new Response(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="phinance-transactions-${filenameSuffix}.csv"`,
    },
  });
}
