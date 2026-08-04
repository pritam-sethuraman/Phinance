"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/lib/validation/transaction";
import { CATEGORIES, CATEGORY_META } from "@/config/categories";
import { formatCentsPlain } from "@/lib/money";
import type { TransactionRow } from "./types";

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: TransactionRow | null;
  onSubmit: (values: TransactionFormValues) => Promise<void> | void;
  submitting?: boolean;
  currency?: string;
  locale?: string;
}

function toDateInputValue(date: Date | string): string {
  return new Date(date).toISOString().slice(0, 10);
}

function emptyValues(): TransactionFormValues {
  return {
    type: "EXPENSE",
    amountDollars: "",
    date: toDateInputValue(new Date()),
    category: "OTHER",
    merchant: "",
    note: "",
  };
}

export function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  submitting,
  currency,
  locale,
}: TransactionFormDialogProps) {
  const isEdit = !!transaction;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: emptyValues(),
  });

  // Re-populate whenever the dialog opens — for a fresh "add" each time, or
  // the selected row's values when editing.
  useEffect(() => {
    if (!open) return;
    reset(
      transaction
        ? {
            type: transaction.type,
            amountDollars: formatCentsPlain(transaction.amount, locale),
            date: toDateInputValue(transaction.date),
            category: transaction.category,
            merchant: transaction.merchant ?? "",
            note: transaction.note ?? "",
          }
        : emptyValues(),
    );
  }, [open, transaction, reset]);

  const type = watch("type");
  const category = watch("category");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit transaction" : "Add expense"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details below."
              : "Log an expense or income entry in a few seconds."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-fib13"
        >
          <Tabs
            value={type}
            onValueChange={(v) =>
              setValue("type", v as TransactionFormValues["type"])
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="EXPENSE">Expense</TabsTrigger>
              <TabsTrigger value="INCOME">Income</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-fib13">
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="amountDollars">
                Amount ({currency ?? "CAD"})
              </Label>
              <Input
                id="amountDollars"
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
            <div className="flex flex-col gap-fib5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                aria-invalid={!!errors.date}
                {...register("date")}
              />
              {errors.date && (
                <p className="text-xs text-destructive">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                setValue("category", v as TransactionFormValues["category"])
              }
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_META[c].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              placeholder="Loblaws"
              {...register("merchant")}
            />
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              placeholder="Weekly groceries"
              {...register("note")}
            />
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="receipt" className="text-muted-foreground">
              Receipt (coming soon)
            </Label>
            <Input id="receipt" type="file" disabled />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? "Save changes" : "Add expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
