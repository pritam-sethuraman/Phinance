import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankedBarList } from "@/components/charts/ranked-bar-list";
import { EmptyState } from "@/components/shared/empty-state";
import { CATEGORY_META } from "@/config/categories";
import { formatCents } from "@/lib/money";
import type { CategoryAmount } from "@/lib/services/analytics";

export function TopCategoriesSection({ data }: { data: CategoryAmount[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top spending categories</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No spending yet"
            description="Your top categories will show up here."
          />
        ) : (
          <>
            <p className="sr-only">
              Top {data.length} spending categories this month, ranked highest to lowest. Leading
              category is {CATEGORY_META[data[0]!.category].label} at {formatCents(data[0]!.amount)}.
            </p>
            <RankedBarList
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
