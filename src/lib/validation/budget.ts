import { z } from "zod";
import { categoryEnum } from "@/lib/validation/transaction";

export const budgetPeriodEnum = z.enum(["MONTHLY", "WEEKLY", "YEARLY"]);

const monthKeySchema = z.string().regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM.");

export const upsertBudgetSchema = z.object({
  period: budgetPeriodEnum.default("MONTHLY"),
  category: categoryEnum.nullable().default(null), // null = overall budget
  month: monthKeySchema,
  amount: z
    .number({ error: "Amount must be a number." })
    .int("Amount must be a whole number of cents.")
    .positive("Budget amount must be greater than 0."),
});
export type UpsertBudgetInput = z.infer<typeof upsertBudgetSchema>;

export const updateBudgetSchema = z.object({
  amount: z
    .number({ error: "Amount must be a number." })
    .int("Amount must be a whole number of cents.")
    .positive("Budget amount must be greater than 0."),
});
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export const budgetQuerySchema = z.object({
  month: monthKeySchema.optional(),
});
export type BudgetQueryInput = z.infer<typeof budgetQuerySchema>;

/**
 * Form-facing schema — "OVERALL" is a UI-only sentinel for "no category"
 * since native <select>/Radix Select can't hold a null value. Mapped to
 * `category: null` before hitting the server.
 */
export const budgetFormSchema = z.object({
  category: z.union([categoryEnum, z.literal("OVERALL")]),
  month: monthKeySchema,
  amountDollars: z
    .string()
    .min(1, "Amount is required.")
    .refine(
      (v) => Number.isFinite(Number(v)) && Number(v) > 0,
      "Amount must be greater than 0.",
    ),
});
export type BudgetFormValues = z.infer<typeof budgetFormSchema>;

export function budgetFormToInput(values: BudgetFormValues): UpsertBudgetInput {
  return {
    period: "MONTHLY",
    category: values.category === "OVERALL" ? null : values.category,
    month: values.month,
    amount: Math.round(Number(values.amountDollars) * 100),
  };
}
