"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCents } from "@/lib/money";
import { CATEGORY_META, type CategoryKey } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { TransactionRow } from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
});

export function buildColumns({
  onEdit,
  onDelete,
  currency,
  locale,
}: {
  onEdit: (txn: TransactionRow) => void;
  onDelete: (txn: TransactionRow) => void;
  currency?: string;
  locale?: string;
}): ColumnDef<TransactionRow>[] {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => dateFormatter.format(new Date(row.original.date)),
    },
    {
      accessorKey: "merchant",
      header: "Merchant",
      cell: ({ row }) =>
        row.original.merchant || (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const meta = CATEGORY_META[row.original.category as CategoryKey];
        return (
          <span className="inline-flex items-center gap-fib5 text-sm">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: meta.color }}
              aria-hidden="true"
            />
            {meta.label}
          </span>
        );
      },
    },
    {
      accessorKey: "note",
      header: "Note",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.note || "—"}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const isIncome = row.original.type === "INCOME";
        return (
          <div
            className={cn(
              "text-right font-mono font-medium",
              isIncome ? "text-status-ok" : "text-foreground",
            )}
          >
            {isIncome ? "+" : "-"}
            {formatCents(row.original.amount, { currency, locale })}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-fib3">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${row.original.merchant ?? "transaction"}`}
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${row.original.merchant ?? "transaction"}`}
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}
