"use server";

import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";
import { registerSchema } from "@/lib/validation/auth";

export interface RegisterResult {
  success: boolean;
  fieldErrors?: Partial<
    Record<"name" | "email" | "password" | "confirmPassword", string[]>
  >;
  formError?: string;
}

export async function registerUser(input: unknown): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      fieldErrors: { email: ["An account with this email already exists."] },
    };
  }

  const passwordHash = await argon2.hash(password);

  await prisma.user.create({
    data: { name, email, passwordHash, role: "USER" },
  });

  return { success: true };
}
