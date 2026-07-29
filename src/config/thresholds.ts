/** Budget utilization status thresholds — single source of truth for M6 math + UI colors. */
export const BUDGET_THRESHOLDS = {
  warn: 0.8,
  over: 1.0,
} as const;

export type BudgetStatus = "ok" | "warn" | "over";

export function budgetStatus(spent: number, limit: number): BudgetStatus {
  if (limit <= 0) return "ok";
  const pct = spent / limit;
  if (pct >= BUDGET_THRESHOLDS.over) return "over";
  if (pct >= BUDGET_THRESHOLDS.warn) return "warn";
  return "ok";
}
