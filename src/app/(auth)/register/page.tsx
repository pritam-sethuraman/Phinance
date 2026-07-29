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

// TODO(M2): wire to Auth.js Credentials registration (argon2 hash) + RHF/Zod + strength meter.
export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-fib21 p-fib21">
      <Wordmark />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Free forever. No credit card.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-fib13">
          <div className="flex flex-col gap-fib5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Ada Lovelace" />
          </div>
          <div className="flex flex-col gap-fib5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-fib5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button>Create account</Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              Sign in
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
