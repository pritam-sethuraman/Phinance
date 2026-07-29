import Link from "next/link";
import { Wordmark } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// TODO(M2): wire to Auth.js — Google/GitHub OAuth buttons + Credentials form (RHF + Zod).
export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-fib21 p-fib21">
      <Wordmark />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue to Phinance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-fib13">
          <Button variant="outline" disabled>
            Continue with Google
          </Button>
          <Button variant="outline">Continue with GitHub</Button>

          <div className="my-fib8 flex items-center gap-fib13 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or{" "}
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-fib5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button>Sign in</Button>

          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link
              href="/register"
              className="text-primary underline-offset-4 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        Auth wires up in M2 — this is a static preview.
      </p>
    </div>
  );
}
