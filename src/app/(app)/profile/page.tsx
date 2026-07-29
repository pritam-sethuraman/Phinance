import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="flex max-w-2xl flex-col gap-fib21">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Name, avatar, verified email, member-since, and role — wired up in M9 alongside auth
            (M2).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">Coming in M9.</CardContent>
      </Card>
    </div>
  );
}
