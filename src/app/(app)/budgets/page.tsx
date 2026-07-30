import { Wallet } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function BudgetsPage() {
  return (
    <div className="flex flex-col gap-fib21">
      <EmptyState
        icon={Wallet}
        title="No budgets set yet"
        description="Overall + per-category budgets with 80% warn / 100% over warnings ship in M6."
        action={<Button>+ New budget</Button>}
      />
    </div>
  );
}
