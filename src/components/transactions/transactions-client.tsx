"use client";

import { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Plus, Pencil, Trash2, ArrowLeftRight, SearchX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { buildColumns } from "./columns";
import { TransactionFormDialog } from "./transaction-form-dialog";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";
import {
  createTransactionAction,
  updateTransactionAction,
  deleteTransactionAction,
} from "@/lib/actions/transaction";
import {
  transactionFormToInput,
  type TransactionFormValues,
} from "@/lib/validation/transaction";
import { formatCents } from "@/lib/money";
import { CATEGORY_META, type CategoryKey } from "@/config/categories";
import { cn } from "@/lib/utils";
import type { TransactionRow } from "./types";

const cardDateFormatter = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
});

export function TransactionsClient({
  initialItems,
  hasFilters = false,
  currency,
  locale,
}: {
  initialItems: TransactionRow[];
  hasFilters?: boolean;
  currency?: string;
  locale?: string;
}) {
  const [items, setItems] = useState<TransactionRow[]>(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TransactionRow | null>(null);
  const [deleting, setDeleting] = useState<TransactionRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingBusy, setDeletingBusy] = useState(false);

  // initialItems is a fresh array on every server render — which, for this
  // page, only happens on mount and when filters/sort/page change (M5).
  // Our own CRUD actions never navigate, so this doesn't fight with the
  // optimistic updates below.
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(txn: TransactionRow) {
    setEditing(txn);
    setDialogOpen(true);
  }

  async function handleSubmit(values: TransactionFormValues) {
    const input = transactionFormToInput(values);
    setSubmitting(true);

    if (editing) {
      const target = editing;
      const previous = items;
      setItems((prev) =>
        prev.map((t) =>
          t.id === target.id
            ? {
                ...t,
                ...input,
                merchant: input.merchant ?? null,
                note: input.note ?? null,
              }
            : t,
        ),
      );
      setDialogOpen(false);

      const result = await updateTransactionAction(target.id, input);
      setSubmitting(false);

      if (!result.success || !result.data) {
        setItems(previous);
        toast.error(
          result.formError ?? "Couldn't save changes. Please try again.",
        );
        return;
      }
      const confirmed = result.data;
      setItems((prev) => prev.map((t) => (t.id === target.id ? confirmed : t)));
      toast.success("Transaction updated.");
      return;
    }

    const tempId = `temp-${crypto.randomUUID()}`;
    const optimistic: TransactionRow = {
      id: tempId,
      userId: "",
      type: input.type,
      amount: input.amount,
      currency: "CAD",
      date: input.date,
      category: input.category,
      merchant: input.merchant ?? null,
      note: input.note ?? null,
      receiptUrl: null,
      budgetId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setItems((prev) => [optimistic, ...prev]);
    setDialogOpen(false);

    const result = await createTransactionAction(input);
    setSubmitting(false);

    if (!result.success || !result.data) {
      setItems((prev) => prev.filter((t) => t.id !== tempId));
      toast.error(
        result.formError ?? "Couldn't add the expense. Please try again.",
      );
      return;
    }
    const confirmed = result.data;
    setItems((prev) => prev.map((t) => (t.id === tempId ? confirmed : t)));
    toast.success("Expense added.");
  }

  async function handleConfirmDelete() {
    if (!deleting) return;
    const target = deleting;
    const previous = items;

    setDeletingBusy(true);
    setItems((prev) => prev.filter((t) => t.id !== target.id));
    setDeleting(null);

    const result = await deleteTransactionAction(target.id);
    setDeletingBusy(false);

    if (!result.success) {
      setItems(previous);
      toast.error(
        result.formError ??
          "Couldn't delete the transaction. Please try again.",
      );
      return;
    }
    toast.success("Transaction deleted.");
  }

  const columns = buildColumns({
    onEdit: openEdit,
    onDelete: setDeleting,
    currency,
    locale,
  });
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-fib21">
      <div className="hidden justify-end md:flex">
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add expense
        </Button>
      </div>

      {items.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={SearchX}
            title="No transactions match your filters"
            description="Try a different month, category, or search term — or clear filters above."
          />
        ) : (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions yet"
            description="Add your first expense to start tracking where your money goes."
            action={<Button onClick={openCreate}>+ Add expense</Button>}
          />
        )
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border md:block">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile stacked cards */}
          <div className="flex flex-col gap-fib8 pb-fib55 md:hidden">
            {items.map((txn) => (
              <TransactionCard
                key={txn.id}
                txn={txn}
                currency={currency}
                locale={locale}
                onEdit={() => openEdit(txn)}
                onDelete={() => setDeleting(txn)}
              />
            ))}
          </div>
        </>
      )}

      {/* Sticky mobile add button — sits above the bottom tab bar */}
      <Button
        onClick={openCreate}
        size="icon"
        className="fixed bottom-fib89 right-fib21 z-30 h-14 w-14 rounded-full shadow-lg md:hidden"
        aria-label="Add expense"
      >
        <Plus className="h-6 w-6" />
      </Button>

      <TransactionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editing}
        onSubmit={handleSubmit}
        submitting={submitting}
        currency={currency}
        locale={locale}
      />
      <DeleteTransactionDialog
        transaction={deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        onConfirm={handleConfirmDelete}
        busy={deletingBusy}
      />
    </div>
  );
}

function TransactionCard({
  txn,
  currency,
  locale,
  onEdit,
  onDelete,
}: {
  txn: TransactionRow;
  currency?: string;
  locale?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const meta = CATEGORY_META[txn.category as CategoryKey];
  const isIncome = txn.type === "INCOME";

  return (
    <div className="flex items-center justify-between gap-fib8 rounded-xl border border-border bg-card p-fib13">
      <div className="flex min-w-0 flex-col gap-fib1">
        <span className="truncate text-sm font-medium">
          {txn.merchant || meta.label}
        </span>
        <span className="flex items-center gap-fib5 text-xs text-muted-foreground">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: meta.color }}
            aria-hidden="true"
          />
          {meta.label} · {cardDateFormatter.format(new Date(txn.date))}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-fib3">
        <span
          className={cn(
            "font-mono text-sm font-medium",
            isIncome ? "text-status-ok" : "text-foreground",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCents(txn.amount, { currency, locale })}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          aria-label="Edit transaction"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          aria-label="Delete transaction"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
