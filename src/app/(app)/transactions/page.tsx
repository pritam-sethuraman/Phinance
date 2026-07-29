import { ArrowLeftRight } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
  return (
    <div className="flex flex-col gap-fib21">
      <EmptyState
        icon={ArrowLeftRight}
        title="No transactions yet"
        description="Add/edit/delete, search, filter, sort, and pagination land in M3–M5. This is the shell only."
        action={<Button disabled>+ Add expense</Button>}
      />
    </div>
  );
}
