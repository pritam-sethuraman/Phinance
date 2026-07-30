"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
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
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formError, setFormError] = useState<string | null>(null);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);
    const result = await signIn("credentials", { ...values, redirect: false });

    if (result?.error) {
      setFormError("Incorrect email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    void signIn(provider, { callbackUrl });
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-fib21 p-fib21">
      <Link href="/">
        <Wordmark />
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to continue to Phinance.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-fib13">
          <Button
            type="button"
            variant="outline"
            disabled={oauthLoading !== null}
            onClick={() => handleOAuth("google")}
          >
            {oauthLoading === "google" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Continue with Google
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={oauthLoading !== null}
            onClick={() => handleOAuth("github")}
          >
            {oauthLoading === "github" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Continue with GitHub
          </Button>

          <div className="my-fib8 flex items-center gap-fib13 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or{" "}
            <span className="h-px flex-1 bg-border" />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-fib13"
          >
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p
                className={cn(
                  "rounded-md bg-destructive/10 px-fib8 py-fib5 text-sm text-destructive",
                )}
              >
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

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
    </div>
  );
}
