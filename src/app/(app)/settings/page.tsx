import { getCurrentUserPrefs } from "@/lib/auth/current-user";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUserPrefs();

  return (
    <div className="flex max-w-2xl flex-col gap-fib21">
      <SettingsForm
        initialTheme={user.theme}
        initialCurrency={user.currency}
        initialLocale={user.locale}
      />
    </div>
  );
}
