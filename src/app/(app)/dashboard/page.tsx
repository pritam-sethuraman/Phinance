import { LayoutDashboard } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-fib21">
      <EmptyState
        icon={LayoutDashboard}
        title="Your dashboard will live here"
        description="Once transactions and budgets are wired up (M3–M7), this page shows current-month spend, remaining budget, a utilization gauge, a 6-month trend, recent transactions, and a category breakdown."
        action={<Button disabled>+ Add expense</Button>}
      />
    </div>
  );
}
