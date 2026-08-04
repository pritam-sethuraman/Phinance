import { z } from "zod";

export const analyticsQuerySchema = z.object({
  months: z.coerce
    .number()
    .int()
    .refine((v) => [3, 6, 12].includes(v), "months must be 3, 6, or 12")
    .default(6),
  month: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Expected YYYY-MM.")
    .optional(),
});
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
