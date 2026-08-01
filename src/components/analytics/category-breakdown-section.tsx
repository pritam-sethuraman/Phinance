import { PieChart as PieChartIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieDonut } from "@/components/charts/pie-donut";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORY_META } from "@/config/categories";
import { formatCents, formatPercent } from "@/lib/money";
import type { CategoryAmount } from "@/lib/services/analytics";

export function CategoryBreakdownSection({ data }: { data: CategoryAmount[] }) {
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spending by category</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <EmptyState
            icon={PieChartIcon}
            title="No spending yet"
            description="Add some expenses to see your category breakdown."
          />
        ) : (
          <>
            <p className="sr-only">
              Spending by category this month. Largest category is {CATEGORY_META[data[0]!.category].label}{" "}
              at {formatCents(data[0]!.amount)}, {formatPercent(data[0]!.amount / total)} of total spending.
            </p>
            <PieDonut
              data={data.map((d) => ({
                label: CATEGORY_META[d.category].label,
                value: d.amount,
                color: CATEGORY_META[d.category].color,
              }))}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
