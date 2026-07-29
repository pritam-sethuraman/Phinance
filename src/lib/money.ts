/**
 * All money in Phinance is stored and computed as INTEGER CENTS. Never use
 * floats for money math. These helpers are the only place cents are
 * converted to/from a display string.
 */

export interface MoneyFormatOptions {
  currency?: string; // ISO 4217, e.g. "CAD"
  locale?: string; // e.g. "en-CA"
  signDisplay?: "auto" | "always" | "never" | "exceptZero";
}

const DEFAULT_CURRENCY = "CAD";
const DEFAULT_LOCALE = "en-CA";

/** Format integer cents as a localized currency string, e.g. 4299 -> "$42.99". */
export function formatCents(
  cents: number,
  {
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    signDisplay = "auto",
  }: MoneyFormatOptions = {},
): string {
  if (!Number.isFinite(cents)) return "—";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    signDisplay,
  }).format(cents / 100);
}

/** Format cents without the currency symbol, e.g. 4299 -> "42.99". */
export function formatCentsPlain(
  cents: number,
  locale = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(cents)) return "—";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/** Parse a user-entered amount string (e.g. "42.99" or "$42.99") into integer cents. */
export function parseToCents(input: string): number | null {
  const cleaned = input.replace(/[^0-9.-]/g, "");
  if (cleaned === "" || cleaned === "-") return null;

  const value = Number(cleaned);
  if (!Number.isFinite(value)) return null;

  return Math.round(value * 100);
}

/** Format a ratio (0..1+) as a percentage, e.g. 0.847 -> "85%". */
export function formatPercent(ratio: number, locale = DEFAULT_LOCALE): string {
  if (!Number.isFinite(ratio)) return "—";
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(ratio);
}
