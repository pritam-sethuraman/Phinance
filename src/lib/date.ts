/** Inclusive/exclusive UTC date range for a "YYYY-MM" month key. */
export function monthRange(month: string): { gte: Date; lt: Date } {
  const [year, mon] = month.split("-").map(Number);
  const gte = new Date(Date.UTC(year!, mon! - 1, 1));
  const lt = new Date(Date.UTC(year!, mon!, 1));
  return { gte, lt };
}

/** Current month as "YYYY-MM" — used to default budget/dashboard views. */
export function currentMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
