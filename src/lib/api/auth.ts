import { auth } from "@/lib/auth/auth";

/** Session user for Route Handlers. Returns null rather than redirecting — callers respond 401. */
export async function getApiUser() {
  const session = await auth();
  return session?.user ?? null;
}
