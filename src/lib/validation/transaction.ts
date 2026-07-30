import { z } from "zod";
import { CATEGORIES } from "@/config/categories";

export const transactionTypeEnum = z.enum(["EXPENSE", "INCOME"]);
export const categoryEnum = z.enum(CATEGORIES);

/** Empty-string form fields become undefined rather than failing validation. */
const optionalText = (max: number) =>
  z
    .string()
    .max(max, `Must be ${max} characters or fewer.`)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

export const createTransactionSchema = z.object({
  type: transactionTypeEnum.default("EXPENSE"),
  amount: z
    .number({ invalid_type_error: "Amount must be a number." })
    .int("Amount must be a whole number of cents.")
    .positive("Amount must be greater than 0."),
  date: z.coerce.date({ invalid_type_error: "Enter a valid date." }),
  category: categoryEnum,
  merchant: optionalText(200),
  note: optionalText(1000),
});
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export const updateTransactionSchema = createTransactionSchema.partial();
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export const transactionSortEnum = z.enum([
  "date_desc",
  "date_asc",
  "amount_desc",
  "amount_asc",
]);
export type TransactionSort = z.infer<typeof transactionSortEnum>;

export const transactionQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM.")
    .optional(),
  category: categoryEnum.optional(),
  type: transactionTypeEnum.optional(),
  q: z.string().max(200).optional(),
  sort: transactionSortEnum.default("date_desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
