import { z } from "zod";

export const themeEnum = z.enum(["LIGHT", "DARK", "SYSTEM"]);

/**
 * A curated subset of ISO 4217 rather than the full ~180-code list — keeps
 * the Settings select usable without pulling in a currency-data package.
 * Add more as users actually ask for them.
 */
export const CURRENCIES = [
  "CAD",
  "USD",
  "EUR",
  "GBP",
  "AUD",
  "NZD",
  "JPY",
  "INR",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "MXN",
  "BRL",
  "SGD",
] as const;
export const currencyEnum = z.enum(CURRENCIES);

export const CURRENCY_META: Record<
  (typeof CURRENCIES)[number],
  { label: string }
> = {
  CAD: { label: "Canadian Dollar (CAD)" },
  USD: { label: "US Dollar (USD)" },
  EUR: { label: "Euro (EUR)" },
  GBP: { label: "British Pound (GBP)" },
  AUD: { label: "Australian Dollar (AUD)" },
  NZD: { label: "New Zealand Dollar (NZD)" },
  JPY: { label: "Japanese Yen (JPY)" },
  INR: { label: "Indian Rupee (INR)" },
  CHF: { label: "Swiss Franc (CHF)" },
  SEK: { label: "Swedish Krona (SEK)" },
  NOK: { label: "Norwegian Krone (NOK)" },
  DKK: { label: "Danish Krone (DKK)" },
  MXN: { label: "Mexican Peso (MXN)" },
  BRL: { label: "Brazilian Real (BRL)" },
  SGD: { label: "Singapore Dollar (SGD)" },
};

export const LOCALES = [
  "en-CA",
  "fr-CA",
  "en-US",
  "en-GB",
  "en-AU",
  "en-NZ",
  "en-IN",
  "en-SG",
  "fr-FR",
  "de-DE",
  "es-ES",
  "es-MX",
  "pt-BR",
  "ja-JP",
] as const;
export const localeEnum = z.enum(LOCALES);

export const LOCALE_META: Record<(typeof LOCALES)[number], string> = {
  "en-CA": "English (Canada)",
  "fr-CA": "Français (Canada)",
  "en-US": "English (United States)",
  "en-GB": "English (United Kingdom)",
  "en-AU": "English (Australia)",
  "en-NZ": "English (New Zealand)",
  "en-IN": "English (India)",
  "en-SG": "English (Singapore)",
  "fr-FR": "Français (France)",
  "de-DE": "Deutsch (Germany)",
  "es-ES": "Español (Spain)",
  "es-MX": "Español (Mexico)",
  "pt-BR": "Português (Brazil)",
  "ja-JP": "日本語 (Japan)",
};

export const updateSettingsSchema = z.object({
  theme: themeEnum,
  currency: currencyEnum,
  locale: localeEnum,
});
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name is too long."),
  // Empty string means "remove avatar" — no file-upload storage adapter
  // exists yet (that's V1.1 per the PRD), so this is a plain URL field
  // rather than an upload control.
  image: z
    .union([z.string().url("Enter a valid URL."), z.literal("")])
    .optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
