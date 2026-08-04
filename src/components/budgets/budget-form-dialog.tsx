"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  budgetFormSchema,
  budgetFormToInput,
  type BudgetFormValues,
} from "@/lib/validation/budget";
import { upsertBudgetAction } from "@/lib/actions/budget";
import {
  CATEGORIES,
  CATEGORY_META,
  type CategoryKey,
} from "@/config/categories";
import { formatCentsPlain } from "@/lib/money";
import type { UtilizationEntry } from "@/lib/services/budget";

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  month: string;
  existing?: UtilizationEntry | null;
  usedCategories: CategoryKey[];
  hasOverall: boolean;
  currency?: string;
  locale?: string;
}

export function BudgetFormDialog({
  open,
  onOpenChange,
  month,
  existing,
  usedCategories,
  hasOverall,
  currency,
  locale,
}: BudgetFormDialogProps) {
  const router = useRouter();
  const isEdit = !!existing;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: { category: "OVERALL", month, amountDollars: "" },
  });

  useEffect(() => {
    if (!open) return;
    reset(
      existing
        ? {
            category: existing.category ?? "OVERALL",
            month,
            amountDollars: formatCentsPlain(existing.limit, locale),
          }
        : { category: "OVERALL", month, amountDollars: "" },
    );
  }, [open, existing, month, reset]);

  const category = watch("category");

  // Create mode: only offer categories (and "Overall") that aren't already
  // budgeted this month — editing an existing one happens via its own card.
  const categoryOptions = useMemo(() => {
    if (isEdit) {
      return [
        {
          value: category,
          label:
            category === "OVERALL"
              ? "Overall (all spending)"
              : CATEGORY_META[category as CategoryKey].label,
        },
      ];
    }
    const available = CATEGORIES.filter((c) => !usedCategories.includes(c));
    return [
      ...(hasOverall
        ? []
        : [{ value: "OVERALL", label: "Overall (all spending)" }]),
      ...available.map((c) => ({ value: c, label: CATEGORY_META[c].label })),
    ];
  }, [isEdit, category, usedCategories, hasOverall]);

  async function onSubmit(values: BudgetFormValues) {
    const input = budgetFormToInput(values);
    const result = await upsertBudgetAction(input);

    if (!result.success) {
      toast.error(
        result.formError ?? "Couldn't save the budget. Please try again.",
      );
      return;
    }

    toast.success(isEdit ? "Budget updated." : "Budget created.");
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit budget" : "New budget"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the monthly limit."
              : "Set a spending limit for this month."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-fib13"
        >
          <div className="flex flex-col gap-fib5">
            <Label htmlFor="budget-category">Applies to</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setValue("category", v as BudgetFormValues["category"])
              }
              disabled={isEdit || categoryOptions.length === 0}
            >
              <SelectTrigger id="budget-category">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isEdit && categoryOptions.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Every category already has a budget this month.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="budget-amount">
              Monthly limit ({currency ?? "CAD"})
            </Label>
            <Input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0.00"
              aria-invalid={!!errors.amountDollars}
              {...register("amountDollars")}
            />
            {errors.amountDollars && (
              <p className="text-xs text-destructive">
                {errors.amountDollars.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || categoryOptions.length === 0}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Create budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
