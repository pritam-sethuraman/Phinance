import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-fib21">
      <EmptyState
        icon={ShieldAlert}
        title="You don't have access to this page"
        description="This area is restricted to administrators."
        action={
          <Button asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />
    </div>
  );
}
