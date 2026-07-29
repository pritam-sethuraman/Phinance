"use client";

import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { useSession, getSession } from "next-auth/react";

// TODO(M2): gate to role === "ADMIN" in middleware.ts; render a 403 page for USER role.
export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <>
        <p>Loading...</p>
      </>
    );
  }

  if (status === "unauthenticated") {
    return (
      <>
        <p>Access Denied</p>
      </>
    );
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-fib21">
        <EmptyState
          icon={ShieldCheck}
          title="Admin overview"
          description="System stats, recent signups, and free-tier usage land after RBAC ships in M2."
        />
      </div>
    </>
  );
}
