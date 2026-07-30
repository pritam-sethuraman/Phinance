import { ShieldCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminPage() {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-screen items-center justify-center p-fib21">
      <EmptyState
        icon={ShieldCheck}
        title={`Welcome, ${admin.name ?? admin.email}`}
        description="System stats, recent signups, and free-tier usage land in a later module. RBAC is live: only ADMIN accounts reach this page."
      />
    </div>
  );
}
