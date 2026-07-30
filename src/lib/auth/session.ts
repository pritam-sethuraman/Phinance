import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/auth";

/**
 * Require an authenticated user in a Server Component, Server Action, or
 * service function. Middleware already redirects anonymous requests away
 * from protected routes — this is the defense-in-depth second check
 * (docs/02-TECHNICAL-ARCHITECTURE.md §7 "Row ownership").
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

/** Same as requireUser(), but also enforces ADMIN role. */
export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/403");
  }
  return user;
}
