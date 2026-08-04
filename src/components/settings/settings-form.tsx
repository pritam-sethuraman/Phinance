"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateSettingsSchema,
  type UpdateSettingsInput,
  CURRENCIES,
  CURRENCY_META,
  LOCALES,
  LOCALE_META,
} from "@/lib/validation/user";
import { updateSettingsAction } from "@/lib/actions/user";

interface SettingsFormProps {
  initialTheme: "LIGHT" | "DARK" | "SYSTEM";
  initialCurrency: string;
  initialLocale: string;
}

export function SettingsForm({ initialTheme, initialCurrency, initialLocale }: SettingsFormProps) {
  const { setTheme } = useTheme();

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      theme: initialTheme,
      currency: initialCurrency as UpdateSettingsInput["currency"],
      locale: initialLocale as UpdateSettingsInput["locale"],
    },
  });

  const theme = watch("theme");
  const currency = watch("currency");
  const locale = watch("locale");

  async function onSubmit(values: UpdateSettingsInput) {
    const result = await updateSettingsAction(values);
    if (!result.success) {
      toast.error(result.formError ?? "Couldn't save settings. Please try again.");
      return;
    }
    setTheme(values.theme.toLowerCase()); // apply immediately, on top of persisting
    toast.success("Settings saved.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-fib21">
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Choose how Phinance looks. Applies across all your devices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={theme} onValueChange={(v) => setValue("theme", v as UpdateSettingsInput["theme"])}>
            <TabsList className="grid w-full max-w-sm grid-cols-3">
              <TabsTrigger value="LIGHT">Light</TabsTrigger>
              <TabsTrigger value="DARK">Dark</TabsTrigger>
              <TabsTrigger value="SYSTEM">System</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Currency and locale used to format amounts and dates throughout the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-fib13 sm:flex-row">
          <div className="flex flex-1 flex-col gap-fib5">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={currency}
              onValueChange={(v) => setValue("currency", v as UpdateSettingsInput["currency"])}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CURRENCY_META[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-1 flex-col gap-fib5">
            <Label htmlFor="locale">Locale</Label>
            <Select
              value={locale}
              onValueChange={(v) => setValue("locale", v as UpdateSettingsInput["locale"])}
            >
              <SelectTrigger id="locale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCALES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {LOCALE_META[l]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </div>
    </form>
  );
}
