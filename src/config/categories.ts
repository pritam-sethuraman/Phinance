/**
 * Fixed MVP categories (mirrors the `Category` enum in prisma/schema.prisma).
 * Custom categories are a V1.1 feature — this list is intentionally static
 * for MVP.
 */
export const CATEGORIES = [
  "RENT",
  "UTILITIES",
  "SUBSCRIPTION",
  "CLOTHING",
  "GROCERIES",
  "GYM",
  "ELECTRONICS",
  "ENTERTAINMENT",
  "MEDICAL",
  "GIFTS",
  "GOING_OUT",
  "PUBLIC_TRANSPORTATION",
  "TRAVEL",
  "BILLS",
  "RESTAURANT",
  "SHOPPING",
  "OTHER",
] as const;

export type CategoryKey = (typeof CATEGORIES)[number];

interface CategoryMeta {
  label: string;
  /** HSL chart color — kept distinct across all 17 for pie/donut legibility. */
  color: string;
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  RENT: { label: "Rent", color: "hsl(165 45% 32%)" },
  UTILITIES: { label: "Utilities", color: "hsl(195 40% 45%)" },
  SUBSCRIPTION: { label: "Subscription", color: "hsl(255 40% 55%)" },
  CLOTHING: { label: "Clothing", color: "hsl(280 35% 52%)" },
  GROCERIES: { label: "Groceries", color: "hsl(90 40% 38%)" },
  GYM: { label: "Gym", color: "hsl(145 45% 40%)" },
  ELECTRONICS: { label: "Electronics", color: "hsl(220 45% 50%)" },
  ENTERTAINMENT: { label: "Entertainment", color: "hsl(340 55% 52%)" },
  MEDICAL: { label: "Medical", color: "hsl(4 60% 52%)" },
  GIFTS: { label: "Gifts", color: "hsl(320 50% 55%)" },
  GOING_OUT: { label: "Going out", color: "hsl(15 65% 50%)" },
  PUBLIC_TRANSPORTATION: {
    label: "Public transportation",
    color: "hsl(210 45% 48%)",
  },
  TRAVEL: { label: "Travel", color: "hsl(25 65% 50%)" },
  BILLS: { label: "Bills", color: "hsl(38 55% 45%)" },
  RESTAURANT: { label: "Restaurant", color: "hsl(45 70% 48%)" },
  SHOPPING: { label: "Shopping", color: "hsl(300 40% 50%)" },
  OTHER: { label: "Other", color: "hsl(0 0% 55%)" },
};

export function categoryLabel(key: CategoryKey): string {
  return CATEGORY_META[key].label;
}
