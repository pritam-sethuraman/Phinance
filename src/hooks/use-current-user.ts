"use client";

import { useSession } from "next-auth/react";

/** Thin wrapper over next-auth's useSession, typed via src/types/next-auth.d.ts. */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  return { user: session?.user, status };
}
