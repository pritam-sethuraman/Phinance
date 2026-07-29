/**
 * Fixed MVP categories (mirrors the `Category` enum in prisma/schema.prisma).
 * Custom categories are a V1.1 feature — this list is intentionally static
 * for MVP.
 */
export const CATEGORIES = [
  "HOUSING",
  "FOOD",
  "TRANSPORTATION",
  "SHOPPING",
  "ENTERTAINMENT",
  "HEALTHCARE",
  "UTILITIES",
  "EDUCATION",
  "TRAVEL",
  "OTHER",
] as const;

export type CategoryKey = (typeof CATEGORIES)[number];

interface CategoryMeta {
  label: string;
  /** Tailwind-safe HSL triplet, referenced via `hsl(var(--cat-x))`-style chart colors. */
  color: string;
}

export const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  HOUSING: { label: "Housing", color: "hsl(168 45% 32%)" },
  FOOD: { label: "Food", color: "hsl(38 65% 48%)" },
  TRANSPORTATION: { label: "Transportation", color: "hsl(210 45% 48%)" },
  SHOPPING: { label: "Shopping", color: "hsl(280 35% 52%)" },
  ENTERTAINMENT: { label: "Entertainment", color: "hsl(340 55% 52%)" },
  HEALTHCARE: { label: "Healthcare", color: "hsl(4 60% 52%)" },
  UTILITIES: { label: "Utilities", color: "hsl(195 40% 45%)" },
  EDUCATION: { label: "Education", color: "hsl(255 40% 55%)" },
  TRAVEL: { label: "Travel", color: "hsl(25 65% 50%)" },
  OTHER: { label: "Other", color: "hsl(0 0% 55%)" },
};

export function categoryLabel(key: CategoryKey): string {
  return CATEGORY_META[key].label;
}
