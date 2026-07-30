"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { PasswordStrength } from "@/components/shared/password-strength";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { registerUser } from "@/lib/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const password = watch("password");

  async function onSubmit(values: RegisterInput) {
    setFormError(null);
    const result = await registerUser(values);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.[0]) {
            setError(field as keyof RegisterInput, { message: messages[0] });
          }
        }
      }
      if (result.formError) setFormError(result.formError);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      // Account was created but auto-login failed — send them to log in manually.
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-fib21 p-fib21">
      <Link href="/">
        <Wordmark />
      </Link>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>Free forever. No credit card.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-fib13"
          >
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Ada Lovelace"
                autoComplete="name"
                aria-invalid={!!errors.name}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
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
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <PasswordStrength password={password ?? ""} />
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-md bg-destructive/10 px-fib8 py-fib5 text-sm text-destructive">
                {formError}
              </p>
            )}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-fib13 text-center text-sm text-muted-foreground">
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
    </div>
  );
}
