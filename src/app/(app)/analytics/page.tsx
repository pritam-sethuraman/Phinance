import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-fib21">
      <EmptyState
        icon={BarChart3}
        title="Analytics will appear once you have data"
        description="Trend, budget-vs-actual, category breakdown, and top categories — built with Recharts in M8."
      />
    </div>
  );
}
