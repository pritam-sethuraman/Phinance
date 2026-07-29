import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-fib21">
      <Card>
        <CardHeader>
          <CardTitle>Appearance, preferences & security</CardTitle>
          <CardDescription>
            Theme, currency, locale, and connected accounts land in M9. Use the theme toggle in
            the topbar for now.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming in M9.</CardContent>
      </Card>
    </div>
  );
}
