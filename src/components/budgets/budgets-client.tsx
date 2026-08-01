"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Wallet } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { BudgetCard } from "./budget-card";
import { BudgetFormDialog } from "./budget-form-dialog";
import { useMonthParam } from "@/hooks/use-month-param";
import { deleteBudgetAction } from "@/lib/actions/budget";
import { CATEGORIES, type CategoryKey } from "@/config/categories";
import type { UtilizationEntry } from "@/lib/services/budget";

export function BudgetsClient({
  month,
  entries,
}: {
  month: string;
  entries: UtilizationEntry[];
}) {
  const router = useRouter();
  const { setMonth } = useMonthParam();
  const [, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UtilizationEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const overall = entries.find((e) => e.category === null) ?? null;
  const categoryEntries = entries
    .filter(
      (e): e is UtilizationEntry & { category: CategoryKey } =>
        e.category !== null,
    )
    .sort(
      (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category),
    );

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(entry: UtilizationEntry) {
    setEditing(entry);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteBudgetAction(id);
      setDeletingId(null);

      if (!result.success) {
        toast.error(
          result.formError ?? "Couldn't delete the budget. Please try again.",
        );
        return;
      }
      toast.success("Budget deleted.");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-fib21">
      <div className="flex flex-wrap items-center justify-between gap-fib13">
        <Input
          type="month"
          value={month}
          onChange={(e) => e.target.value && setMonth(e.target.value)}
          className="w-fit"
          aria-label="Select month"
        />
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> New budget
        </Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No budgets set for this month"
          description="Set an overall budget and per-category limits to get warnings before you overspend."
          action={<Button onClick={openCreate}>+ New budget</Button>}
        />
      ) : (
        <div className="flex flex-col gap-fib21">
          {overall && (
            <BudgetCard
              entry={overall}
              title="Overall monthly budget"
              onEdit={() => openEdit(overall)}
              onDelete={() => handleDelete(overall.budgetId)}
              deleting={deletingId === overall.budgetId}
              size="lg"
            />
          )}

          {categoryEntries.length > 0 && (
            <div className="grid gap-fib13 sm:grid-cols-2">
              {categoryEntries.map((entry) => (
                <BudgetCard
                  key={entry.budgetId}
                  entry={entry}
                  onEdit={() => openEdit(entry)}
                  onDelete={() => handleDelete(entry.budgetId)}
                  deleting={deletingId === entry.budgetId}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <BudgetFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        month={month}
        existing={editing}
        usedCategories={categoryEntries.map((e) => e.category)}
        hasOverall={!!overall}
      />
    </div>
  );
}
