"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TransactionFormDialog } from "@/components/transactions/transaction-form-dialog";
import { createTransactionAction } from "@/lib/actions/transaction";
import { transactionFormToInput, type TransactionFormValues } from "@/lib/validation/transaction";

/** Reuses the M4 transaction dialog directly rather than duplicating the form. */
export function QuickAddButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: TransactionFormValues) {
    setSubmitting(true);
    const input = transactionFormToInput(values);
    const result = await createTransactionAction(input);
    setSubmitting(false);

    if (!result.success) {
      toast.error(result.formError ?? "Couldn't add the expense. Please try again.");
      return;
    }
    toast.success("Expense added.");
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" /> Add expense
      </Button>
      <TransactionFormDialog open={open} onOpenChange={setOpen} onSubmit={handleSubmit} submitting={submitting} />
    </>
  );
}
