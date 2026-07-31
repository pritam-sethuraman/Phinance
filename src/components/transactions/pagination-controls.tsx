"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransactionFilters } from "./use-transaction-filters";

interface PaginationControlsProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function PaginationControls({ page, pageSize, total, totalPages }: PaginationControlsProps) {
  const { update } = useTransactionFilters();

  if (total === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-fib8 pt-fib5 sm:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-fib5">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => update({ page: page - 1 })}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>
        <span className="px-fib5 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => update({ page: page + 1 })}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
